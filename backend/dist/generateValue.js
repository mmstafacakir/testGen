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
exports.getRandomValueFromEnum = exports.generateRequestBodyExample = exports.handleParameter = void 0;
const SwaggerParser = require("@apidevtools/swagger-parser");
const generateUrl_1 = require("./generateUrl");
const faker_1 = require("@faker-js/faker");
function handleParameter(param) {
    //console.log("Handling parameter:", param);
    var _a, _b, _c;
    if (param.type === 'array' && param.items && param.items.enum) {
        // console.log("Enum values found in array items, selecting randomly from:", param.items.enum);
        return getRandomValueFromEnum(param.items.enum);
    }
    else if ((_a = param.schema) === null || _a === void 0 ? void 0 : _a.enum) {
        //console.log("Enum values found in schema, selecting randomly from:", param.schema.enum);
        return getRandomValueFromEnum(param.schema.enum);
    }
    else if ((_b = param.items) === null || _b === void 0 ? void 0 : _b.default) {
        //console.log("Using default value from items:", param.items.default);
        return param.items.default;
    }
    else if ((_c = param.schema) === null || _c === void 0 ? void 0 : _c.default) {
        //console.log("Using schema default value:", param.schema.default);
        return param.schema.default;
    }
    //console.log("No suitable enum or default value, using type default for:", param.type);
    return (0, generateUrl_1.getDefaultForType)(param.type);
}
exports.handleParameter = handleParameter;
function generateRequestBodyExample(swaggerFilePath, endpoint, method) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const api = yield SwaggerParser.parse(swaggerFilePath);
        // let formData = new FormData();
        // formData.append("Swagger File Path", swaggerFilePath);
        const operation = (_b = (_a = api.paths) === null || _a === void 0 ? void 0 : _a[endpoint]) === null || _b === void 0 ? void 0 : _b[method];
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
            requestBodySchema = (_c = content['application/json']) === null || _c === void 0 ? void 0 : _c.schema;
            //console.log("requestBody", requestBodySchema);
        }
        else {
            const bodyParam = (_d = operation.parameters) === null || _d === void 0 ? void 0 : _d.find(param => param.in === 'body');
            if (bodyParam && bodyParam.schema) {
                requestBodySchema = bodyParam.schema;
            }
            else {
                const formDataParams = (_e = operation.parameters) === null || _e === void 0 ? void 0 : _e.filter(param => param.in === 'formData');
                if (formDataParams && formDataParams.length > 0) {
                    const formDataValues = {};
                    formDataParams.forEach(param => {
                        if (param.type === 'file' && param.name === 'file') {
                            formDataValues[param.name] = faker_1.faker.system.filePath();
                        }
                        else {
                            formDataValues[param.name] = handleParameter(param);
                        }
                    });
                    return formDataValues;
                }
            }
            //console.log("requestBody1", bodyParam);
        }
        if (requestBodySchema) {
            const example = generateExampleFromSchema(requestBodySchema, ((_f = api.components) === null || _f === void 0 ? void 0 : _f.schemas) || api.definitions);
            // console.log(JSON.stringify(example, null, 2));
            return example;
        }
        else {
            return null;
        }
    });
}
exports.generateRequestBodyExample = generateRequestBodyExample;
function getRandomValueFromEnum(values) {
    if (!values || values.length === 0)
        return null;
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex];
}
exports.getRandomValueFromEnum = getRandomValueFromEnum;
function generateExampleFromSchema(schema, schemas, processedSchemas = new Set()) {
    if (!schema) {
        return null;
    }
    if (schema.$ref) {
        let refPath = schema.$ref.replace(/^#\/components\/schemas\//, '').replace(/^#\/definitions\//, '');
        if (processedSchemas.has(refPath)) {
            return 'recursive'; // Yinelemeyi engellemek için kontrol
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
            const result = {};
            let dateTime = new Date();
            let firstName = faker_1.fakerTR.person.firstName();
            let lastName = faker_1.fakerTR.person.lastName();
            for (const [key, value] of Object.entries(schema.properties || {})) {
                const propertyValue = value;
                if (propertyValue.enum) {
                    result[key] = getRandomValueFromEnum(propertyValue.enum);
                }
                else if (key == "username" || key == "userName" || key == "user") {
                    result[key] = faker_1.faker.internet.userName({ firstName, lastName });
                }
                else if (key == "firstname" || key == "firstName" || key == "name") {
                    result[key] = firstName;
                }
                else if (key == "lastname" || key == "lastName" || key == "surname" || key == "surName") {
                    result[key] = lastName;
                }
                else if (key == "email" || key == "mail" || key == "e_mail") {
                    result[key] = faker_1.faker.internet.email({ firstName, lastName });
                }
                else if (key == "password") {
                    result[key] = faker_1.faker.internet.password();
                }
                else if (key.includes("Date") || key.includes("date") && !key.includes("update") && !key.includes("Update")) {
                    result[key] = dateTime;
                }
                else if (key == "phone" || key == "phoneNumber" || key == "phonenumber") {
                    result[key] = faker_1.fakerTR.phone.number();
                }
                else if (key == "sex" || key == "Sex") {
                    result[key] = faker_1.faker.person.sex();
                }
                else if (key == "address" || key == "Address") {
                    result[key] = faker_1.fakerTR.location.streetAddress();
                }
                else if (key == "country" || key == "Country") {
                    result[key] = faker_1.faker.location.country();
                }
                else {
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
                return (0, generateUrl_1.getDefaultForType)(schema.type);
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
            return (0, generateUrl_1.getDefaultForType)(schema.type);
        default:
            return null;
    }
}
exports.default = generateRequestBodyExample;
