import './globals.css';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ToastProvider } from '@/components/ui/Toast';
import { CookieBanner } from '@/components/ui/CookieBanner';

export const metadata = {
  title: 'Chefito - Smart Cooking Assistant Platform',
  description: 'Smart Cooking Assistant Platform - Your beginner-friendly cooking companion with interactive recipes and voice guidance. Created for World\'s Largest Hackathon by Bolt.',
  keywords: 'cooking, recipes, voice guidance, AI, beginner-friendly, hackathon, bolt.new, cooking assistant, smart kitchen, culinary education',
  authors: [{ name: 'Salwa Essafi', url: 'https://www.linkedin.com/in/salwaessafi' }],
  creator: 'Salwa Essafi',
  publisher: 'Chefito',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chefito.xyz',
    title: 'Chefito - Smart Cooking Assistant Platform',
    description: 'Your beginner-friendly cooking companion with interactive recipes and voice guidance',
    siteName: 'Chefito',
    images: [
      {
        url: 'https://chefito.xyz/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Chefito - Smart Cooking Assistant Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chefito - Smart Cooking Assistant Platform',
    description: 'Your beginner-friendly cooking companion with interactive recipes and voice guidance',
    images: ['https://chefito.xyz/og-image.jpg'],
    creator: '@soofmaax',
  },
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://chefito.xyz',
  },
  category: 'Food & Cooking',
  manifest: '/manifest.json',
  themeColor: '#f97316',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    title: 'Chefito',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <link rel="canonical" href="https://chefito.xyz" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#f97316" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        <meta httpEquiv="Permissions-Policy" content="microphone=self, camera=self, geolocation=self" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Chefito",
              "description": "Smart Cooking Assistant Platform with voice guidance",
              "url": "https://chefito.xyz",
              "applicationCategory": "LifestyleApplication",
              "operatingSystem": "Web Browser",
              "author": {
                "@type": "Person",
                "name": "Salwa Essafi",
                "url": "https://www.linkedin.com/in/salwaessafi"
              },
              "offers": {
                "@type": "Offer",
                "price": "19.99",
                "priceCurrency": "EUR",
                "description": "Premium subscription with unlimited recipes"
              }
            })
          }}
        />
      </head>
      <body className="font-sans">
        <ErrorBoundary>
          <ToastProvider>
            {children}
            <CookieBanner />
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}