import $B from '../src/brain-fuck';

describe('brain fuck test', () => {
  it('should throw error when program is empty', () => {
    expect(() => new $B().compile()).toThrowError(Error);
  });

  it('should increment the value current cell (0)', () => {
    const bf = new $B('++++').compile();

    expect(bf.memory[0]).toEqual(4);
  });

  it('should decrement the value of current cell (0)', () => {
    const bf = new $B('++++----').compile();

    expect(bf.memory[0]).toEqual(0);
  });

  it('memory pointer should not underflow', () => {
    const bf = new $B('<');

    bf.compile();

    expect(bf.mptr).toEqual(0);
  });

  it('should extend memory when needed', () => {
    const bf = new $B('>>');
    bf.memory = Array(2).fill(0);

    bf.compile();

    expect(bf.memory.length).toEqual(12);
  });

  it('should print hello world', () => {
    // shortest way (known to me) to print hello world
    expect(new $B('+[-[<<[+[--->]-[<<<]]]>>>-]>-.---.>..>.<<<<-.<+.>>>>>.>.<<.<-.').compile().output).toEqual('hello world');
  });

  // dont waste 20s to detect infinite loop, also you need to settimeout for jest which is 5s by default
  // can be commented out if desperate to check :)

  // it('should exit after 20s (infinite loop)', done => {
  //   const bf = new $B(
  //      random bytes generator
  //     '>>>++[<++++++++[<[<++>-]>>[>>]+>>+[-[->>+<<<[<[<<]<+>]>[>[>>]]]<[>>[-]]>[>[-<<]>[<+<]]+<<]<[>+<-]>>-]<.[-]>>]'
  //   ).compile();

  //   setTimeout(() => {
  //     expect(bf.infinite).toBeTruthy();
  //     done();
  //   }, 21000);
  // });

  it('should sort the numbers (insertion sort)', () => {
    const bf = new $B(`
      >>+>,[
        <[
            [>>+<<-]>[<<+<[->>+[<]]>>>[>]<<-]<<<
        ]>>[<<+>>-]<[>+<-]>[>>]<,
      ]<<<[<+<]>[>.>]
    `, '54321').compile();

    expect(bf.output).toEqual('12345');
  });
});
