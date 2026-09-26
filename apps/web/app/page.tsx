import React from " react\;
import TaskForm from \../components/TaskForm\;
import { useSSE } from \../hooks/useSSE\;

export default function Dashboard() {
 const { events, status } = useSSE(\sample-task-id\);

 return (
 <main className=\p-4 md:p-8 max-w-6xl mx-auto\>
 <h1 className=\text-2xl font-bold mb-6\>AI Agent Control Center</h1>
 <div className=\grid grid-cols-1 md:grid-cols-2 gap-6\>
 <div className=\order-2 md:order-1\>
 <TaskForm />
 </div>
 <div className=\order-1 md:order-2\>
 <h2 className=\text-xl font-semibold mb-4\>Real-time Events</h2>
 <div className=\p-4 border rounded bg-black text-green-400 font-mono h-64 overflow-y-auto text-xs md:text-sm\>
 <p className=\mb-2 text-gray-500\>Status: {status}</p>
 {events.map((e, i) => (
 <div key={i} className=\mb-1\>[{e.timestamp}] {e.type}: {JSON.stringify(e.payload)}</div>
 ))}
 </div>
 </div>
 </div>
 </main>
 );
}
