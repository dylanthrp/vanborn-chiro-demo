const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
test('Donald and Renee portraits are used correctly',()=>{
 const root=path.resolve(__dirname,'..');
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 // Renee is now the homepage hero; Donald stays on his doctor card.
 assert.equal((html.match(/src="assets\/renee-final.jpg"/g)||[]).length,2,'Renee should appear in hero + doctor card');
 assert.equal((html.match(/src="assets\/donald-portrait.jpg"/g)||[]).length,1,'Donald should appear only on his doctor card');
 assert.ok(!html.includes('src="assets/donald1.jpg"'),'old filename must be gone');
 assert.ok(!html.includes('src="assets/renee1.jpg"'),'old renee filename must be gone');
 assert.ok(!html.includes('src="assets/renee1-hd.jpg"'),'old high-res renee filename must be gone');
 assert.ok(!html.includes('src="assets/jane-carroll"'),'old jane-carroll filename must be gone');
 assert.ok(!html.includes('src="assets/IMG_2608-200"'),'old IMG_2608-200 filename must be gone');
 assert.ok(!html.includes('src="assets/Loretta-Klapko.jpeg"'),'old Loretta-Klapko filename must be gone');
 assert.ok(!html.includes('src="assets/v-mark-512.png"'),'old logo filename must be gone');
 assert.ok(fs.statSync(path.join(root,'assets','donald-portrait.jpg')).size>0);
 assert.ok(fs.statSync(path.join(root,'assets','renee-final.jpg')).size>0);
});
