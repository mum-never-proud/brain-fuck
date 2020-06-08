import { assertArray, assertNumber, assertObject } from './assert'

export function jumpForward (tokens, _iptr, instructions = {}) {
  assertArray(tokens, 'tokens');
  assertNumber(_iptr, 'instruction pointer');
  assertObject(instructions, 'instructions');

  let iptr = _iptr, openBracketsCount = 1;

  while (openBracketsCount > 0) {
    iptr += instructions.wordCount;

    switch (tokens.slice(iptr, iptr + instructions.wordCount).join(' ')) {
      case instructions.loopStart:
        openBracketsCount++;
        break;
      case instructions.loopEnd:
        openBracketsCount--;
        break;
    }
  }

  return iptr;
}

export function jumpBackward (tokens, _iptr, instructions) {
  assertArray(tokens, 'tokens');
  assertNumber(_iptr, 'instruction pointer');
  assertObject(instructions, 'instructions');

  let iptr = _iptr, closeBracketsCount = 1;

  while (closeBracketsCount > 0) {
    iptr -= instructions.wordCount;

    switch (tokens.slice(iptr, iptr + instructions.wordCount).join(' ')) {
      case instructions.loopEnd:
        closeBracketsCount++;
        break;
      case instructions.loopStart:
        closeBracketsCount--;
        break;
    }
  }

  return iptr;
}
