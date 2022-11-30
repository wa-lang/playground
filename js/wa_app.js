(() => {
  class WaApp {
    constructor() {
      this._inst = null;
    }

    init(instance) {
      this._inst = instance;
    }

    async run(instance) {
      this._inst = instance;
      this._inst.exports.main();
    }

    mem() {
      return this._inst.exports.memory;
    }

    memView(addr, len) {
      return new DataView(this._inst.exports.memory.buffer, addr, len);
    }

    memUint8Array(addr, len) {
      return new Uint8Array(this.Mem().buffer, addr, len)
    }

    getString(addr, len) {
      return new TextDecoder("utf-8").decode(this.memView(addr, len));
    }

    setString(addr, len, s) {
      const bytes = new TextEncoder("utf-8").encode(s);
      if (len > bytes.length) { len = bytes.length; }
      this.MemUint8Array(addr, len).set(bytes);
    }
  }

  window['waApp'] = new WaApp();
})()