export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  icon: string;
}

export const products: Product[] = [
  {
    id: 'social-media-manager',
    name: 'Social Media Manager',
    description: 'Auto-post, schedule, and engage on X, Instagram, Facebook.',
    price: 7900,
    icon: '📱',
  },
  {
    id: 'local-seo',
    name: 'Local SEO',
    description: 'Optimize Google Business profile and get found locally.',
    price: 7900,
    icon: '🔍',
  },
  {
    id: 'email-newsletter',
    name: 'Email Newsletter',
    description: 'Weekly newsletters written and scheduled automatically.',
    price: 7900,
    icon: '📧',
  },
  {
    id: 'event-agent',
    name: 'Event Agent',
    description: 'Automate taproom event promotion, RSVPs, and reminders.',
    price: 7900,
    icon: '📅',
  },
  {
    id: 'brewery-bundle',
    name: 'Brewery Bundle',
    description: 'All 4 AI Agents — everything you need.',
    price: 19900,
    icon: '🎁',
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function calculateTotal(productIds: string[]): number {
  return productIds.reduce((total, id) => {
    const product = getProduct(id);
    return total + (product?.price ?? 0);
  }, 0);
}
