import SwaggerParser = require("@apidevtools/swagger-parser")
import { APIResponse, Parameter } from './interfaces';

export async function generatePathParametersWithDefaults(swaggerFilePath: string, endpoint: string, method: string): Promise<{ [param: string]: string }> {
    const api = await SwaggerParser.parse(swaggerFilePath) as APIResponse;
    const operation = api.paths?.[endpoint]?.[method];

    if (!operation) {
        console.log('Endpoint or method not found');
        return {};
    }

    const parameters: { [param: string]: string } = {};
    operation.parameters?.forEach((param: Parameter) => {
        if (param.in === 'path') {
            parameters[param.name] = getDefaultForType(param.schema?.type);
        }
    });

    return parameters;
}

export function getDefaultForType(type: string | undefined): string {
    switch (type) {
        case 'array':
            return 'array_string';
        case 'integer':
        case 'number':
            return "1";
        case 'string':
            return 'string';
        case 'boolean':
            return "true";
        default:
            return 'default';
    }
}

export function generateDynamicUrl(baseUrl: string, path: string, parameters: { [key: string]: string }): string {
    let fullPath = `${baseUrl}${path}`;
    Object.keys(parameters).forEach(param => {
        fullPath = fullPath.replace(`{${param}}`, encodeURIComponent(parameters[param]));
    });
    return fullPath;
}


export default generateDynamicUrl;