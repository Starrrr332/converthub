const SITE_URL = 'https://converthub.com';

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

export function buildHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[],
  image?: string,
) {
  return {
    '@type': 'HowTo',
    name,
    description,
    ...(image && { image }),
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url }),
    })),
  };
}

export interface FAQQuestion {
  question: string;
  answer: string;
}

export function buildFAQSchema(questions: FAQQuestion[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

export function buildBreadcrumbList(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface ArticleSchemaProps {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  url?: string;
}

export function buildArticleSchema({
  headline,
  description,
  datePublished,
  dateModified,
  author = 'ConvertHub',
  image,
  url,
}: ArticleSchemaProps) {
  return {
    '@type': 'Article',
    headline,
    description,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ConvertHub',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    ...(image && { image }),
    ...(url && { url }),
  };
}

export function buildSoftwareAppSchema(
  name: string,
  description: string,
  url: string,
  category = 'UtilitiesApplication',
) {
  return {
    '@type': 'SoftwareApplication',
    name: `ConvertHub - ${name}`,
    description,
    url,
    operatingSystem: 'Any',
    applicationCategory: category,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function buildOrganizationSchema() {
  return {
    '@type': 'Organization',
    name: 'ConvertHub',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    sameAs: [],
    description:
      'Herramientas gratuitas para convertir y editar archivos directamente en tu navegador.',
  };
}

export function buildWebSiteSchema() {
  return {
    '@type': 'WebSite',
    name: 'ConvertHub',
    url: SITE_URL,
    description: 'Más de 52 herramientas gratis para convertir, editar y procesar archivos.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildCollectionPageSchema(name: string, description: string, url: string) {
  return {
    '@type': 'CollectionPage',
    name,
    description,
    url,
  };
}
