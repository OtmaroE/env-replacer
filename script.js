console.log('test');
const fs = require('fs');

const values = {
  value1: process.env.value1,
  value2: process.env.value2,
}

// if .env file exists, gets their values
if (fs.existsSync('./.env')) {
  createFileFromTemplateWithLocalVars();
} else {
  createFileFromTemplate();
}

function createFileFromTemplateWithLocalVars() {
  let envVariables;
  envVariables = require('readline').createInterface({
    input: require('fs').createReadStream('./.env')
  });
  envVariables.on('line', (line) => {
    switch (true) {
      case line.includes('value1'):
        values.value1 = line.split('=')[1];
        break;
      case line.includes('value2'):
        values.value2 = line.split('=')[1];
        break;
    }
  });
  envVariables.on('close', () => {
    createFileFromTemplate();
  });
}

function createFileFromTemplate() {
  const file = require('readline').createInterface({
    input: require('fs').createReadStream('./config.js')
  });
  let nFile = '';
  file.on('line', (line) => {
    switch (true) {
      case line.includes('process.env.value1'):
        nFile += line.replace('process.env.value1', `'${values.value1}'`) + '\n';
        break;
      case line.includes('process.env.value2'):
        nFile += line.replace('process.env.value2', `'${values.value2}'`) + '\n'
        break;
      default:
        nFile += line + '\n';
    }
  });

  file.on('close', (line) => {
    fs.writeFile('./config.js', nFile, (err, data) => {
      if (err) {
        console.log(err);
      }
      console.log('Environment variables injected!');
    });
  });
}