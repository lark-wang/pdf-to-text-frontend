import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");      

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file first!");
      return;
    }

    setLoading(true);
    setError("");
    setText("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "https://pdf-to-text-tg44.onrender.com/upload", 
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 120000, 
        }
      );

      setText(res.data.text);
    } catch (err) {
      console.error(err);
      setError("Failed to upload or process the PDF. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>PDF to Text</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        disabled={loading}
      />

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        style={{ marginLeft: "10px" }}
      >
        {loading ? "Processing..." : "Upload"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {text && (
        <div style={{ marginTop: "20px" }}>
          <h2>Extracted Text:</h2>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f4f4f4",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {text}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
