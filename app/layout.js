// app/layout.js
import Navbar from '../components/Navbar';
import './globals.css'; // Ensure global styles are applied

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{`Products - Your Store Name`}</title>
        <meta name="description" content="Explore our wide range of products available at your store." />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="../../../app/favicon.ico" />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
