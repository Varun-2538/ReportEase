import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setResult(response.data.result);
      } else {
        alert('Error extracting text.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    }
  };

  return (
    <div className="App">
      <h1>Text Extraction</h1>
      <input type="file" accept=".pdf, .png, .jpg, .jpeg" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
      <div>
        {result && (
          <>
            <h2>Extracted Text:</h2>
            <pre>{result}</pre>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
