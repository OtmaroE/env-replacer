console.log('test');
const fs = require('fs');
const file = require('readline').createInterface({
  input: require('fs').createReadStream('./config.js')
});

const values = {
  value1: process.env.value1,
  value2: process.env.value2,
}

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