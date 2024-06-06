# Swagger Test Generator

## Kullanılan Teknoloji içerikleri:

1. Nodejs
2. TypeScript
3. Axios
4. Swagger Parser / https://www.npmjs.com/package/swagger-parser
5. Faker / https://fakerjs.dev/

## Başlarken

Projeyi node modüllerler birlikte localinizde indirip bir IDE aracılığıyla çalıştırabilirsiniz.

### Metotlar ve Metotları Çalıştırma

Test oluşturma metotlarımız , generateAllRequests,generateDeleteAxiosCode,generatePostAxiosCode,generatePutAxiosCode,generateGetAxiosCode şeklindedir. 2 parametre'ye sahipler;swaggerFilePath: string ve args?: {Bearer?: string,apiKey?: string,oAuth2?: string} .

Metotumuzu kullanabilmek için önce import işlemini yapıyoruz, sonrasında metodumuz kullanacağımız yere çağırılmaya hazır.
_\*\*Çağırma işlemini yaparken \_await_ sözcüğünü kullanmayı unutmayın.\*\*\_

Örnek kullanım;

```bash
import { generatePostAxiosCode } from "./generatorAxios/postGenerator";
async function main() {
    try {
        const post = await generatePostAxiosCode("D:/workspace/swagger_test_generator/swagger.json", { // kendi swagger file path'ini vermeniz gerekiyor.
            Bearer: "12131",
            apiKey: "cl2323",
            oAuth2: "cliArgs.oauth2 "
        });
        console.log(post);
    } catch (error: any) {
        console.error(`Error in POST generator: ${error.message}`);
    }
}
main();
```

Konsol çıktısı şu şekil;

```bash
import { sendPostRequest } from "../src/sendRequests";

sendPostRequest('POST', 'https://petstore.swagger.io/v2/pet', {"Authorization":"Bearer cliArgs.oauth2 "}, {"id":"1","category":{"id":"1","name":"Bilgeışbaratamgan"},"name":"Kancı","photoUrls":"array_string","tags":[{"id":"1","name":"Alp"}],"status":"available"});
sendPostRequest('POST', 'https://petstore.swagger.io/v2/pet/1', {"Authorization":"Bearer cliArgs.oauth2 "}, {"name":"string","status":"string"});
sendPostRequest('POST', 'https://petstore.swagger.io/v2/pet/1/uploadImage', {"Authorization":"Bearer cliArgs.oauth2 "}, {"additionalMetadata":"string","file":"/lost+found/till.mjs"});
sendPostRequest('POST', 'https://petstore.swagger.io/v2/store/order', {}, {"id":"1","petId":"1","quantity":"1","shipDate":"2024-05-30T06:06:30.040Z","status":"placed","complete":"true"});
sendPostRequest('POST', 'https://petstore.swagger.io/v2/user', {}, {"id":"1","username":"Akbas_Cag8hran18","firstName":"Akbaş","lastName":"Çağıran","email":"Akbas.Cag8hran@yahoo.com","password":"d1s9WrCbe2yIpnS","phone":"+90-283-530-3-776","userStatus":"1"});
sendPostRequest('POST', 'https://petstore.swagger.io/v2/user/createWithArray', {}, [{"id":"1","username":"Bagasatulu.Tanr8hkulu98","firstName":"Bağaşatulu","lastName":"Tanrıkulu","email":"Bagasatulu.Tanr8hkulu@gmail.com","password":"XJmrslWBf8oXZLJ","phone":"+90-354-725-09-27","userStatus":"1"}]);
sendPostRequest('POST', 'https://petstore.swagger.io/v2/user/createWithList', {}, [{"id":"1","username":"Edil_Ayayd8hn","firstName":"Edil","lastName":"Ayaydın","email":"Edil_Ayayd8hn22@hotmail.com","password":"wyjsMZGgmJDSBZf","phone":"+90-039-632-8-012","userStatus":"1"}]);
```

Daha ayrıntılı görebilmeniz için deneme.ts dosyasını derleyip çalıştırınız. (swaggerFilePath parametresini kendinize göre güncelleyiniz.)

### Test Kodlarını Yeni Bir Dosyaya Yazdırma

allWrite,postWrite,deleteWrite,getWrite ve putWrite şeklinde 5 metotumuz var. Bunlar da aynı şekil 2 parametreye sahipler;

swaggerFilePath: string ve args?: {Bearer?: string,apiKey?: string,oAuth2?: string} .

metotu import edip çağırıp çalıştırdığımızda \_tests\_ adlı bir klasör oluşturuyor ve o klasörün altında {methodAdi}Requests.spec.ts dosyası oluşturuyor.Oluşturulan dosyayı derleyip çalıştırırsanız testlerin sonuçlarını konsolda görebilirsiniz.

Örnek kullanımını deneme1.ts dosyasında görebilirsiniz. SwaggerFilePath parametresine hem json hem de yaml tipinde swagger dökümanı atayabilirsiniz. İki uzantı için de uyumludur.
