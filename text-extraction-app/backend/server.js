const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pdfPoppler = require('pdf-poppler');
const Tesseract = require('tesseract.js');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());
const port = 3000;

// Function to extract text from PDF using Tesseract
async function extractTextFromPDF(pdfPath, outputDirectory) {
    let opts = {
        format: 'png',
        out_dir: outputDirectory,
        out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
        dpi: 300
    };

    await pdfPoppler.convert(pdfPath, opts);

    const files = fs.readdirSync(outputDirectory);
    let allText = '';

    for (let file of files) {
        if (file.includes(path.basename(pdfPath, path.extname(pdfPath)))) {
            const outputImagePath = path.join(outputDirectory, file);
            const { data: { text } } = await Tesseract.recognize(outputImagePath, 'eng+hin');
            allText += text + '\n';
            fs.unlinkSync(outputImagePath);
        }
    }

    return allText;
}

app.post('/extract', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const pdfPath = req.file.path;
    const outputDirectory = path.join(__dirname, 'output');

    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
    }

    let extractedText = '';

    try {
        if (fileExtension === '.pdf') {
            extractedText = await extractTextFromPDF(pdfPath, outputDirectory);
        } else if (['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
            // If it's an image, perform OCR directly on the image
            const { data: { text } } = await Tesseract.recognize(pdfPath, 'eng+hin');
            extractedText = text;
        } else {
            return res.status(400).send('Unsupported file format.');
        }

        res.json({ result: extractedText });
        fs.unlinkSync(pdfPath);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
