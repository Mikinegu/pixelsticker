import { Sticker } from '../types';

export const categories = ['All', 'Tech', 'Animals', 'Aesthetic', 'Typography'];

export const mockStickers: Sticker[] = [
  {
    id: 's1',
    name: 'Retro Mac Holographic',
    price: 3.5,
    description: 'A classic retro Macintosh sticker with a beautiful holographic finish. Perfect for your laptop!',
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1549488344-c6a6f68c340b?w=500&q=80',
    reviews: [
      { id: 'r1', author: 'Alex', rating: 5, comment: 'Looks amazing on my Macbook!', date: '2023-10-12' },
      { id: 'r2', author: 'Jordan', rating: 4, comment: 'Good quality, slight peeling on edges.', date: '2023-11-05' }
    ]
  },
  {
    id: 's2',
    name: 'Sleepy Cat',
    price: 2.99,
    description: 'An adorable sleepy orange tabby cat to keep you company while you work.',
    category: 'Animals',
    imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=500&q=80',
    reviews: [
      { id: 'r3', author: 'Sam', rating: 5, comment: 'So cute! I bought 3.', date: '2023-09-22' }
    ]
  },
  {
    id: 's3',
    name: 'Vaporwave Sun',
    price: 4.0,
    description: 'Aesthetic vaporwave sunset design with neon colors.',
    category: 'Aesthetic',
    imageUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&q=80',
    reviews: []
  },
  {
    id: 's4',
    name: '"Coffee Then Code"',
    price: 3.0,
    description: 'Bold typography sticker for the caffeine-fueled developer.',
    category: 'Typography',
    imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&q=80',
    reviews: [
      { id: 'r4', author: 'DevDan', rating: 5, comment: 'My life motto.', date: '2024-01-10' }
    ]
  },
  {
    id: 's5',
    name: 'Mechanical Keyboard Switch',
    price: 3.25,
    description: 'A detailed illustration of a cherry MX blue switch.',
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80',
    reviews: []
  },
  {
    id: 's6',
    name: 'Shiba Inu Doge',
    price: 3.5,
    description: 'Such wow. Very sticker. Much sticky.',
    category: 'Animals',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&q=80',
    reviews: [
      { id: 'r5', author: 'CryptoBro', rating: 5, comment: 'To the moon!', date: '2023-12-01' }
    ]
  },
  {
    id: 's7',
    name: 'Pastel Peach',
    price: 2.5,
    description: 'A soft, minimalist pastel peach design.',
    category: 'Aesthetic',
    imageUrl: 'https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=500&q=80',
    reviews: []
  },
  {
    id: 's8',
    name: '"Stay Curious"',
    price: 3.0,
    description: 'Elegant serif typography reminding you to always explore.',
    category: 'Typography',
    imageUrl: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=500&q=80',
    reviews: [
      { id: 'r6', author: 'Emma', rating: 4, comment: 'Looks very classy.', date: '2024-02-15' }
    ]
  }
];
