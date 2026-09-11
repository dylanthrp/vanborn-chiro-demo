const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
test('all staff cards use the supplied named portraits',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 for(const [name,file] of [['Jane Carroll','jane-carroll.png'],['Sam Jernigan','IMG_2608-200.jpg'],['Loretta Klapko','Loretta-Klapko.jpeg']]){
  assert.ok(html.includes(`src="assets/${file}"`),`Missing portrait for ${name}`);
  assert.ok(fs.statSync(path.join(root,'assets',file)).size>0);
 }
});
