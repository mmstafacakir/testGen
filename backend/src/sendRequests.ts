import axios from 'axios';

export async function sendGetRequest(method: string, url: string, headers: Record<string, string>) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let config = {
        method: method,
        url: url,
        headers: headers,
    };

    try {
        const response = await axios(config);
        console.log(`${config.method.toUpperCase()} Request to ${config.url}: Status code ${response.status}`);
        return `${config.method.toUpperCase()} Request to ${config.url}: Status code ${response.status}`;
    } catch (error:any) {
        console.log(`Error in ${config.method.toUpperCase()} Request to ${config.url}:`, error.message);
        return `Error in ${config.method.toUpperCase()} Request to ${config.url}: ${error.message}`;
    }
}

export async function sendPostRequest(method: string, url: string, headers: Record<string, string>, data: any) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let config = {
        method: method,
        url: url,
        headers: headers,
        data: data
    };

    try {
        const response = await axios(config);
        console.log(`${config.method.toUpperCase()} Request to ${config.url}: Status code ${response.status}`);
        return `${config.method.toUpperCase()} Request to ${config.url}: Status code ${response.status}`;
    } catch (error:any) {
        console.log(`Error in ${config.method.toUpperCase()} Request to ${config.url}:`, error.message);
        return `Error in ${config.method.toUpperCase()} Request to ${config.url}: ${error.message}`;
    }
}

export async function sendPutRequest(method: string, url: string, headers: Record<string, string>, data: any) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let config = {
        method: method,
        url: url,
        headers: headers,
        data: data
    };

    try {
        const response = await axios(config);
        console.log(`${config.method.toUpperCase()} Request to ${config.url}: Status code ${response.status}`);
        return `${config.method.toUpperCase()} Request to ${config.url}: Status code ${response.status}`;
    } catch (error:any) {
        console.log(`Error in ${config.method.toUpperCase()} Request to ${config.url}:`, error.message);
        return `Error in ${config.method.toUpperCase()} Request to ${config.url}: ${error.message}`;
    }
}

export async function sendDeleteRequest(method: string, url: string, headers: Record<string, string>) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let config = {
        method: method,
        url: url,
        headers: headers,
    };

    try {
        const response = await axios(config);
        console.log(`${config.method.toUpperCase()} Request to ${config.url}: Status code ${response.status}`);
        return `${config.method.toUpperCase()} Request to ${config.url}: Status code ${response.status}`;
    } catch (error:any) {
        console.log(`Error in ${config.method.toUpperCase()} Request to ${config.url}:`, error.message);
        return `Error in ${config.method.toUpperCase()} Request to ${config.url}: ${error.message}`;
    }
}

export async function sendAllRequest(method: string, url: string, headers: Record<string, string>, data: any) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let config = {
        method: method,
        url: url,
        headers: headers,
        data: data
    };

    try {
        const response = await axios(config);
        console.log(`${config.method.toUpperCase()} Request to ${config.url}: Status code ${response.status}`);
        return `${config.method.toUpperCase()} Request to ${config.url}: Status code ${response.status}`;
    } catch (error:any) {
        console.log(`Error in ${config.method.toUpperCase()} Request to ${config.url}:`, error.message);
        return `Error in ${config.method.toUpperCase()} Request to ${config.url}: ${error.message}`;
    }
}
