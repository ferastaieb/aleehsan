const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'page.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

const output = [];
for (let i = 249; i < 270 && i < lines.length; i++) {
    output.push(`${i + 1}: ${lines[i]}`);
}
output.push('');
output.push('Line ending: ' + (content.includes('\r\n') ? 'CRLF' : 'LF'));

fs.writeFileSync(path.join(__dirname, 'debug-output.txt'), output.join('\n'), 'utf8');
console.log('Written to scripts/debug-output.txt');
