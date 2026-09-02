import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'All Phase Electric | Request an Estimate',
    template: '%s | All Phase Electric',
  },
  description: 'Request an electrical estimate from All Phase Electric & Maintenance, Inc.',
  applicationName: 'All Phase Electric Estimate',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b1628',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
