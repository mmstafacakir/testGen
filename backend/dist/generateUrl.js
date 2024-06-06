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
exports.generateDynamicUrl = exports.getDefaultForType = exports.generatePathParametersWithDefaults = void 0;
const SwaggerParser = require("@apidevtools/swagger-parser");
function generatePathParametersWithDefaults(swaggerFilePath, endpoint, method) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const api = yield SwaggerParser.parse(swaggerFilePath);
        const operation = (_b = (_a = api.paths) === null || _a === void 0 ? void 0 : _a[endpoint]) === null || _b === void 0 ? void 0 : _b[method];
        if (!operation) {
            console.log('Endpoint or method not found');
            return {};
        }
        const parameters = {};
        (_c = operation.parameters) === null || _c === void 0 ? void 0 : _c.forEach((param) => {
            var _a;
            if (param.in === 'path') {
                parameters[param.name] = getDefaultForType((_a = param.schema) === null || _a === void 0 ? void 0 : _a.type);
            }
        });
        return parameters;
    });
}
exports.generatePathParametersWithDefaults = generatePathParametersWithDefaults;
function getDefaultForType(type) {
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
exports.getDefaultForType = getDefaultForType;
function generateDynamicUrl(baseUrl, path, parameters) {
    let fullPath = `${baseUrl}${path}`;
    Object.keys(parameters).forEach(param => {
        fullPath = fullPath.replace(`{${param}}`, encodeURIComponent(parameters[param]));
    });
    return fullPath;
}
exports.generateDynamicUrl = generateDynamicUrl;
exports.default = generateDynamicUrl;
