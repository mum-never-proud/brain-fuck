const MAX_CHAR_VALUE = 256;
const EXTEND_SIZE = 10;
const MEM_SIZE = 300; // 300 cells
const BRAIN_FUCK_CONFIG = {
  tokens: [
    '>',
    '<',
    '+',
    '-',
    '.',
    ',',
    '[',
    ']'
  ],
  instructions: {
    memoryPointerRight: '>',
    memoryPointerLeft: '<',
    instructionPointerIncrement: '+',
    instructionPointerDecrement: '-',
    output: '.',
    input: ',',
    loopStart: '[',
    loopEnd: ']',
  },
  wordCount: 1,
  splitter: ''
};

export { BRAIN_FUCK_CONFIG, EXTEND_SIZE, MAX_CHAR_VALUE, MEM_SIZE };
