import now from 'performance-now';
import { MAX_CHAR_VALUE, EXTEND_SIZE, MEM_SIZE } from './constants/index';
import { jumpBackward, jumpForward } from './utils/jump';

class BrainFuck {
  constructor (program, input) {
    this.program = program;
    this.memory = Array(MEM_SIZE).fill(0);
    this.input = input || '';
    this.output = '';
    this.iptr = 0; // instruction pointer
    this.mptr = 0; // memory pointer
    this.infinite = false;
  }

  compile () {
    if (!this.program) {
      throw Error('nothing to compile');
    }

    const t1 = now();

    while (this.iptr < this.program.length) {
      if (now() - t1 > 20000) { // infinite detection, there might be a better way than this :)
        this.infinite = true;
        break;
      }

      switch (this.program[this.iptr]) {
        case '>':
          if (this.mptr >= this.memory.length - 1) {
            this.memory = this.memory.concat(Array(EXTEND_SIZE).fill(0));
          }

          this.mptr++;
          break;
        case '<':
          this.mptr = this.mptr - 1 < 0 ? this.mptr : this.mptr - 1;
          break;
        case '+':
          this.memory[this.mptr] = (this.memory[this.mptr] + 1) % MAX_CHAR_VALUE;
          break;
        case '-':
          let val = this.memory[this.mptr] - 1;

          if (val < 0) {
            val += MAX_CHAR_VALUE * (Math.ceil(-val / MAX_CHAR_VALUE))
          }

          this.memory[this.mptr] = val;
          break;
        case '.':
          this.output += String.fromCharCode(this.memory[this.mptr]);
          break;
        case ',':
          this.memory[this.mptr] = this.input.charCodeAt(0);

          this.input = this.input.slice(1);
          break;
        case '[':
          if (!this.memory[this.mptr]) {
            this.iptr = jumpForward(this.program, this.iptr);
          }
          break;
        case ']':
          if (this.memory[this.mptr]) {
            this.iptr = jumpBackward(this.program, this.iptr);
          }
          break;
      }

      this.iptr++;
    }

    const t2 = now();

    return {
      program: this.program,
      input: this.input,
      output: this.output,
      memory: this.memory,
      compilationTime: t2 - t1,
      infinite: this.infinite
    };
  }
}

module.exports = BrainFuck;
