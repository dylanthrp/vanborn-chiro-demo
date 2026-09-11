const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
test('hero and doctor card use the updated Donald portrait',()=>{
 const root=path.resolve(__dirname,'..');
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.equal((html.match(/src="assets\/donald-portrait.jpg"/g)||[]).length,2);
 assert.ok(!html.includes('src="assets/donald1.jpg"'));
 assert.ok(fs.statSync(path.join(root,'assets/donald-portrait.jpg')).size>0);
});
