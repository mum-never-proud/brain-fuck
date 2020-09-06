importScripts('https://cdn.jsdelivr.net/gh/mum-never-proud/brain-fuck/dist/brain-fuck.min.js');

self.addEventListener('message', function(e) {
  self.postMessage({
    type: 'brain-fuck-output',
    output: new $B(e.data.program.replace(/\n/gi, ''), e.data.args).compile()
  });
});
