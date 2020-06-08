import { assertString, assertObject } from './assert'

export default function (program, splitter, from, to) {
  assertString(program, 'program');
  assertString(splitter, 'splitter');
  assertObject(from, 'from');
  assertObject(to, 'to');

  let output = '';
  const table = {};

  program
    .split('')
    .forEach(ch => {
      if (table.hasOwnProperty(ch)) {
        output += to[table[ch]] + splitter;
      } else {
        for (const [key, value] of Object.entries(from)) {
          if (value === ch) {
            table[value] = key;
            output += to[key] + splitter;
            break;
          }
        }
      }
    });

  return output;
}
