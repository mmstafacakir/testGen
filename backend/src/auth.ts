import { cli } from './cli';
import { APIResponse, SecurityScheme, CLIArguments } from './interfaces';

export async function getSecuritySchemes(api: APIResponse): Promise<Record<string, SecurityScheme> | undefined> {
    if (api.openapi) {
        // OpenAPI 3.0 için
        return api.components?.securitySchemes;
    } else if (api.swagger) {
        // Swagger 2.0 için
        return api.securityDefinitions;
    }
    return undefined;
}


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

export async function cliTokens() {
    const cliArgs = await cli() as CLIArguments;
    let authTokens = {
        Bearer: cliArgs.Bearer ?? "",
        apiKey: cliArgs.apiKey ?? "",
        oAuth2: cliArgs.oauth2 ?? ""
    };
    return authTokens;
}

export function getAuthHeaders(securitySchemes: Record<string, SecurityScheme> | undefined, requiredSchemes: Array<Record<string, string[]>>, tokens: Record<string, string>): Record<string, string> {
    let headers: Record<string, string> = {};
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
                    } else {
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
