import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'All Phase Electric | Estimate Request',
  description: 'Request an electrical estimate from All Phase Electric & Maintenance, Inc.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
