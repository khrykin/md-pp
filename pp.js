#!/usr/bin/env node
"use strict";

/* --------------------------------------------------------------- */

const fs          = require('fs');
const path        = require('path');
const escape      = require('escape-regexp');

/* --------------------------------------------------------------- */

const file        = path.resolve(process.argv[2]);
const dir         = path.dirname(file);
const variablesJS = path.join(dir, 'variables.js');
const outDir      = path.join(dir, 'out');

/* --------------------------------------------------------------- */

getFileAndPreprocess();

if (process.argv.indexOf("--watch") > -1) {
  console.log(`Watchnig ${file} and ${variablesJS} for changes`);
    fs.watch(file, (event) => {
      getFileAndPreprocess();
    });
    fs.watch(variablesJS, (event) => {
      getFileAndPreprocess();
    });
}


/**
 *
 *
 */

function getFileAndPreprocess() {
  delete require.cache[require.resolve(variablesJS)];
  try {
    const variables = require(variablesJS);
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) throw err;
      if (!fs.existsSync(outDir)){
        fs.mkdirSync(outDir);
      }
      fs.writeFileSync(
        path.join(outDir, path.basename(file)),
        pp(data, variables), 'utf8');
        console.log(`${file} processed`)
    });
  } catch (e) {
    console.log(e.stack);
  }
}

/**
 *
 *
 */

function pp(input, variables) {
  const REG = /\$\{\s*([\d\.\w_]+)\s*\}/g;
  let output = input.split(/\$\{\s*[\d\.\w_]+\s*\}/);
  let matches = input.match(REG);

  if (!matches) return input;

  const substitutes = matches.map((v,i) => {

    const key = v.replace(/[\$\{\s\}]/g,'');
    const keys = key.split('.')
    const value = deepValue(variables, keys);

    console.log(key + ' : ' + value);

    if (!value) {
      console.log(`Warning: variable "${key}" is undefined`);
    }
    return value || '';
  });

  return mix(output, substitutes).join('');
}

/**
 *
 *
 */

function mix(arr1, arr2) {
  let output = [];
  arr1.forEach((v, i) => {
    output.push(v + (arr2[i] || ''));
  });
  return output;
}

/**
 *
 *
 */

function deepValue(object, keys) {
  let output = object;
  keys.forEach(key => {
    output = output && output[key];
  });
  return output;
}
