import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "GPT INLINE AUTOCOMPLETE",
  description: "CHATGPT INLINE AUTOCOMPLETE",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="dark">{children}</body>
    </html>
  );
}
