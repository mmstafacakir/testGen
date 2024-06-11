import SwaggerParser = require("@apidevtools/swagger-parser");
import { APIResponse, CLIArguments } from '../src/interfaces';
import generateDynamicUrl from "../src/generateUrl";
import { handleParameter } from "../src/generateValue";
import {getAuthHeaders, getSecuritySchemes } from "../src/auth";

function getBaseUrl(api: APIResponse): string {
    if (api.servers && api.servers.length > 0) {
        return api.servers[0].url;
    } else if (api.host) {
        let scheme = (api.schemes && api.schemes[0]) || 'http';
        let basePath = api.basePath || '';
        return `${scheme}://${api.host}${basePath}`;
    }
    return '';
}

export async function generateGetAxiosCode(swaggerFilePath: string, args?: {
    Bearer?: string,
    apiKey?: string,
    oAuth2?: string
}
) {
    try {
        const api = await SwaggerParser.parse(swaggerFilePath) as unknown as APIResponse;
        const securitySchemes = await getSecuritySchemes(api);
        let baseUrl = getBaseUrl(api);
        //const cliArgs = await cli() as CLIArguments;

        let fileContent = 'import { sendGetRequest } from "../src/sendRequests";\n\n';

        if (api.paths) {
            for (const [path, pathItem] of Object.entries(api.paths)) {
                const operation = pathItem['get'];
                if (operation) {
                    let authTokens = {
                        Bearer: args?.Bearer || "Need Token",
                        apiKey: args?.apiKey || "Need Key",
                        oAuth2: args?.oAuth2 || "Need Token"
                    };

                    //console.log("authTokens", authTokens);
                    let headers = operation.security ? getAuthHeaders(securitySchemes, operation.security, authTokens) : {};
                    let queryParams: string[] = [];
                    let pathParams: { [key: string]: string } = {};

                    operation.parameters?.forEach(param => {
                        let defaultValue = handleParameter(param);
                        if (param.name === 'api_key') {
                            headers[param.name] = authTokens.apiKey;
                        } else if (param.name === 'oAuth2') {
                            headers[param.name] = authTokens.oAuth2;
                        } else if (param.in === 'query') {
                            queryParams.push(`${param.name}=${encodeURIComponent(defaultValue)}`);
                        } else if (param.in === 'path') {
                            pathParams[param.name] = defaultValue;
                        }
                    });

                    let fullPath = generateDynamicUrl(baseUrl, path, pathParams);
                    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
                    const fullUrl = `${fullPath}${queryString}`;

                    fileContent += `sendGetRequest('GET', '${fullUrl}', ${JSON.stringify(headers)});\n`;
                }
            }

            // fs.writeFileSync(filePath, fileContent, 'utf8');
            // console.log(`Generated test file at ${filePath}`);
            return fileContent;
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error in GET generator: ${error.message}`);
        } else {
            console.error(`An unexpected error occurred`);
        }
    }
}

// async function main() {
//     try {
//         const cliArgs = await cli();
//         await generateGetAxiosCode(cliArgs.file);
//     } catch (error: any) {
//         console.error(`Error in GET generator: ${error.message}`);
//     }
// }

// main();



export async function generateGetAxiosCodeFromSwagger(swaggerFilePath: string, args?: {
    Bearer?: string,
    apiKey?: string,
    oAuth2?: string
}) {
    const api = await SwaggerParser.parse(swaggerFilePath) as unknown as APIResponse;
    const securitySchemes = await getSecuritySchemes(api);
    let baseUrl = getBaseUrl(api);
    let requests: string[] = [];

    for (const [path, pathItem] of Object.entries(api.paths)) {
        const operation = pathItem.get;
        if (operation) {
            let authTokens = {
                Bearer: args?.Bearer || "Need Token",
                apiKey: args?.apiKey || "Need Key",
                oAuth2: args?.oAuth2 || "Need Token"
            };

            let headers = operation.security ? getAuthHeaders(securitySchemes, operation.security, authTokens) : {};
            let queryParams: string[] = [];
            let pathParams: { [key: string]: string } = {};

            operation.parameters?.forEach(param => {
                let defaultValue = handleParameter(param);
                if (param.in === 'header') {
                    headers[param.name] = defaultValue;
                } else if (param.in === 'query') {
                    queryParams.push(`${param.name}=${encodeURIComponent(defaultValue)}`);
                } else if (param.in === 'path') {
                    pathParams[param.name] = defaultValue;
                }
            });

            let fullPath = generateDynamicUrl(baseUrl, path, pathParams);
            const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
            const fullUrl = `${fullPath}${queryString}`;

            requests.push(`sendGetRequest('GET', '${fullUrl}', ${JSON.stringify(headers)});`);
        }
    }

    return requests;
}

