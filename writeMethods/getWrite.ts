import { generateGetAxiosCode } from "../generatorAxios/getGenerator";
const fs = require('fs');
const path = require('path');


export async function getWrite(swaggerFile: string, args?: {
    Bearer?: string,
    apiKey?: string,
    oAuth2?: string
}) {
    const currentPath = process.cwd();
    const testsDirPath = path.join(currentPath, '_tests_');
    fs.mkdirSync(testsDirPath, { recursive: true });

    const filePath = path.join(testsDirPath, 'getRequests.spec.ts');
    try {
        //const cliArgs = await cli();
        let file = await generateGetAxiosCode(swaggerFile, args);
        fs.writeFileSync(filePath, file, 'utf8');
        console.log(`Generated test file at ${filePath}`);
    } catch (error: any) {
        console.error(`Error in GET generator: ${error.message}`);
    }

}
