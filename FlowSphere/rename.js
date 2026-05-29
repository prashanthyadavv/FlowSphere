const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const replaceInFile = (filePath) => {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.json') && !filePath.endsWith('.md')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  content = content.replace(/VenueFlow AI/g, 'FlowSphere');
  content = content.replace(/VenueFlow/g, 'FlowSphere');
  content = content.replace(/venueflow\.ai/g, 'flowsphere.io');
  content = content.replace(/venueflow-ai/g, 'flowsphere');
  content = content.replace(/venueflow-theme/g, 'flowsphere-theme');
  content = content.replace(/venueflow-auth/g, 'flowsphere-auth');
  content = content.replace(/venueflow/g, 'flowsphere');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
};

const srcDir = path.join(__dirname, 'src');
const publicDir = path.join(__dirname, 'public');
const pkgFile = path.join(__dirname, 'package.json');
const readmeFile = path.join(__dirname, 'README.md');

let files = walkSync(srcDir);
files = files.concat(walkSync(publicDir));
files.push(pkgFile);
files.push(readmeFile);

files.forEach(replaceInFile);
console.log("Done rebranding.");
