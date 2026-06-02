interface SeoConfig {
  title: string;
  description: string;
  url?: string;
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('article:')) {
      el.setAttribute('property', name);
    } else {
      el.setAttribute('name', name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function setSeoMeta(config: SeoConfig) {
  const siteName = 'ConvertHub';
  const fullTitle = `${config.title} | ${siteName}`;
  const url = config.url || window.location.href;

  document.title = fullTitle;

  setMeta('description', config.description);
  setMeta('og:type', 'website');
  setMeta('og:title', fullTitle);
  setMeta('og:description', config.description);
  setMeta('og:url', url);
  setMeta('og:site_name', siteName);
  setMeta('twitter:card', 'summary');
  setMeta('twitter:title', fullTitle);
  setMeta('twitter:description', config.description);
}
