class Persona {
  constructor(prompt, opts = {}) {
    this.messages = [...prompt]; // Clone the prompt
    this.opts = opts;
  }

  addMessage(msg) {
    this.messages.push(msg);
  }

  async ask() {
    if (!this.opts.client) {
      throw new Error("Persona not connected: opts.client === undefined");
    }
    return this.opts.client.ask(this);
  }

  clone() {
    return new Persona(
      this.messages.map((m) => ({ role: m.role, content: m.content })),
      this.opts
    );
  }
}

export default Persona;
