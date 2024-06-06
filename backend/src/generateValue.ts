import SwaggerParser = require("@apidevtools/swagger-parser")
import { APIResponse, Server, PathItem, Operation, Parameter } from './interfaces';
import { getDefaultForType } from "./generateUrl";
import { faker, fakerTR } from '@faker-js/faker';

export function handleParameter(param: Parameter): string {
    //console.log("Handling parameter:", param);

    if (param.type === 'array' && param.items && param.items.enum) {
        // console.log("Enum values found in array items, selecting randomly from:", param.items.enum);
        return getRandomValueFromEnum(param.items.enum);
    }

    else if (param.schema?.enum) {
        //console.log("Enum values found in schema, selecting randomly from:", param.schema.enum);
        return getRandomValueFromEnum(param.schema.enum);
    }

    else if (param.items?.default) {
        //console.log("Using default value from items:", param.items.default);
        return param.items.default;
    } else if (param.schema?.default) {
        //console.log("Using schema default value:", param.schema.default);
        return param.schema.default;
    }

    //console.log("No suitable enum or default value, using type default for:", param.type);
    return getDefaultForType(param.type);
}

export async function generateRequestBodyExample(swaggerFilePath: string, endpoint: string, method: string) {
    const api = await SwaggerParser.parse(swaggerFilePath) as APIResponse;
    // let formData = new FormData();
    // formData.append("Swagger File Path", swaggerFilePath);

    const operation = api.paths?.[endpoint]?.[method];
    if (!operation) {
        console.log('Endpoint or method not found');
        return;
    }

    if (!['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        return;
    }

    let requestBodySchema = null;
    if (operation.requestBody) {
        const content = operation.requestBody.content;
        requestBodySchema = content['application/json']?.schema;
        //console.log("requestBody", requestBodySchema);
    } else {
        const bodyParam = operation.parameters?.find(param => param.in === 'body');
        if (bodyParam && bodyParam.schema) {
            requestBodySchema = bodyParam.schema;
        } else {
            const formDataParams = operation.parameters?.filter(param => param.in === 'formData');
            if (formDataParams && formDataParams.length > 0) {
                const formDataValues: { [key: string]: any } = {};
                formDataParams.forEach(param => {
                    if (param.type === 'file' && param.name === 'file') {
                        formDataValues[param.name] = faker.system.filePath();
                    } else {
                        formDataValues[param.name] = handleParameter(param);
                    }
                });
                return formDataValues;
            }
        }
        //console.log("requestBody1", bodyParam);
    }

    if (requestBodySchema) {
        const example = generateExampleFromSchema(requestBodySchema, api.components?.schemas || api.definitions);
        // console.log(JSON.stringify(example, null, 2));
        return example;
    } else {

        return null;
    }
}

export function getRandomValueFromEnum(values: any[]): any {
    if (!values || values.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex];
}



function generateExampleFromSchema(schema: any, schemas: any, processedSchemas = new Set<string>()): any {
    if (!schema) {
        return null;
    }

    if (schema.$ref) {
        let refPath = schema.$ref.replace(/^#\/components\/schemas\//, '').replace(/^#\/definitions\//, '');
        if (processedSchemas.has(refPath)) {
            return 'recursive';  // Yinelemeyi engellemek için kontrol
        }
        processedSchemas.add(refPath);
        return generateExampleFromSchema(schemas[refPath], schemas, processedSchemas);
    }

    if (schema.oneOf || schema.anyOf || schema.allOf) {
        const options = schema.oneOf || schema.anyOf || schema.allOf;
        if (options && options.length > 0) {
            return generateExampleFromSchema(options[0], schemas, processedSchemas);
        }
    }
    //console.log("Schema type", schema.properties);
    switch (schema.type) {
        case 'object':
            const result: { [key: string]: any } = {};
            let dateTime = new Date();
            let firstName = fakerTR.person.firstName();
            let lastName = fakerTR.person.lastName();

            for (const [key, value] of Object.entries(schema.properties || {})) {
                const propertyValue = value as { enum?: any[]; type?: string };
                if (propertyValue.enum) {
                    result[key] = getRandomValueFromEnum(propertyValue.enum);
                } else if (key == "username" || key == "userName" || key == "user") {
                    result[key] = faker.internet.userName({ firstName, lastName });
                } else if (key == "firstname" || key == "firstName" || key == "name") {
                    result[key] = firstName;
                } else if (key == "lastname" || key == "lastName" || key == "surname" || key == "surName") {
                    result[key] = lastName;
                } else if (key == "email" || key == "mail" || key == "e_mail") {
                    result[key] = faker.internet.email({ firstName, lastName });
                } else if (key == "password") {
                    result[key] = faker.internet.password();
                } else if (key.includes("Date") || key.includes("date") && !key.includes("update") && !key.includes("Update")) {
                    result[key] = dateTime;
                } else if (key == "phone" || key == "phoneNumber" || key == "phonenumber") {
                    result[key] = fakerTR.phone.number();
                } else if (key == "sex" || key == "Sex") {
                    result[key] = faker.person.sex();
                } else if (key == "address" || key == "Address") {
                    result[key] = fakerTR.location.streetAddress();
                } else if (key == "country" || key == "Country") {
                    result[key] = faker.location.country();
                } else {
                    // Generate example from schema only if it doesn't match previous conditions
                    result[key] = generateExampleFromSchema(propertyValue, schemas, processedSchemas);
                }
            }
            return result;


        case 'array':
            if (schema.items.enum) {
                return [getRandomValueFromEnum(schema.items.enum)];
            }
            else if (schema.items.type == 'string') {
                //console.log("TEST LOG!!!");
                return getDefaultForType(schema.type);
            }
            else if (schema.items.type == 'number') {
                return 1;
            }
            else if (schema.items.type == 'boolean') {
                return true;
            }

            return [generateExampleFromSchema(schema.items, schemas, processedSchemas)];
        case 'string':
        case 'number':
        case 'integer':
        case 'boolean':
            if (schema.enum) {
                // console.log(schema.enum);
                return getRandomValueFromEnum(schema.enum);
            }
            return getDefaultForType(schema.type);
        default:
            return null;
    }
}



export default generateRequestBodyExample;