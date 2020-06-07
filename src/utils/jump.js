export function jumpForward (program, _iptr) {
  let iptr = _iptr, openBracketsCount = 1;

  while (openBracketsCount > 0) {
    switch (program[++iptr]) {
      case '[':
        openBracketsCount++;
        break;
      case ']':
        openBracketsCount--;
    }
  }

  return iptr;
}

export function jumpBackward (program, _iptr) {
  let iptr = _iptr, closeBracketsCount = 1;

  while (closeBracketsCount > 0) {
    switch (program[--iptr]) {
      case ']':
        closeBracketsCount++;
        break;
      case '[':
        closeBracketsCount--;
    }
  }

  return iptr;
}
