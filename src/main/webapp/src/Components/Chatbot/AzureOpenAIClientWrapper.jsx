import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

class AzureOpenAIClientWrapper {
  constructor(connectionParams, apiKey, opts = {}) {
    this.connectionParams = new URL(connectionParams.toLowerCase());
    this.apiKey = apiKey;
    this.deploymentId = this.connectionParams.pathname.match(/\/deployments\/([^\/]+)\//)[1];
    this.client = new OpenAIClient(this.connectionParams.origin, new AzureKeyCredential(this.apiKey));
    this.opts = opts;
  }

  async _unwindCompletionResponse(events) {
    const response = [];
    for await (const event of events) {
      for (const choice of event.choices) {
        const delta = choice.delta?.content;
        if (delta !== undefined) {
          response.push(delta);
        }
      }
    }
    return response.join("");
  }

  async ask(persona) {
    const events = this.client.listChatCompletions(this.deploymentId, persona.messages, { maxTokens: 1024 });
    const response = await this._unwindCompletionResponse(events);
    if (persona.opts?.persist) {
      persona.addMessage({ role: "assistant", content: response });
    }
    return response;
  }
}

export default AzureOpenAIClientWrapper;
