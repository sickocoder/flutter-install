#!/usr/bin/env node

const fs = require('fs');
const YAML = require('yaml');
const exec = require('child_process').exec;
const path = require('path');

const filename = 'pubspec.yaml';
const filePath = path.join(__dirname, filename);

if (process.argv.length < 3) {
  throw Error('Invalid command! Dependencie name not specified!');
}

const argument = process.argv[2];

if (!argument.includes('@')) {
  throw Error('Invalid command! Dependencie version not specified!');
}

const dep = argument.split('@');

if (dep.length !== 2)
  throw Error('Invalid command! Incorrect dependencie format!');

const depName = dep[0];
const depVersion = dep[1];

if (parseInt(depVersion).toString() === 'NaN')
  throw Error('Invalid command! Dependencie version must be a number!');

fs.readFile(filePath, { encoding: 'utf-8' }, (error, fileData) => {
  if (error)
    throw Error(
      `Couldn't find ${filename} file! Make sure you're in flutter project directory`
    );

  const data = YAML.parse(fileData);
  data.dependencies = { ...data.dependencies, [depName]: '^' + depVersion };

  fs.writeFile(filePath, YAML.stringify(data), 'utf8', () => {
    exec('flutter pub get', function (error) {
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  });
});
