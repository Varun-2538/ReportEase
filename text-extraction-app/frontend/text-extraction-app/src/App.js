import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [ipcSuggestions, setIpcSuggestions] = useState([]); // State to store IPC suggestions
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/extract",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data.result);

      // Send extracted text to get IPC suggestions
      const ipcResponse = await axios.post(
        "http://localhost:5000/suggest_ipc", // Replace with your Flask server URL
        { extracted_text: response.data.result }
      );

      // Update state with IPC suggestions
      setIpcSuggestions(ipcResponse.data.ipc_suggestions);
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    }

    setUploading(false);
  };

  return (
    <div className="container mt-5">
      {/* ... Your existing code ... */}

      {ipcSuggestions.length > 0 && (
        <div className="card w-100 mt-4">
          <div className="card-body">
            <h2 className="card-title">IPC Suggestions:</h2>
            <ul>
              {ipcSuggestions.map((ipc, index) => (
                <li key={index}>{ipc}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
