const fs = require('fs');
const path = require('path');

function findFile(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    console.log("Directory not found:", startPath);
    return;
  }

  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      findFile(filename, filter); // Recurse into subdirectories
    } else if (filename.indexOf(filter) >= 0) {
      console.log('Found file:', filename);
    }
  }
}

console.log('Searching for db.js or db/index.js...');
findFile('../src', 'db.js');
findFile('../src', 'db/index.js'); 