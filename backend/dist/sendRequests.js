"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
function sendGetRequest(method, url, headers) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let config = {
        method: method,
        url: url,
        headers: headers,
    };
    (0, axios_1.default)(config)
        .then(response => {
        console.log(`${config.method.toUpperCase()} Request to ${config.url}:`, 'Status code', response.status);
    })
        .catch(error => {
        console.error(`Error in ${config.method.toUpperCase()} Request to ${config.url}:`, error.message);
    });
}
function sendPostRequest(method, url, headers, data) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let config = {
        method: method,
        url: url,
        headers: headers,
        data: data
    };
    (0, axios_1.default)(config)
        .then(response => {
        console.log(`${config.method.toUpperCase()} Request to ${config.url}:`, 'Status code', response.status);
    })
        .catch(error => {
        console.error(`Error in ${config.method.toUpperCase()} Request to ${config.url}:`, error.message);
    });
}
function sendPutRequest(method, url, headers, data) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let config = {
        method: method,
        url: url,
        headers: headers,
        data: data
    };
    (0, axios_1.default)(config)
        .then(response => {
        console.log(`${config.method.toUpperCase()} Request to ${config.url}:`, 'Status code', response.status);
    })
        .catch(error => {
        console.error(`Error in ${config.method.toUpperCase()} Request to ${config.url}:`, error.message);
    });
}
function sendDeleteRequest(method, url, headers) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let config = {
        method: method,
        url: url,
        headers: headers,
    };
    (0, axios_1.default)(config)
        .then(response => {
        console.log(`${config.method.toUpperCase()} Request to ${config.url}:`, 'Status code', response.status);
    })
        .catch(error => {
        console.error(`Error in ${config.method.toUpperCase()} Request to ${config.url}:`, error.message);
    });
}
module.exports = {
    sendGetRequest,
    sendPostRequest,
    sendPutRequest,
    sendDeleteRequest,
};
