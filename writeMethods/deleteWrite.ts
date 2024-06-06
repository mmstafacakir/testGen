import { generateDeleteAxiosCode } from "../generatorAxios/deleteGenerator";
const fs = require('fs');
const path = require('path');


export async function deleteWrite(swaggerFile: string, args?: {
    Bearer?: string,
    apiKey?: string,
    oAuth2?: string
}) {
    const currentPath = process.cwd();
    const testsDirPath = path.join(currentPath, '_tests_');
    fs.mkdirSync(testsDirPath, { recursive: true });

    const filePath = path.join(testsDirPath, 'deleteRequests.spec.ts');
    try {
        //const cliArgs = await cli();
        let file = await generateDeleteAxiosCode(swaggerFile, args);
        fs.writeFileSync(filePath, file, 'utf8');
        console.log(`Generated test file at ${filePath}`);
    } catch (error: any) {
        console.error(`Error in DELETE generator: ${error.message}`);
    }

}
