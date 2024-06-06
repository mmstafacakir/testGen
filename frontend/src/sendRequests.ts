import axios, { AxiosRequestConfig } from 'axios';

export function sendGetRequest(method: string, url: string, headers: Record<string, string>) {
    let config: AxiosRequestConfig = {
        method: method,
        url: url,
        headers: headers,
    };

    axios(config)
        .then(response => {
            console.log(`${config.method!.toUpperCase()} Request to ${config.url}:`, 'Status code', response.status);
        })
        .catch(error => {
            console.error(`Error in ${config.method!.toUpperCase()} Request to ${config.url}:`, error.message);
        });
}

export function sendPostRequest(method: string, url: string, headers: Record<string, string>, data: any) {
    let config: AxiosRequestConfig = {
        method: method,
        url: url,
        headers: headers,
        data: data
    };

    axios(config)
        .then(response => {
            console.log(`${config.method!.toUpperCase()} Request to ${config.url}:`, 'Status code', response.status);
        })
        .catch(error => {
            console.error(`Error in ${config.method!.toUpperCase()} Request to ${config.url}:`, error.message);
        });
}

export function sendPutRequest(method: string, url: string, headers: Record<string, string>, data: any) {
    let config: AxiosRequestConfig = {
        method: method,
        url: url,
        headers: headers,
        data: data
    };

    axios(config)
        .then(response => {
            console.log(`${config.method!.toUpperCase()} Request to ${config.url}:`, 'Status code', response.status);
        })
        .catch(error => {
            console.error(`Error in ${config.method!.toUpperCase()} Request to ${config.url}:`, error.message);
        });
}

export function sendDeleteRequest(method: string, url: string, headers: Record<string, string>) {
    let config: AxiosRequestConfig = {
        method: method,
        url: url,
        headers: headers,
    };

    axios(config)
        .then(response => {
            console.log(`${config.method!.toUpperCase()} Request to ${config.url}:`, 'Status code', response.status);
        })
        .catch(error => {
            console.error(`Error in ${config.method!.toUpperCase()} Request to ${config.url}:`, error.message);
        });
}
