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
const allGenerator_1 = require("./generatorAxios/allGenerator");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const code = yield (0, allGenerator_1.generateAllRequests)("D:/workspace/swagger_test_generator/swagger.json", {
            Bearer: "12131",
            apiKey: "cl2323",
            oAuth2: "cliArgs.oauth2 "
        });
        console.log(code);
    });
}
main();
