const fs = require('fs-extra');
const path = require('path');

const katexPath = path.dirname(require.resolve('katex'));
const fontPath = path.join(katexPath, 'fonts');
const destPath = path.join(process.cwd(), 'public', 'fonts');

if (fs.existsSync(fontPath)) {
  console.log('Copying KaTeX fonts...');
  fs.ensureDirSync(destPath);
  fs.copySync(fontPath, destPath);
  console.log('KaTeX fonts copied to /public/fonts');
} else {
  console.error('KaTeX fonts not found.');
}