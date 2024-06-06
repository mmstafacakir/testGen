import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { SecurityScheme } from './interfaces';
import SwaggerParser = require("@apidevtools/swagger-parser");


async function fetchSecuritySchemes(swaggerFilePath: string): Promise<Record<string, SecurityScheme>> {
    const api: any = await SwaggerParser.parse(swaggerFilePath);
    const securitySchemes = api.components?.securitySchemes || api.securityDefinitions;
    let schemes: Record<string, SecurityScheme> = {};
    if (securitySchemes) {
        Object.entries(securitySchemes).forEach(([key, value]) => {
            const schemeDetails = value as SecurityScheme;
            schemes[key] = {
                type: schemeDetails.type,
                in: schemeDetails.in,
                name: schemeDetails.name
            };
        });
    }
    return schemes;
}

export async function cli() {
    const argvBase = yargs(hideBin(process.argv))
        .option('file', {
            describe: 'Path to the Swagger JSON file',
            type: 'string',
            demandOption: true, //false yap en sonunda.
        })
        .help()
        .alias('help', 'h');

    const { file } = await argvBase.argv;
    const schemes = await fetchSecuritySchemes(file);

    let argv = argvBase;
    if (schemes) {
        Object.entries(schemes).forEach(([key, scheme]) => {
            if (scheme.type === 'apiKey' && scheme.name) {
                argv = argv.option('apiKey', {
                    describe: `API key token for ${scheme.name} authentication`,
                    type: 'string',
                    demandOption: true,
                });
            } else if (scheme.type === 'oauth2' && scheme.name) {
                argv = argv.option('oauth2', {
                    describe: `OAuth2 token for ${scheme.name} authentication`,
                    type: 'string',
                    demandOption: true,
                });
            } else if (scheme.type === 'http' && scheme.in === 'header' && scheme.scheme === 'bearer' && scheme.name) {
                argv = argv.option('Bearer', {
                    describe: `Bearer token for ${scheme.name} authentication`,
                    type: 'string',
                    demandOption: true,
                });
            }
        });
    }

    return argv.check(argv => {
        const errors: string[] = [];
        Object.entries(schemes).forEach(([key, scheme]) => {
            if (
                (scheme.type === 'apiKey' && !argv.apiKey) ||
                (scheme.type === 'oauth2' && !argv.oauth2) ||
                (scheme.type === 'http' && !argv.Bearer)
            ) {
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
}

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
