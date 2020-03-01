!(function(factory) {
  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define('$B', factory);
  } else {
    window.$B = factory();
  }
})(function() {
  const MEM_SIZE = 30000,
    EXTEND_SIZE = 5,
    $B = {
      compile(program, input) {
        const addressStack = [], memory = new Array(MEM_SIZE).fill(0);
        let iptr = 0, mptr = 0, end = false, output = ''; // instruction ptr, memory ptr

        while (!end) {
          switch (program[iptr]) {
            case '>':
              if (iptr === MEM_SIZE - 1) {
                memory.concat(new Array(EXTEND_SIZE).fill(0));
              }
              mptr++;
              break;
            case '<':
              mptr--;
              break;
            case '+':
              memory[mptr]++;
              break;
            case '-':
              memory[mptr]--;
              break;
            case '.':
              output += getASIIValue(memory[mptr]);
              break;
            case ',':
              if (input) {
                memory[mptr] = input.charCodeAt(0);
                input = input.substring(1);
              }
              break;
            case '[':
              if (memory[mptr]) {
                addressStack.push(iptr);
              } else {
                let openBracketsCount = 0;

                while(true) {
                  iptr++;
                  if (!program[iptr]) {
                    break;
                  } else if (program[iptr] === '[') {
                    openBracketsCount++;
                  } else if (program[iptr] === ']') {
                    if (openBracketsCount) openBracketsCount--;
                    else break;
                  }
                }
              }
              break;
            case ']':
              iptr = addressStack.pop() - 1;
              break;
            case undefined:
              end = true;
              break;
          }

          iptr++;
        }

        return output;
      }
    };

  function getASIIValue(val) {
    return String.fromCharCode(val);
  }

  return $B;
});
