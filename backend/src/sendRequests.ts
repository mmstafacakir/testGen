import axios from 'axios';

export function sendGetRequest(method: string, url: string, headers: Record<string, string>) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let config = {
        method: method,
        url: url,
        headers: headers,
    };

    axios(config)
        .then(response => {
            console.log(`${config.method.toUpperCase()} Request to ${config.url}:`, 'Status code', JSON.stringify(response.status));
        })
        .catch(error => {
            console.error(`Error in ${config.method.toUpperCase()} Request to ${config.url}:`, error.message);
        });

}

export function sendPostRequest(method: string, url: string, headers: Record<string, string>, data: any) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let config = {
        method: method,
        url: url,
        headers: headers,
        data: data
    };

    axios(config)
        .then(response => {
            console.log(`${config.method.toUpperCase()} Request to ${config.url}:`, 'Status code', JSON.stringify(response.status));
        })
        .catch(error => {
            console.error(`Error in ${config.method.toUpperCase()} Request to ${config.url}:`, error.message);
        });

}

export function sendPutRequest(method: string, url: string, headers: Record<string, string>, data: any) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let config = {
        method: method,
        url: url,
        headers: headers,
        data: data
    };

    axios(config)
        .then(response => {
            console.log(`${config.method.toUpperCase()} Request to ${config.url}:`, 'Status code', JSON.stringify(response.status));
        })
        .catch(error => {
            console.error(`Error in ${config.method.toUpperCase()} Request to ${config.url}:`, error.message);
        });

}


export function sendDeleteRequest(method: string, url: string, headers: Record<string, string>) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let config = {
        method: method,
        url: url,
        headers: headers,
    };

    axios(config)
        .then(response => {
            console.log(`${config.method.toUpperCase()} Request to ${config.url}:`, 'Status code', JSON.stringify(response.status));
        })
        .catch(error => {
            console.error(`Error in ${config.method.toUpperCase()} Request to ${config.url}:`, error.message);
        });

}

export function sendAllRequest(method: string, url: string, headers: Record<string, string>, data: any) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let config = {
        method: method,
        url: url,
        headers: headers,
        data: data
    };

    axios(config)
        .then(response => {
            console.log(`${config.method.toUpperCase()} Request to ${config.url}:`, 'Status code', JSON.stringify(response.status));
        })
        .catch(error => {
            console.error(`Error in ${config.method.toUpperCase()} Request to ${config.url}:`, error.message);
        });

}
