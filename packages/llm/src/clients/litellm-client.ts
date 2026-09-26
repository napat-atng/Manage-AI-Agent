
import { ModelGateway } from "@aacc/contracts";
import axios, { AxiosInstance } from "axios";

export class LiteLLMClient implements ModelGateway {
  private client: AxiosInstance;

  constructor(baseUrl: string = process.env.LITELLM_BASE_URL || "http://localhost:4000") {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.LITELLM_API_KEY || "sk-default"}`,
      },
    });
  }

  async generateResponse(prompt: string, config: any): Promise<{ text: string; usage: any }> {
    try {
      const response = await this.client.post("/chat/completions", {
        model: config.modelName,
        messages: [{ role: "user", content: prompt }],
        temperature: config.temperature,
        max_tokens: config.maxTokens,
      });

      const choice = response.data.choices[0].message.content;
      const usage = response.data.usage;

      return {
        text: choice,
        usage: {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
        },
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async *streamResponse(prompt: string, config: any): AsyncIterable<{ chunk: string; usage?: any }> {
    try {
      const response = await this.client.post(
        "/chat/completions",
        {
          model: config.modelName,
          messages: [{ role: "user", content: prompt }],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          stream: true,
        },
        { responseType: "stream" }
      );

      for await (const chunk of response.data) {
        const text = this.parseStreamChunk(chunk);
        if (text) yield { chunk: text };
      }
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private parseStreamChunk(chunk: any): string | null {
    const str = chunk.toString();
    if (str.startsWith("data: ")) {
      const data = str.replace("data: ", "").trim();
      if (data === "[DONE]") return null;
      try {
        const json = JSON.parse(data);
        return json.choices[0]?.delta?.content || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  private handleError(error: any): Error {
    const status = error.response?.status;
    const message = error.response?.data?.error?.message || error.message;
    
    if (status === 429) return new Error(`Rate limit exceeded: ${message}`);
    if (status === 401) return new Error(`Unauthorized: ${message}`);
    if (status === 504) return new Error(`Gateway timeout: ${message}`);
    
    return new Error(`LLM Gateway Error: ${message}`);
  }
}

