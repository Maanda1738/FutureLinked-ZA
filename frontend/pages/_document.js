import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en-ZA">
      <Head>
        {/* Favicons - Multiple sizes for all devices */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/favicon-16x16.svg" />
        <link rel="icon" type="image/svg+xml" sizes="32x32" href="/favicon-32x32.svg" />
        <link rel="icon" type="image/svg+xml" sizes="192x192" href="/favicon-192x192.svg" />
        <link rel="icon" type="image/svg+xml" sizes="512x512" href="/favicon-512x512.svg" />
        
        {/* Apple Touch Icon for iOS */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.svg" />
        
        {/* Web App Manifest for PWA support */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#667eea" />
        <meta name="msapplication-TileColor" content="#667eea" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FutureLinked ZA" />
        <meta property="og:image" content="/logo.svg" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content="/logo.svg" />
        
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="PSvgAYtMtHjSlq9AanDxuUcF1JtBvJWObHtezovLt8A" />
        
        {/* Google AdSense Account Verification */}
        <meta name="google-adsense-account" content="ca-pub-5675694305993193" />
        
        {/* Preconnect to backend API */}
        <link rel="preconnect" href="http://localhost:3001" />
        <link rel="dns-prefetch" href="http://localhost:3001" />
        
        {/* Google AdSense */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5675694305993193"
          crossOrigin="anonymous"
        />
        
        {/* Google Custom Search Engine */}
        <script 
          async 
          src="https://cse.google.com/cse.js?cx=025daad35782144af"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
