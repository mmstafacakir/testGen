const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

async function runCode(code) {
  const tempTsFilePath = path.join(__dirname, "src", "tempCode.ts");
  fs.writeFileSync(tempTsFilePath, code);

  const command = `npx ts-node --project ${path.join(__dirname, "tsconfig.json")} ${tempTsFilePath}`;
  return new Promise((resolve, reject) => {
    exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
      try {
        fs.unlinkSync(tempTsFilePath);
      } catch (err) {
        console.error(`Failed to delete temporary file: ${err.message}`);
      }

      if (error) {
        return reject(`Error running tests: ${stderr || error.message}`);
      }
      resolve(stdout);
    });
  });
}

module.exports = { runCode };
