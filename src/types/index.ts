export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Sticker {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'Tech' | 'Animals' | 'Aesthetic' | 'Typography';
  imageUrl: string;
  reviews: Review[];
}
