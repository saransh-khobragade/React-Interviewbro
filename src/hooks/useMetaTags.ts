import { useEffect } from 'react';

interface MetaTagsOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const useMetaTags = (options: MetaTagsOptions): void => {
  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    
    // Update title
    if (options.title) {
      document.title = options.title;
      updateMetaTag('property', 'og:title', options.title);
      updateMetaTag('name', 'twitter:title', options.title);
    }
    
    // Update description
    if (options.description) {
      updateMetaTag('name', 'description', options.description);
      updateMetaTag('property', 'og:description', options.description);
      updateMetaTag('name', 'twitter:description', options.description);
    }
    
    // Update image
    if (options.image) {
      const imageUrl = options.image.startsWith('http') 
        ? options.image 
        : `${baseUrl}${options.image}`;
      updateMetaTag('property', 'og:image', imageUrl);
      updateMetaTag('property', 'og:image:secure_url', imageUrl);
      updateMetaTag('name', 'twitter:image', imageUrl);
    }
    
    // Update URL
    const url = options.url || currentUrl;
    if (url) {
      updateMetaTag('property', 'og:url', url);
      updateMetaTag('name', 'twitter:url', url);
    }
    
    // Cleanup function to restore defaults
    return () => {
      document.title = 'Interviewbro - Interview Preparation Platform';
      updateMetaTag('name', 'description', 'Master coding interviews with 75+ data structures questions, low-level design, and high-level system design problems. Practice with solutions, code snippets, and video explanations.');
      updateMetaTag('property', 'og:title', 'Interviewbro - Interview Preparation Platform');
      updateMetaTag('property', 'og:description', 'Master coding interviews with 75+ data structures questions, low-level design, and high-level system design problems. Practice with solutions, code snippets, and video explanations.');
      if (baseUrl) {
        updateMetaTag('property', 'og:url', baseUrl);
        updateMetaTag('name', 'twitter:url', baseUrl);
      }
      updateMetaTag('name', 'twitter:title', 'Interviewbro - Interview Preparation Platform');
      updateMetaTag('name', 'twitter:description', 'Master coding interviews with 75+ data structures questions, low-level design, and high-level system design problems.');
    };
  }, [options.title, options.description, options.image, options.url]);
};

const updateMetaTag = (attribute: 'name' | 'property', attributeValue: string, content: string): void => {
  let meta = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, attributeValue);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};

