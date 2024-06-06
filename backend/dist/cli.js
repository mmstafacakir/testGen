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
exports.cli = void 0;
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const SwaggerParser = require("@apidevtools/swagger-parser");
function fetchSecuritySchemes(swaggerFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const api = yield SwaggerParser.parse(swaggerFilePath);
        const securitySchemes = ((_a = api.components) === null || _a === void 0 ? void 0 : _a.securitySchemes) || api.securityDefinitions;
        let schemes = {};
        if (securitySchemes) {
            Object.entries(securitySchemes).forEach(([key, value]) => {
                const schemeDetails = value;
                schemes[key] = {
                    type: schemeDetails.type,
                    in: schemeDetails.in,
                    name: schemeDetails.name
                };
            });
        }
        return schemes;
    });
}
function cli() {
    return __awaiter(this, void 0, void 0, function* () {
        const argvBase = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
            .option('file', {
            describe: 'Path to the Swagger JSON file',
            type: 'string',
            demandOption: true, //false yap en sonunda.
        })
            .help()
            .alias('help', 'h');
        const { file } = yield argvBase.argv;
        const schemes = yield fetchSecuritySchemes(file);
        let argv = argvBase;
        if (schemes) {
            Object.entries(schemes).forEach(([key, scheme]) => {
                if (scheme.type === 'apiKey' && scheme.name) {
                    argv = argv.option('apiKey', {
                        describe: `API key token for ${scheme.name} authentication`,
                        type: 'string',
                        demandOption: true,
                    });
                }
                else if (scheme.type === 'oauth2' && scheme.name) {
                    argv = argv.option('oauth2', {
                        describe: `OAuth2 token for ${scheme.name} authentication`,
                        type: 'string',
                        demandOption: true,
                    });
                }
                else if (scheme.type === 'http' && scheme.in === 'header' && scheme.scheme === 'bearer' && scheme.name) {
                    argv = argv.option('Bearer', {
                        describe: `Bearer token for ${scheme.name} authentication`,
                        type: 'string',
                        demandOption: true,
                    });
                }
            });
        }
        return argv.check(argv => {
            const errors = [];
            Object.entries(schemes).forEach(([key, scheme]) => {
                if ((scheme.type === 'apiKey' && !argv.apiKey) ||
                    (scheme.type === 'oauth2' && !argv.oauth2) ||
                    (scheme.type === 'http' && !argv.Bearer)) {
                    const missingToken = scheme.type === 'apiKey' ? 'apiKey' :
                        scheme.type === 'oauth2' ? 'oauth2' : 'Bearer';
                    errors.push(`Please provide the ${missingToken} authentication token`);
                }
            });
            if (errors.length > 0) {
                throw new Error(errors.join(" "));
            }
            return true;
        }).parseSync();
    });
}
exports.cli = cli;
// import yargs from 'yargs';
// import { hideBin } from 'yargs/helpers';
// import { SecurityScheme, CLIArguments } from './interfaces';
// import SwaggerParser = require("@apidevtools/swagger-parser");
// async function fetchSecuritySchemes(swaggerFilePath: string): Promise<Record<string, SecurityScheme>> {
//     const api: any = await SwaggerParser.parse(swaggerFilePath);
//     const securitySchemes = api.components?.securitySchemes || api.securityDefinitions;
//     let schemes: Record<string, SecurityScheme> = {};
//     if (securitySchemes) {
//         Object.entries(securitySchemes).forEach(([key, value]) => {
//             const schemeDetails = value as SecurityScheme;
//             schemes[key] = {
//                 type: schemeDetails.type,
//                 in: schemeDetails.in,
//                 name: schemeDetails.name
//             };
//         });
//     }
//     return schemes;
// }
// export async function cli() {
//     const argvBase = yargs(hideBin(process.argv))
//         .option('file', {
//             describe: 'Path to the Swagger JSON file',
//             type: 'string',
//             demandOption: true,
//         })
//         .option('endpoint', {
//             describe: 'API endpoint path',
//             type: 'string',
//             demandOption: false,
//         })
//         .help()
//         .alias('help', 'h');
//     const argv = await argvBase.argv as CLIArguments;
//     const api: any = await SwaggerParser.parse(argv.file);
//     const schemes = await fetchSecuritySchemes(argv.file);
//     const methods = ['post', 'put'];
//     let requestBodyProperties = new Set<string>();
//     let requiredProperties = new Set<string>();
//     methods.forEach(method => {
//         const operation = api.paths[argv.endpoint]?.[method];
//         if (operation && operation.requestBody) {
//             const requestBodySchema = operation.requestBody.content['application/json']?.schema;
//             if (requestBodySchema && requestBodySchema.properties) {
//                 Object.keys(requestBodySchema.properties).forEach(key => {
//                     requestBodyProperties.add(key);
//                     if (requestBodySchema.required && requestBodySchema.required.includes(key)) {
//                         requiredProperties.add(key);
//                     }
//                 });
//             }
//         }
//     });
//     // Dynamically add options for requestBody properties
//     requestBodyProperties.forEach(key => {
//         argvBase.option(key, {
//             describe: `Value for ${key}`,
//             type: 'string',
//             demandOption: requiredProperties.has(key)
//         });
//     });
//     // Add options for authentication methods
//     Object.entries(schemes).forEach(([key, scheme]) => {
//         if (scheme.type === 'apiKey' && scheme.name) {
//             argvBase.option('apiKey', {
//                 describe: `API key token for ${scheme.name} authentication`,
//                 type: 'string',
//                 demandOption: true,
//             });
//         } else if (scheme.type === 'oauth2' && scheme.name) {
//             argvBase.option('oauth2', {
//                 describe: `OAuth2 token for ${scheme.name} authentication`,
//                 type: 'string',
//                 demandOption: true,
//             });
//         } else if (scheme.type === 'http' && scheme.in === 'header' && scheme.scheme === 'bearer' && scheme.name) {
//             argvBase.option('Bearer', {
//                 describe: `Bearer token for ${scheme.name} authentication`,
//                 type: 'string',
//                 demandOption: true,
//             });
//         }
//     });
//     const parsedArgv = await argvBase.argv as CLIArguments;
//     return parsedArgv;
// }
