const fs = require('fs');
const path = require('path');

// Read the current tsconfig.json
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

// Add skipLibCheck option
tsconfig.compilerOptions.skipLibCheck = true;

// Write the updated tsconfig.json
fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
console.log('Updated tsconfig.json with skipLibCheck option');
