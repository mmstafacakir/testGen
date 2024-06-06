import { postWrite } from "./writeMethods/postWrite";

async function main() {

    await postWrite("D:/workspace/swagger_test_generator/swagger.json", {
        Bearer: "12131",
        apiKey: "cl2323",
        oAuth2: "cliArgs.oauth2 "
    });
}
main();