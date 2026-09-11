const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
test('all staff cards use the supplied named portraits',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.ok(html.includes('src="assets/renee1-hd.jpg"'),'Missing Renee portrait');
 assert.ok(fs.statSync(path.join(root,'assets','renee1-hd.jpg')).size>0);
 for(const [name,file] of [['Jane Carroll','jane-carroll-hd.jpg'],['Sam Jernigan','IMG_2608-200-hd.jpg'],['Loretta Klapko','Loretta-Klapko.jpeg']]){
  assert.ok(html.includes(`src="assets/${file}"`),`Missing portrait for ${name}`);
  assert.ok(fs.statSync(path.join(root,'assets',file)).size>0);
 }
});
