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
exports.generateAllRequests = void 0;
const putGenerator_1 = require("./putGenerator");
const deleteGenerator_1 = require("./deleteGenerator");
const postGenerator_1 = require("./postGenerator");
const getGenerator_1 = require("./getGenerator");
function generateAllRequests(swaggerFilePath, args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //const authorizationToken = cli().Authorization;
            const requests = [
                ...(yield (0, getGenerator_1.generateGetAxiosCodeFromSwagger)(swaggerFilePath, args)),
                ...(yield (0, postGenerator_1.generatePostAxiosCodeFromSwagger)(swaggerFilePath, args)),
                ...(yield (0, putGenerator_1.generatePutAxiosCodeFromSwagger)(swaggerFilePath, args)),
                ...(yield (0, deleteGenerator_1.generateDeleteAxiosCodeFromSwagger)(swaggerFilePath, args))
            ];
            const fileContent = `import { sendGetRequest, sendPostRequest, sendPutRequest, sendDeleteRequest } from "../src/sendRequests";\n\n${requests.join('\n')}`;
            return fileContent;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Failed to generate all requests: ${error.message}`);
            }
            else {
                console.error(`An unexpected error occurred`);
            }
        }
    });
}
exports.generateAllRequests = generateAllRequests;
// async function main() {
//     try {
//         const cliArgs = await cli();
//         await generateAllRequests(cliArgs.file);
//     } catch (error: any) {
//         console.error(`Error in GET generator: ${error.message}`);
//     }
// }
// main();
