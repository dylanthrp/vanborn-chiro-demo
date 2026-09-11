const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
test('all staff cards use the supplied named portraits',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.ok(html.includes('src="assets/renee-final.jpg"'),'Missing Renee portrait');
 assert.ok(fs.statSync(path.join(root,'assets','renee-final.jpg')).size>0);
 assert.ok(fs.statSync(path.join(root,'assets','donald-portrait.jpg')).size>0,'Donald portrait asset should remain on his doctor card');
 for(const [name,file] of [['Jane Carroll','jane-final.jpg'],['Sam Jernigan','sam-final.jpg'],['Loretta Klapko','loretta-final.jpg']]){
  assert.ok(html.includes(`src="assets/${file}"`),`Missing portrait for ${name}`);
  assert.ok(fs.statSync(path.join(root,'assets',file)).size>0);
 }
});
