import { useEffect, useState } from " react\;

export function useSSE(taskId: string) {
 const [events, setEvents] = useState<any[]>([]);
 const [status, setStatus] = useState(\connecting\);

 useEffect(() => {
 if (!taskId) return;
 const eventSource = new EventSource(/api/v1/tasks//events);

 eventSource.onmessage = (event) => {
 const data = JSON.parse(event.data);
 setEvents(prev => [...prev, data]);
 };

 eventSource.onopen = () => setStatus(\connected\);
 eventSource.onerror = () => setStatus(\error\);

 return () => eventSource.close();
 }, [taskId]);

 return { events, status };
}
