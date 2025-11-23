import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
console.log('Reading .env from:', envPath);

try {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    console.log('Keys found in .env:');
    lines.forEach(line => {
        const match = line.match(/^([^=]+)=/);
        if (match) {
            console.log(match[1]);
        }
    });
} catch (err) {
    console.error('Error reading .env:', err);
}
