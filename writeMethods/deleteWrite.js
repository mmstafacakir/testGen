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
exports.deleteWrite = void 0;
const deleteGenerator_1 = require("../generatorAxios/deleteGenerator");
const fs = require('fs');
const path = require('path');
function deleteWrite(swaggerFile, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentPath = process.cwd();
        const testsDirPath = path.join(currentPath, '_tests_');
        fs.mkdirSync(testsDirPath, { recursive: true });
        const filePath = path.join(testsDirPath, 'deleteRequests.spec.ts');
        try {
            //const cliArgs = await cli();
            let file = yield (0, deleteGenerator_1.generateDeleteAxiosCode)(swaggerFile, args);
            fs.writeFileSync(filePath, file, 'utf8');
            console.log(`Generated test file at ${filePath}`);
        }
        catch (error) {
            console.error(`Error in DELETE generator: ${error.message}`);
        }
    });
}
exports.deleteWrite = deleteWrite;
