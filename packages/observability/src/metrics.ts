export interface MetricValue {
  value: number;
  timestamp: string;
  labels: Record<string, string>;
}

export class MetricsCollector {
  private metrics: Record<string, MetricValue[]> = {};

  record(name: string, value: number, labels: Record<string, string> = {}) {
    if (!this.metrics[name]) this.metrics[name] = [];
    this.metrics[name].push({ value, timestamp: new Date().toISOString(), labels });
  }

  getSummary(name: string) {
    const data = this.metrics[name] || [];
    return {
      count: data.length,
      avg: data.reduce((a, b) => a + b.value, 0) / (data.length || 1),
    };
  }
}

export const metrics = new MetricsCollector();
