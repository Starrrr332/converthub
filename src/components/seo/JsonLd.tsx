import { useEffect } from 'react';

interface JsonLdProps {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  offers?: { price: string; priceCurrency: string };
}

export function JsonLd({
  name,
  description,
  url,
  applicationCategory = 'UtilitiesApplication',
  offers = { price: '0', priceCurrency: 'USD' },
}: JsonLdProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: `ConvertHub - ${name}`,
      description,
      url,
      operatingSystem: 'Any',
      applicationCategory,
      offers: {
        '@type': 'Offer',
        price: offers.price,
        priceCurrency: offers.priceCurrency,
      },
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [name, description, url, applicationCategory, offers]);

  return null;
}
