import React, { useState } from "react";  
import axios from "axios";               

function App() {
  const [file, setFile] = useState(null);  
  const [text, setText] = useState("");   

  const handleUpload = async () => {
    const formData = new FormData();       
    formData.append("file", file);         

    const res = await axios.post("https://pdf-to-text-tg44.onrender.com/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setText(res.data.text);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>PDF to Text</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <button onClick={handleUpload}>Upload</button>

      <pre>{text}</pre>
    </div>
  );
}

export default App;