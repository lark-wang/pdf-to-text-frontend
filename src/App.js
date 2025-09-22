import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const canvasRef = useRef(null);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setText("");

    try {
   
      setPdfUrl(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "https://pdf-to-text-tg44.onrender.com/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setText(res.data.text);
    } catch (err) {
      console.error(err);
      setText("Error processing PDF");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfUrl) return;
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.2 });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;
    };

    renderPage();
  }, [pdfUrl]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>PDF to Text</h1>
      <p>
        Try the demo: upload a sample PDF page from {" "}
    <a
      href="https://drive.google.com/drive/folders/15wiwux3TV_Diz5N4tYep-5BMFhFOaHG_?usp=sharing"
      target="_blank"
      rel="noopener noreferrer"
    >
      this link
        </a>{" "}
    and extract the text.

        Note: Processing may take a little while, especially on the first request as the server wakes up.
      </p>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload"}
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
    
        <div>
          <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }}></canvas>
        </div>


        <div
          style={{
            background: "#f9f9f9",
            padding: "10px",
            display: "inline-block", 
            maxWidth: "100%",
            whiteSpace: "pre-wrap",
            border: "1px solid #ddd",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

export default App;
