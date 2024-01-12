const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const PDFParser = require("pdf-parse");
const cors = require("cors");
const axios = require("axios"); // Add this line to use axios
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

// Setup multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/extract", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  try {
    const buffer = req.file.buffer;
    let text = "";

    if (req.file.mimetype === "application/pdf") {
      // Extract text from PDF
      const pdfData = await PDFParser(buffer);
      text = pdfData.text;
    } else {
      // Extract text from images (Hindi and English)
      const tesseractData = await Tesseract.recognize(buffer, "eng+hin", {
        logger: (m) => console.log(m),
      });
      text = tesseractData.data.text;
    }

    // Send the extracted text to the Flask API
    try {
      const flaskResponse = await axios.post(
        "http://127.0.0.1:5000/suggest_ipc", // Replace with your Flask server URL
        { extracted_text: text }
      );

      console.log("IPC Suggestions:", flaskResponse.data.ipc_suggestions);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ result: error.message });
    }

    res.json({ result: text });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ result: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Text Extraction Service");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
