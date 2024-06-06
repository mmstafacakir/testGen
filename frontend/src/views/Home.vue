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
          <label class="edit-toggle">
            <input type="checkbox" v-model="isEditable" /> Düzenle
          </label>
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      </div>
      <div class="editor-container">
        <monaco-editor
          v-model="generatedCode"
          language="javascript"
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
        console.log('Generated code:', data.generatedCode);
        this.generatedCode = data.generatedCode;
      } catch (error) {
        console.error('Error generating code:', error);
      }
    },
    async runTests() {
      this.errorMessage = "";
      if (!this.generatedCode) {
        this.errorMessage = "Lütfen önce kod oluşturun.";
        return;
      }

      console.log('Running tests...');
      console.log('Generated code:', this.generatedCode);

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
        console.log('Test results:', data.testResults);
        this.testResults = data.testResults;
      } catch (error) {
        console.error('Error running tests:', error);
        this.errorMessage = "Testleri çalıştırırken bir hata oluştu. Lütfen kodun formatını kontrol edin.";
      }
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
  background-color: #2c3e50;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.navbar button {
  margin-right: 10px;
}
.navbar span {
  color: white;
}
.main-container {
  display: flex;
  flex: 1;
}
.controls {
  background-color: #ecf0f1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 250px;
}
.auth-inputs input, .buttons button {
  margin-bottom: 10px;
  width: 100%;
}
.checkboxes {
  margin-bottom: 20px;
}
.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
}
.code-editor {
  flex: 1;
  margin-bottom: 10px;
}
.result-container {
  height: 200px;
  padding: 10px;
}
.results-textarea {
  height: 100%;
  resize: none;
  width: 100%;
}
.edit-toggle {
  margin-top: 10px;
}
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
