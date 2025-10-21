export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header style={{padding:'12px',borderBottom:'1px solid #eee'}}>Amazon Seller 管理UI</header>
        <main style={{padding:'16px'}}>{children}</main>
      </body>
    </html>
  );
}


