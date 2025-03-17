import Head from 'next/head';

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

export default function SEO({
  title,
  description = 'AI-powered learning platform for engineering excellence',
  canonical,
  ogImage = '/og-image.jpg',
}: SEOProps) {
  const fullTitle = `${title} | Learnopolis`;
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
} 