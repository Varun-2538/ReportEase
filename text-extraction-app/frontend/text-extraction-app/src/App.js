import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [extractedText, setExtractedText] = useState('');

  const extractText = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:3000/extract-text', formData);
      setExtractedText(response.data.text);
    } catch (error) {
      console.error('Error during text extraction:', error);
      setExtractedText('An error occurred during text extraction.');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      extractText(file);
    } else {
      alert('Please select a PDF or image file.');
    }
  };

  return (
    <div className="container">
      <label htmlFor="fileInput">Browse</label>
      <input type="file" id="fileInput" onChange={handleFileChange} />

      {extractedText && (
        <div id="output">
          <p>Text extracted:</p>
          <pre>{extractedText}</pre>
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(extractedText)}`}
            download="extracted_text.txt"
          >
            Download Text
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
