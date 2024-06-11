<template>
  <div class="home">
    <nav class="navbar">
      <button @click="uploadFile">Dosya Seç</button>
      <input type="file" ref="fileInput" @change="onFileChange" style="display: none" />
      <span>{{ selectedFile ? selectedFile.name : "No file selected" }}</span>
    </nav>
    <div class="main-container">
      <div class="controls">
        <div class="auth-inputs">
          <input type="text" v-model="authTokens.Bearer" placeholder="Bearer Token" />
          <input type="text" v-model="authTokens.apiKey" placeholder="API Key" />
          <input type="text" v-model="authTokens.oAuth2" placeholder="OAuth2 Token" />
        </div>
        <div class="checkboxes">
          <label><input type="radio" value="Post Generator" v-model="selectedGenerator" /> Post Generator</label>
          <label><input type="radio" value="Get Generator" v-model="selectedGenerator" /> Get Generator</label>
          <label><input type="radio" value="Put Generator" v-model="selectedGenerator" /> Put Generator</label>
          <label><input type="radio" value="Delete Generator" v-model="selectedGenerator" /> Delete Generator</label>
          <label><input type="radio" value="All Methods Generator" v-model="selectedGenerator" /> All Methods Generator</label>
        </div>
        <div class="buttons">
          <button @click="generateCode">Generate Code</button>
          <button @click="runTests">Run Tests</button>
          <button @click="downloadCode">Download Code</button>
          <button @click="downloadBoilerplate">Download Boilerplate</button>
          <label class="edit-toggle">
            <input type="checkbox" v-model="isEditable" /> Düzenle
          </label>
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      </div>
      <div class="editor-container">
        <monaco-editor
          v-model="generatedCode"
          language="typescript"
          theme="vs-dark"
          :options="{ readOnly: !isEditable }"
          class="code-editor"
        />
        <div class="result-container">
          <textarea ref="resultsTextarea" v-model="testResults" class="results-textarea" readonly></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MonacoEditor from "@guolao/vue-monaco-editor";
import SwaggerParser from "swagger-parser";
import yaml from "js-yaml";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default {
  components: {
    MonacoEditor
  },
  data() {
    return {
      authTokens: {
        Bearer: "",
        apiKey: "",
        oAuth2: ""
      },
      selectedGenerator: '',
      generatedCode: "",
      testResults: "",
      selectedFile: null,
      isEditable: false,
      errorMessage: ""
    };
  },
  methods: {
    uploadFile() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      this.errorMessage = "";
      this.validateSwaggerFile();
    },
    async validateSwaggerFile() {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const content = e.target.result;
            if (this.selectedFile.name.endsWith(".json")) {
              await SwaggerParser.validate(JSON.parse(content));
            } else if (this.selectedFile.name.endsWith(".yaml") || this.selectedFile.name.endsWith(".yml")) {
              const jsonContent = yaml.load(content);
              await SwaggerParser.validate(jsonContent);
            } else {
              throw new Error("Unsupported file format");
            }
            this.errorMessage = "";
          } catch (error) {
            this.errorMessage = "Yüklenen dosya geçerli bir Swagger dökümanı değil.";
            this.selectedFile = null;
          }
        };
        reader.readAsText(this.selectedFile);
      } catch (error) {
        this.errorMessage = "Dosya okunurken hata oluştu.";
        this.selectedFile = null;
      }
    },
    async generateCode() {
      this.errorMessage = "";
      this.testResults = "";  // Clear test results
      this.$refs.resultsTextarea.readOnly = true;  // Set read-only

      if (!this.selectedFile) {
        this.errorMessage = "Lütfen bir dosya seçiniz.";
        return;
      }
      if (!this.selectedGenerator) {
        this.errorMessage = "Lütfen bir metot seçiniz.";
        return;
      }

      console.log('Generating code...');
      console.log('Selected file:', this.selectedFile);
      console.log('Auth tokens:', this.authTokens);
      console.log('Selected generator:', this.selectedGenerator);

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('authTokens', JSON.stringify(this.authTokens));
      formData.append('selectedGenerators', JSON.stringify([this.selectedGenerator]));

      try {
        const response = await fetch('http://localhost:3000/generate-code', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Error in response:', error);
          return;
        }

        const data = await response.json();
        this.generatedCode = data.generatedCode;
      } catch (error) {
        console.error('Error generating code:', error);
        this.errorMessage = "Kod oluşturulurken hata oluştu.";
      }
    },
    async runTests() {
      this.errorMessage = "";
      this.testResults = "";  // Clear test results

      if (!this.generatedCode) {
        this.errorMessage = "Lütfen kodu oluşturunuz.";
        return;
      }

      console.log("Running tests with code:", this.generatedCode);

      try {
        const response = await fetch('http://localhost:3000/run-tests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code: this.generatedCode })
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Error in response:', error);
          return;
        }

        const data = await response.json();
        this.testResults = data.testResults.join('\n');
      } catch (error) {
        console.error('Error running tests:', error);
        this.errorMessage = "Testler çalıştırılırken hata oluştu.";
      }
    },
    downloadCode() {
      const blob = new Blob([this.generatedCode], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "generatedCode.ts");
    },
    async downloadBoilerplate() {
      const zip = new JSZip();
      const srcFolder = zip.folder("src");

      // Add necessary boilerplate files
      const packageJson = `
      {
        "name": "api-tester",
        "version": "1.0.0",
        "main": "index.js",
        "license": "MIT",
        "scripts": {
          "start": "ts-node src/tempCode.ts"
        },
        "dependencies": {
          "axios": "^0.21.1"
        },
        "devDependencies": {
          "@types/node": "^14.14.37",
          "ts-node": "^9.1.1",
          "typescript": "^4.2.3"
        }
      }
      `;
      const tsconfigJson = `
      {
        "compilerOptions": {
          "target": "es6",
          "module": "commonjs",
          "strict": true,
          "esModuleInterop": true,
          "skipLibCheck": true,
          "forceConsistentCasingInFileNames": true
        }
      }
      `;
      const indexJs = `
      const { exec } = require("child_process");
      const fs = require("fs");
      const path = require("path");

      async function runCode(code) {
          const tempTsFilePath = path.join(__dirname, "src", "tempCode.ts");
          fs.writeFileSync(tempTsFilePath, code);

          const command = \`npx ts-node --project \${path.join(__dirname, "tsconfig.json")} \${tempTsFilePath}\`;
          return new Promise((resolve, reject) => {
              exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
                  try {
                      fs.unlinkSync(tempTsFilePath);
                  } catch (err) {
                      console.error(\`Failed to delete temporary file: \${err.message}\`);
                  }

                  if (error) {
                      console.error(\`Error running tests: \${stderr || error.message}\`);
                      return reject(\`Error running tests: \${stderr || error.message}\`);
                  }

                  const results = stdout.split('\\n').filter(line => line.includes('Request to') || line.includes('Error in'));
                  resolve(results);
              });
          });
      }

      module.exports = { runCode };
      `;
      const sendRequestsTs = `
      import axios from 'axios';

      export async function sendGetRequest(method: string, url: string, headers: Record<string, string>) {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
          let config = {
              method: method,
              url: url,
              headers: headers,
          };

          try {
              const response = await axios(config);
              console.log(\`\${config.method.toUpperCase()} Request to \${config.url}: Status code \${response.status}\`);
              return \`\${config.method.toUpperCase()} Request to \${config.url}: Status code \${response.status}\`;
          } catch (error) {
              console.error(\`Error in \${config.method.toUpperCase()} Request to \${config.url}:\`, error.message);
              return \`Error in \${config.method.toUpperCase()} Request to \${config.url}: \${error.message}\`;
          }
      }

      export async function sendPostRequest(method: string, url: string, headers: Record<string, string>, data: any) {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
          let config = {
              method: method,
              url: url,
              headers: headers,
              data: data
          };

          try {
              const response = await axios(config);
              console.log(\`\${config.method.toUpperCase()} Request to \${config.url}: Status code \${response.status}\`);
              return \`\${config.method.toUpperCase()} Request to \${config.url}: Status code \${response.status}\`;
          } catch (error) {
              console.error(\`Error in \${config.method.toUpperCase()} Request to \${config.url}:\`, error.message);
              return \`Error in \${config.method.toUpperCase()} Request to \${config.url}: \${error.message}\`;
          }
      }

      export async function sendPutRequest(method: string, url: string, headers: Record<string, string>, data: any) {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
          let config = {
              method: method,
              url: url,
              headers: headers,
              data: data
          };

          try {
              const response = await axios(config);
              console.log(\`\${config.method.toUpperCase()} Request to \${config.url}: Status code \${response.status}\`);
              return \`\${config.method.toUpperCase()} Request to \${config.url}: Status code \${response.status}\`;
          } catch (error) {
              console.error(\`Error in \${config.method.toUpperCase()} Request to \${config.url}:\`, error.message);
              return \`Error in \${config.method.toUpperCase()} Request to \${config.url}: \${error.message}\`;
          }
      }

      export async function sendDeleteRequest(method: string, url: string, headers: Record<string, string>) {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
          let config = {
              method: method,
              url: url,
              headers: headers,
          };

          try {
              const response = await axios(config);
              console.log(\`\${config.method.toUpperCase()} Request to \${config.url}: Status code \${response.status}\`);
              return \`\${config.method.toUpperCase()} Request to \${config.url}: Status code \${response.status}\`;
          } catch (error) {
              console.error(\`Error in \${config.method.toUpperCase()} Request to \${config.url}:\`, error.message);
              return \`Error in \${config.method.toUpperCase()} Request to \${config.url}: \${error.message}\`;
          }
      }
      `;
      const tempCodeTs = this.generatedCode;

      zip.file("package.json", packageJson);
      zip.file("tsconfig.json", tsconfigJson);
      zip.file("index.js", indexJs);
      srcFolder.file("sendRequests.ts", sendRequestsTs);
      srcFolder.file("tempCode.ts", tempCodeTs);

      const nodeModulesCommand = `
      mkdir -p boilerplate && cd boilerplate && npm init -y && npm install axios @types/node ts-node typescript
      `;
      const nodeModulesFolder = zip.folder("boilerplate");
      nodeModulesFolder.file("install.sh", nodeModulesCommand);

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "boilerplate.zip");
    }
  }
};
</script>

<style>
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.navbar {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #333;
  color: #fff;
}

.main-container {
  display: flex;
  flex: 1;
}

.controls {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #f4f4f4;
  width: 300px;
}

.auth-inputs input {
  margin-bottom: 10px;
  padding: 8px;
  width: 90%;
}

.checkboxes label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.buttons button {
  margin-bottom: 10px;
  padding: 8px;
  width: 100%;
}

.editor-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.code-editor {
  flex: 1;
}

.result-container {
  height: 200px;
  background-color: #333;
  color: #fff;
}

.results-textarea {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #333;
  color: #fff;
  border: none;
  resize: none;
}.error-message {
  color: red;
  margin-top: 10px;
}
</style>
