const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const tesseract = require('node-tesseract-ocr');
const axios = require('axios');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());
const port = 3000;

// Endpoint to handle file upload and text extraction (images only)
app.post('/extract', upload.single('file'), async (req, res) => {
    console.log('Received a request to extract text.');
    if (!req.file) {
        console.warn('No file uploaded.');
        return res.status(400).send('No file uploaded.');
    }

    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const imagePath = req.file.path;

    console.log(`Uploaded file details: ${JSON.stringify(req.file)}`);
    console.log(`File extension: ${fileExtension}`);

    try {
        let extractedText = '';

        // Handle only image files
        if (['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
            console.log('Processing image file...');
            const config = {
                lang: 'eng+hin',
                tessdataDir: '/usr/src/app',
                oem: 1,
                psm: 3,
            };
            extractedText = await tesseract.recognize(imagePath, config);
        } else {
            console.warn('Unsupported file format.');
            return res.status(400).send('Unsupported file format. Only .jpg, .jpeg, and .png are supported.');
        }

        // Log the extracted text
        console.log('Extracted Text:', extractedText);

        // Send the extracted text to the Flask API
        try {
            console.log('Sending extracted text to Flask API.');
            const flaskResponse = await axios.post(
                "http://host.docker.internal:5000/suggest_ipc", // Use host.docker.internal for local testing
                { extracted_text: extractedText }
            );

            console.log("IPC Suggestions received:", flaskResponse.data.ipc_suggestions);
            res.json({ result: extractedText, ipcSuggestions: flaskResponse.data.ipc_suggestions });
        } catch (error) {
            console.error('Error communicating with Flask API:', error.message);
            res.status(500).send({ result: error.message });
        }
    } catch (error) {
        console.error('Error occurred during file processing:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        console.log(`Cleaning up uploaded file: ${imagePath}`);
        fs.unlinkSync(imagePath); // Cleanup the uploaded file
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});