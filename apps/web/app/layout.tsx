import React from " react\;

export const metadata = {
 title: \AI Agent Control Center\,
 description: \Manage AI Agents and Workflows\,
 manifest: \/app/manifest.json\,
 viewport: \width=device-width initial-scale=1 maximum-scale=1\,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
 <html lang=\en\>
 <head>
 <meta name=\theme-color\ content=\#3b82f6\ />
 </head>
 <body className=\bg-white text-slate-900 antialiased\>{children}</body>
 </html>
 );
}
