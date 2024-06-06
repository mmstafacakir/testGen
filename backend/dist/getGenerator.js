"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGetAxiosCodeFromSwagger = exports.generateGetAxiosCode = void 0;
const SwaggerParser = require("@apidevtools/swagger-parser");
const generateUrl_1 = __importDefault(require("../src/generateUrl"));
const generateValue_1 = require("../src/generateValue");
const auth_1 = require("../src/auth");
function getBaseUrl(api) {
    if (api.servers && api.servers.length > 0) {
        return api.servers[0].url;
    }
    else if (api.host) {
        let scheme = (api.schemes && api.schemes[0]) || 'http';
        let basePath = api.basePath || '';
        return `${scheme}://${api.host}${basePath}`;
    }
    return '';
}
function generateGetAxiosCode(swaggerFilePath, args) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const api = yield SwaggerParser.parse(swaggerFilePath);
            const securitySchemes = yield (0, auth_1.getSecuritySchemes)(api);
            let baseUrl = getBaseUrl(api);
            //const cliArgs = await cli() as CLIArguments;
            let fileContent = 'import { sendGetRequest } from "../src/sendRequests";\n\n';
            if (api.paths) {
                for (const [path, pathItem] of Object.entries(api.paths)) {
                    const operation = pathItem['get'];
                    if (operation) {
                        let authTokens = {
                            Bearer: (args === null || args === void 0 ? void 0 : args.Bearer) || "Need Token",
                            apiKey: (args === null || args === void 0 ? void 0 : args.apiKey) || "Need Key",
                            oAuth2: (args === null || args === void 0 ? void 0 : args.oAuth2) || "Need Token"
                        };
                        if (!args) {
                            authTokens = yield (0, auth_1.cliTokens)();
                        }
                        //console.log("authTokens", authTokens);
                        let headers = operation.security ? (0, auth_1.getAuthHeaders)(securitySchemes, operation.security, authTokens) : {};
                        let queryParams = [];
                        let pathParams = {};
                        (_a = operation.parameters) === null || _a === void 0 ? void 0 : _a.forEach(param => {
                            let defaultValue = (0, generateValue_1.handleParameter)(param);
                            if (param.name === 'api_key') {
                                headers[param.name] = authTokens.apiKey;
                            }
                            else if (param.name === 'oAuth2') {
                                headers[param.name] = authTokens.oAuth2;
                            }
                            else if (param.in === 'query') {
                                queryParams.push(`${param.name}=${encodeURIComponent(defaultValue)}`);
                            }
                            else if (param.in === 'path') {
                                pathParams[param.name] = defaultValue;
                            }
                        });
                        let fullPath = (0, generateUrl_1.default)(baseUrl, path, pathParams);
                        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
                        const fullUrl = `${fullPath}${queryString}`;
                        fileContent += `sendGetRequest('GET', '${fullUrl}', ${JSON.stringify(headers)});\n`;
                    }
                }
                // fs.writeFileSync(filePath, fileContent, 'utf8');
                // console.log(`Generated test file at ${filePath}`);
                return fileContent;
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error in GET generator: ${error.message}`);
            }
            else {
                console.error(`An unexpected error occurred`);
            }
        }
    });
}
exports.generateGetAxiosCode = generateGetAxiosCode;
// async function main() {
//     try {
//         const cliArgs = await cli();
//         await generateGetAxiosCode(cliArgs.file);
//     } catch (error: any) {
//         console.error(`Error in GET generator: ${error.message}`);
//     }
// }
// main();
function generateGetAxiosCodeFromSwagger(swaggerFilePath, args) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const api = yield SwaggerParser.parse(swaggerFilePath);
        const securitySchemes = yield (0, auth_1.getSecuritySchemes)(api);
        let baseUrl = getBaseUrl(api);
        let requests = [];
        for (const [path, pathItem] of Object.entries(api.paths)) {
            const operation = pathItem.get;
            if (operation) {
                let authTokens = {
                    Bearer: (args === null || args === void 0 ? void 0 : args.Bearer) || "Need Token",
                    apiKey: (args === null || args === void 0 ? void 0 : args.apiKey) || "Need Key",
                    oAuth2: (args === null || args === void 0 ? void 0 : args.oAuth2) || "Need Token"
                };
                if (!args) {
                    authTokens = yield (0, auth_1.cliTokens)();
                }
                let headers = operation.security ? (0, auth_1.getAuthHeaders)(securitySchemes, operation.security, authTokens) : {};
                let queryParams = [];
                let pathParams = {};
                (_a = operation.parameters) === null || _a === void 0 ? void 0 : _a.forEach(param => {
                    let defaultValue = (0, generateValue_1.handleParameter)(param);
                    if (param.in === 'header') {
                        headers[param.name] = defaultValue;
                    }
                    else if (param.in === 'query') {
                        queryParams.push(`${param.name}=${encodeURIComponent(defaultValue)}`);
                    }
                    else if (param.in === 'path') {
                        pathParams[param.name] = defaultValue;
                    }
                });
                let fullPath = (0, generateUrl_1.default)(baseUrl, path, pathParams);
                const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
                const fullUrl = `${fullPath}${queryString}`;
                requests.push(`sendGetRequest('GET', '${fullUrl}', ${JSON.stringify(headers)});`);
            }
        }
        return requests;
    });
}
exports.generateGetAxiosCodeFromSwagger = generateGetAxiosCodeFromSwagger;
