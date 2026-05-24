import './globals.css';

export const metadata = {
  title: 'CodeShield AI Demo',
  description: 'Free GitHub PR security bot that catches secrets and common vulnerabilities before merge.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
