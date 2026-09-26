const API_BASE = process.env.NEXT_PUBLIC_API_URL || " http://localhost:3001/api/v1\;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
 const res = await fetch(${API_BASE}, {
 ...options,
 headers: {
 \Content-Type\: \application/json\,
 ...options.headers,
 },
 });
 if (!res.ok) throw new Error(API Error: );
 return res.json();
}
