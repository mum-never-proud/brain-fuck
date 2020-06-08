import { assertString, assertObject } from './utils/assert';
import { BRAIN_FUCK_CONFIG, MAX_CHAR_VALUE, EXTEND_SIZE, MEM_SIZE } from './constants/index';
import { jumpBackward, jumpForward } from './utils/jump';
import sanitizeProgram from './utils/santize-program';
import converter from './utils/converter';
class BrainFuck {
  constructor (program, input, config = {}) {
    assertString(program, 'program');
    assertObject(config, 'config');

    this.program = program;
    this.memory = Array(MEM_SIZE).fill(0);
    this.input = input || '';
    this.output = '';
    this.iptr = 0; // instruction pointer
    this.mptr = 0; // memory pointer
    this.infinite = false;
    this.brainFuckConfig = Object.assign({}, BRAIN_FUCK_CONFIG, config);
  }

  compile () {
    const {
      splitter,
      tokens,
      wordCount
    } = this.brainFuckConfig;

    this.tokens = sanitizeProgram(
      this.program,
      splitter,
      tokens
    );

    if (!this.tokens.length) {
      throw new Error('invalid program');
    }

    const {
      memoryPointerRight,
      memoryPointerLeft,
      instructionPointerIncrement,
      instructionPointerDecrement,
      output,
      input,
      loopStart,
      loopEnd
    } = this.brainFuckConfig.instructions;
    const fetchInstruction = () => this.tokens.slice(this.iptr, this.iptr + wordCount).join(splitter);
    const t1 = performance.now();

    while (this.iptr < this.tokens.length) {
      if (performance.now() - t1 > 20000) { // infinite detection, there might be a better way than this :)
        this.infinite = true;
        break;
      }

      switch (fetchInstruction()) {
        case memoryPointerRight:
          if (this.mptr >= this.memory.length - 1) {
            this.memory = this.memory.concat(Array(EXTEND_SIZE).fill(0));
          }

          this.mptr++;
          break;
        case memoryPointerLeft:
          this.mptr = this.mptr - 1 < 0 ? this.mptr : this.mptr - 1;
          break;
        case instructionPointerIncrement:
          this.memory[this.mptr] = (this.memory[this.mptr] + 1) % MAX_CHAR_VALUE;
          break;
        case instructionPointerDecrement:
          let val = this.memory[this.mptr] - 1;

          if (val < 0) {
            val += MAX_CHAR_VALUE * (Math.ceil(-val / MAX_CHAR_VALUE))
          }

          this.memory[this.mptr] = val;
          break;
        case output:
          this.output += String.fromCharCode(this.memory[this.mptr]);
          break;
        case input:
          this.memory[this.mptr] = this.input.charCodeAt(0);
          this.input = this.input.slice(1);
          break;
        case loopStart:
          if (!this.memory[this.mptr]) {
            this.iptr = jumpForward(this.tokens, this.iptr, {
              loopStart,
              loopEnd,
              wordCount
            });
          }
          break;
        case loopEnd:
          if (this.memory[this.mptr]) {
            this.iptr = jumpBackward(this.tokens, this.iptr, {
              loopStart,
              loopEnd,
              wordCount
            });
          }
          break;
      }

      this.iptr += wordCount;
    }

    const t2 = performance.now();

    return {
      program: this.program,
      input: this.input,
      output: this.output,
      memory: this.memory,
      compilationTime: t2 - t1,
      infinite: this.infinite
    };
  }

  convert (program) {
    assertString(program, 'program');

    return converter(
      program,
      this.brainFuckConfig.splitter,
      BRAIN_FUCK_CONFIG.instructions,
      this.brainFuckConfig.instructions
    );
  }
}

module.exports = BrainFuck;
