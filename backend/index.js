const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { generateAllRequests } = require("./src/allGenerator");
const { runCode } = require("./runCode");
const { generatePostAxiosCode } = require("./src/postGenerator");
const { generateGetAxiosCode } = require("./src/getGenerator");
const { generatePutAxiosCode } = require("./src/putGenerator");
const { generateDeleteAxiosCode } = require("./src/deleteGenerator");

const app = express();
const port = 3000;

const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.post("/generate-code", upload.single("file"), async (req, res) => {
  console.log("File uploaded:", req.file);
  console.log("Request body:", req.body);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  const authTokens = JSON.parse(req.body.authTokens);
  const selectedGenerators = JSON.parse(req.body.selectedGenerators);

  let generatedCode = "";

  try {
    if (selectedGenerators.includes("All Methods Generator")) {
      generatedCode = await generateAllRequests(filePath, authTokens);
      console.log("Generated code:", generatedCode);
    }
    if (selectedGenerators.includes("Post Generator")) {
      generatedCode = await generatePostAxiosCode(filePath, authTokens);
      console.log("Generated code:", generatedCode);
    }
    if (selectedGenerators.includes("Get Generator")) {
      generatedCode = await generateGetAxiosCode(filePath, authTokens);
      console.log("Generated code:", generatedCode);
    }
    if (selectedGenerators.includes("Put Generator")) {
      generatedCode = await generatePutAxiosCode(filePath, authTokens);
      console.log("Generated code:", generatedCode);
    }
    if (selectedGenerators.includes("Delete Generator")) {
      generatedCode = await generateDeleteAxiosCode(filePath, authTokens);
      console.log("Generated code:", generatedCode);
    }
  } catch (error) {
    console.error("Error generating code:", error);
    return res.status(500).json({ error: "Error generating code" });
  }

  res.json({ generatedCode });
});

app.post("/run-tests", async (req, res) => {
  const code = req.body.code;
  console.log("Running tests with code:", code);

  try {
    const testResults = await runCode(code);
    res.json({ testResults });
  } catch (error) {
    console.error("Error running tests:", error);
    res.status(500).json({ error: "Error running tests" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
