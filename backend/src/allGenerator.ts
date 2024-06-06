import { generatePutAxiosCodeFromSwagger } from "./putGenerator";
import { generateDeleteAxiosCodeFromSwagger } from "./deleteGenerator";
import { generatePostAxiosCodeFromSwagger } from "./postGenerator";
import { generateGetAxiosCodeFromSwagger } from "./getGenerator";

export async function generateAllRequests(swaggerFilePath: string, args?: {
    Bearer?: string,
    apiKey?: string,
    oAuth2?: string
}) {
    try {
        //const authorizationToken = cli().Authorization;

        const requests = [
            ...(await generateGetAxiosCodeFromSwagger(swaggerFilePath, args)),
            ...(await generatePostAxiosCodeFromSwagger(swaggerFilePath, args)),
            ...(await generatePutAxiosCodeFromSwagger(swaggerFilePath, args)),
            ...(await generateDeleteAxiosCodeFromSwagger(swaggerFilePath, args))
        ];

        const fileContent = `import { sendGetRequest, sendPostRequest, sendPutRequest, sendDeleteRequest } from "../src/sendRequests";\n\n${requests.join('\n')}`;
        return fileContent;

    } catch (error) {
        if (error instanceof Error) {
            console.error(`Failed to generate all requests: ${error.message}`);
        } else {
            console.error(`An unexpected error occurred`);
        }
    }
}

// async function main() {
//     try {
//         const cliArgs = await cli();
//         await generateAllRequests(cliArgs.file);
//     } catch (error: any) {
//         console.error(`Error in GET generator: ${error.message}`);
//     }
// }

// main();