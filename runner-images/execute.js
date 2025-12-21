const { spawn } = require('child_process');
const fs = require('fs');

const TIMEOUT_SECONDS = 10;

try {
    // Read all code from standard input (fd 0)
    const userCode = fs.readFileSync(0, 'utf-8');
    
    // Write the code to a temporary file
    fs.writeFileSync('index.js', userCode);

    // Execute the user's file
    const child = spawn('node', ['index.js'], { timeout: TIMEOUT_SECONDS * 1000 });

    child.stdout.on('data', (data) => {
        process.stdout.write(data);
    });

    child.stderr.on('data', (data) => {
        process.stderr.write(data);
    });

    child.on('error', (err) => {
        if (err.code === 'ETIMEDOUT') {
            console.error('Execution timed out (10 seconds)');
        } else {
            console.error('Failed to run code:', err.message);
        }
    });

} catch (e) {
    console.error('An internal error occurred:', e.message);
}