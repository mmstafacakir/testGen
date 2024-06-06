
export interface APIResponse {
    openapi?: string; // For OpenAPI 3.0 
    swagger?: string; // For Swagger 2.0 
    info: any;
    paths: Record<string, PathItem>;
    servers?: Server[];
    components?: Components;
    securityDefinitions?: Record<string, SecurityScheme>; // For Swagger 2.0 
    definitions?: { [key: string]: any };
    schemes?: string[];
    basePath?: string;
    host?: string;
    tags?: any[];
    externalDocs?: any;
}

export interface CLIArguments {
    file: string;
    Bearer?: string;
    apiKey?: string;
    oauth2?: string;
}


export interface Server {
    url: string;
}

export interface PathItem {
    [method: string]: Operation;
}

export interface SecurityScheme {
    type: string;
    description?: string;
    name?: string;
    in?: string;
    scheme?: string;
    bearerFormat?: string;
    flows?: any; // OAuth 2.0 flows for OpenAPI 3.0
    authorizationUrl?: string; // For OAuth2
    tokenUrl?: string; // For OAuth2
    refreshUrl?: string; // For OAuth2
    scopes?: Record<string, string>; // For OAuth2
}

export interface Operation {
    parameters?: Parameter[];
    requestBody?: {
        content: {
            'application/json': {
                schema: any;
            };
        };
    };
    responses?: any;
    security?: Array<Record<string, string[]>>;
}

export interface Parameter {
    in: string;
    name: string;
    schema?: any;
    type?: any;
    default?: any;
    items?: {
        type?: string;
        enum?: any[];
        default?: any;
    };

}
export interface Components {
    schemas: { [key: string]: any };
    securitySchemes?: Record<string, SecurityScheme>;
}
export interface Schema {
    $ref?: string;
    type?: string;
    properties?: { [key: string]: Schema };
    items?: Schema;
    oneOf?: Schema[];
    anyOf?: Schema[];
    allOf?: Schema[];
}