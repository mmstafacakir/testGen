# Swagger Test Generator

## Kullanılan Teknoloji içerikleri:

1. Nodejs
2. TypeScript
3. Axios
4. Swagger Parser
5. Faker
6. Vue.js
7. Express
8. Multer
9. CORS
10. Monaco Editör
11. JSZip

## Başlarken

Backend dizinine gidip `npx ts-node index.js` komutu ile backend servisini ayağa kaldırın, frontend dizinine gidip `npm run serve`komutu ile frontend'i ayağa kaldırın.

### Projenin Görünümü

![alt text](image.png)

### Proje Çalışma Mantığı

Backend ve frontend'i ayağa kaldırdıktan sonra istediğiniz swagger dökümanını yükleyip, istediğiniz metot için ya da hepsi için test kodu oluşturabilirsiniz. Oluşturduğunuz test kodlarını çalıştırıp sonuçlarını altta bulunan texbox'ta görebilirsiniz.

Download Code butonu, IDE görünümlü olan textbox'daki kodları ' _.ts_ ' dosyası olarak indirmenizi sağlıyor. Download Boilerplate butonu ise test kodlarının yalın bir şekilde çalışabileceği gerekli kodları zip formatında indiriyor. boilerplate.zip dosyasını indirdikten sonra içerisindeki dosyaları bir klasörün içersine ayıklayın ve herhangi bir IDE aracılığıyla projeyi açın.

Projeyi açtıktan sonra `npm i` komutuyla package.json dosyasında tanımlanmış gerekli bağımlılıkları indirin ve ardından `npm start` komutu ile de test kodlarını çalıştırabilirsiniz. Test sonuçlarını IDE terminalinden görebilirsiniz. Ay

Ayrıca test üretme metotlarını tek başına da kullanabilirsiniz. Nasıl kullanılabileceğini görebilmeniz için deneme.ts dosyasını derleyip çalıştırınız. (swaggerFilePath parametresini kendinize göre güncelleyiniz.)

**Çağırma işlemini yaparken \_await\_ sözcüğünü kullanmayı unutmayın.**
