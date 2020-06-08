import { assertString, assertArray } from './assert';

export default function (program, splitter, whitelistedWords = []) {
  assertString(program, 'program');
  assertString(splitter, 'splitter');
  assertArray(whitelistedWords, 'whitelisted words');

  return program
    .replace(/\n/g, '')
    .split(splitter)
    .filter(token => whitelistedWords.includes(token));
}
