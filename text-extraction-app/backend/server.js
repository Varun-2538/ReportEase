const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for extracting text from a PDF or image
app.post('/extract-text', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const fileBuffer = req.file.buffer;
        const fileType = req.file.mimetype;
        let text;

        if (fileType === 'application/pdf') {
            // PDF text extraction using pdf-parse
            const data = await pdfParse(fileBuffer);
            text = data.text;
        } else if (fileType.startsWith('image/')) {
            // Image text extraction using tesseract.js
            const { data } = await Tesseract.recognize(fileBuffer);
            text = data.text;
        } else {
            return res.status(400).send('Unsupported file type.');
        }

        res.status(200).json({ text });
    } catch (error) {
        console.error('Error during text extraction:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
