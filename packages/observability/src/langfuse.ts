export class LangfuseAdapter {
  private enabled = process.env.LANGFUSE_ENABLED === " true\;

 async trace(name: string, data: any) {
 if (!this.enabled) return;
 console.log([Langfuse Trace] :, data);
 // Actual implementation would call Langfuse API
 }
}

export const langfuse = new LangfuseAdapter();
