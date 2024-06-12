import { generateAllRequests } from "./backend/src/allGenerator";



async function main() {

    const code = await generateAllRequests("D:/workspace/swagger_test_generator/swagger.json", {
        Bearer: "12131",
        apiKey: "cl2323",
        oAuth2: "cliArgs.oauth2 "
    });
    console.log(code);

}
main();