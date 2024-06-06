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
exports.allWrite = void 0;
const allGenerator_1 = require("../generatorAxios/allGenerator");
const fs = require('fs');
const path = require('path');
function allWrite(swaggerFile, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentPath = process.cwd();
        const testsDirPath = path.join(currentPath, '_tests_');
        fs.mkdirSync(testsDirPath, { recursive: true });
        const filePath = path.join(testsDirPath, 'allRequests.spec.ts');
        try {
            //const cliArgs = await cli();
            let file = yield (0, allGenerator_1.generateAllRequests)(swaggerFile, args);
            fs.writeFileSync(filePath, file, 'utf8');
            console.log(`Generated test file at ${filePath}`);
        }
        catch (error) {
            console.error(`Error in All generator: ${error.message}`);
        }
    });
}
exports.allWrite = allWrite;
