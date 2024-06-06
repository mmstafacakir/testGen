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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthHeaders = exports.cliTokens = exports.getSecuritySchemes = void 0;
const cli_1 = require("./cli");
function getSecuritySchemes(api) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (api.openapi) {
            // OpenAPI 3.0 için
            return (_a = api.components) === null || _a === void 0 ? void 0 : _a.securitySchemes;
        }
        else if (api.swagger) {
            // Swagger 2.0 için
            return api.securityDefinitions;
        }
        return undefined;
    });
}
exports.getSecuritySchemes = getSecuritySchemes;
// // API çağrısı için gerekli güvenlik başlıklarını oluşturma
// export function getAuthHeaders(securitySchemes: Record<string, SecurityScheme> | undefined, requiredSchemes: Array<Record<string, string[]>>, credentials: Record<string, string>): Record<string, string> {
//     let headers: Record<string, string> = {};
//     if (!securitySchemes) {
//         console.log("No security schemes provided.");
//         return headers; // Eğer securitySchemes tanımlı değilse, boş bir başlık döndür.
//     }
//     // console.log("Security Schemes Available:", securitySchemes);
//     // console.log("Required Schemes:", requiredSchemes);
//     requiredSchemes.forEach(security => {
//         Object.entries(security).forEach(([key, scopes]) => {
//             // console.log("Processing security key:", key); // Hangi anahtarın işlendiğini göster
//             const scheme = securitySchemes[key];
//             if (!scheme) {
//                 // console.log("No scheme found for key:", key);
//                 return; // Eğer şema veya şema adı tanımlı değilse, bu yinelemeyi atla.
//             }
//             //console.log("Scheme details:", scheme);
// switch (scheme.type) {
//     case 'apiKey':
//         if (scheme.name && scheme.in === 'header') {
//             headers[scheme.name] = 'YOUR_API_KEY';
//         } else {
//             console.error("Scheme name or placement is undefined or incorrect", scheme);
//         }
//         break;
//                 case 'http':
//                     if (scheme.scheme === 'bearer') {
//                         headers['Authorization'] = 'Bearer YOUR_ACCESS_TOKEN';
//                     }
//                     break;
//                 case 'oauth2':
//                     headers['Authorization'] = 'Bearer YOUR_OAUTH_ACCESS_TOKEN'; // OAuth2 için gereken erişim belirteci.
//                     break;
//                 default:
//                     console.error("Unsupported security scheme type:", scheme.type);
//             }
//         });
//     });
//     //console.log("Generated Headers:", headers);
//     return headers;
// }
function cliTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const cliArgs = yield (0, cli_1.cli)();
        let authTokens = {
            Bearer: (_a = cliArgs.Bearer) !== null && _a !== void 0 ? _a : "",
            apiKey: (_b = cliArgs.apiKey) !== null && _b !== void 0 ? _b : "",
            oAuth2: (_c = cliArgs.oauth2) !== null && _c !== void 0 ? _c : ""
        };
        return authTokens;
    });
}
exports.cliTokens = cliTokens;
function getAuthHeaders(securitySchemes, requiredSchemes, tokens) {
    let headers = {};
    if (!securitySchemes) {
        console.log("No security schemes provided.");
        return headers;
    }
    requiredSchemes.forEach(security => {
        Object.entries(security).forEach(([key, scopes]) => {
            const scheme = securitySchemes[key];
            if (!scheme) {
                console.error("No scheme found for key:", key);
                return;
            }
            switch (scheme.type) {
                case 'apiKey':
                    if (scheme.name && scheme.in === 'header' && tokens.apiKey) {
                        headers[scheme.name] = tokens.apiKey;
                    }
                    else {
                        console.error("API Key scheme name, placement, or token is undefined or incorrect", scheme);
                    }
                    break;
                case 'http':
                    if (scheme.scheme === 'bearer' && tokens.Bearer) {
                        headers['Authorization'] = `Bearer ${tokens.Bearer}`;
                    }
                    break;
                case 'oauth2':
                    headers['Authorization'] = `Bearer ${tokens.oAuth2}`;
                    break;
                default:
                    console.error("Unsupported security scheme type:", scheme.type);
            }
        });
    });
    return headers;
}
exports.getAuthHeaders = getAuthHeaders;
