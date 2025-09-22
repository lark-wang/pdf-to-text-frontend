import React, { useState } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [text, setText] = useState("");

  const handleFileChange = async (e) => {
    const pdfFile = e.target.files[0];
    setFile(pdfFile);

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;
      setPreview(canvas.toDataURL());
    };
    fileReader.readAsArrayBuffer(pdfFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "https://pdf-to-text-tg44.onrender.com/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    setText(res.data.text);
  };

  return (
    <div style={{ padding: "20px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <div style={{ width: "100%" }}>
        <p style={{ fontStyle: "italic", marginBottom: "10px" }}>
          Take a link to this PDF page and get the text.  
          <br />
          Note: processing may take a few minutes.
        </p>

        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
          Upload
        </button>
      </div>

      <div style={{ flex: 1 }}>
        <h2>PDF Preview</h2>
        {preview && (
          <img
            src={preview}
            alt="PDF page"
            style={{ width: "100%", border: "1px solid #ccc" }}
          />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <h2>Extracted Text</h2>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "8px",
            maxWidth: "fit-content",
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </pre>
      </div>
    </div>
  );
}

export default App;
