import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current tsconfig.json
const tsconfigPath = path.join(__dirname, 'tsconfig.json');
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

// Add skipLibCheck option
tsconfig.compilerOptions.skipLibCheck = true;

// Write the updated tsconfig.json
fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
console.log('Updated tsconfig.json with skipLibCheck option');
