define(function (require, exports, module) {
  var runtimes = [];

  function assemble(runtime) {
    runtimes.push(runtime);
  }

  function KMEditor(selector) {
    // console.info("selector====",selector)
    this.selector = selector;
    for (var i = 0; i < runtimes.length; i++) {
      if (typeof runtimes[i] == 'function') {
        runtimes[i].call(this, this);
      }
    }
  }

  KMEditor.assemble = assemble;

  assemble(require('./runtime/container'));
  assemble(require('./runtime/fsm'));
  assemble(require('./runtime/minder'));
  assemble(require('./runtime/receiver'));
  assemble(require('./runtime/hotbox'));
  assemble(require('./runtime/input'));
  assemble(require('./runtime/clipboard-mimetype'));
  assemble(require('./runtime/clipboard'));
  assemble(require('./runtime/drag'));
  assemble(require('./runtime/node'));
  assemble(require('./runtime/history'));
  assemble(require('./runtime/jumping'));
  assemble(require('./runtime/priority'));
  assemble(require('./runtime/progress'));
  assemble(require('./runtime/exports'));

  return module.exports = KMEditor;
});
