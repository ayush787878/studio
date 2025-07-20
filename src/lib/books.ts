
import React from 'react';

export interface Book {
  slug: string;
  title: string;
  summary: string;
  coverImageHint: string;
  coverImageUrl?: string;
  downloads: string;
  downloadUrl: string;
  highlights: string[];
  razorpayPaymentId: string;
}

export const books: Book[] = [
  {
    slug: 'lookmaxxing-tips',
    title: 'Lookmaxxing Tips',
    summary: 'A comprehensive guide to maximizing your aesthetic potential, covering everything from facial symmetry to personal grooming.',
    coverImageHint: 'modern self-improvement',
    downloads: '4500+',
    downloadUrl: 'https://example.com/download',
    highlights: [
      'Mastering facial exercises for a defined jawline.',
      'Understanding the principles of facial harmony.',
      'Grooming hacks for a polished appearance.',
      'Building confidence from the inside out.',
    ],
    razorpayPaymentId: 'pl_Qv76yGaH0NuNo8',
  },
  {
    slug: 'face-care-fundamentals',
    title: 'Face Care Fundamentals',
    summary: 'Learn the essentials of skincare, from identifying your skin type to building a routine that delivers results.',
    coverImageHint: 'skincare products',
    coverImageUrl: 'https://i.ibb.co/7d6htLT/White-and-Black-Clean-and-Simple-Photo-Skincare-Routine-Instagram-Story.png',
    downloads: '8200+',
    downloadUrl: 'https://example.com/download',
    highlights: [
      'The science behind cleansers, toners, and moisturizers.',
      'How to choose products for your specific skin type.',
      'A step-by-step guide to a perfect morning and night routine.',
      'Sunscreen essentials: protecting your skin from aging.',
    ],
    razorpayPaymentId: 'pl_Qv7A0Ys6QKyFtI',
  },
  {
    slug: 'how-to-glow-up',
    title: 'How to Glow Up',
    summary: 'A holistic approach to transforming your appearance and boosting your self-esteem, inside and out.',
    coverImageHint: 'glowing aesthetic',
    downloads: '12500+',
    downloadUrl: 'https://example.com/download',
    highlights: [
      'Nutrition and hydration for radiant skin.',
      'The impact of sleep on your overall look.',
      'Finding a personal style that expresses your best self.',
      'Mindfulness techniques for inner confidence.',
    ],
    razorpayPaymentId: 'pl_Qv7AvlXundTwAr',
  },
  {
    slug: 'how-to-remove-face-pimple',
    title: 'How to Remove Face Pimple',
    summary: 'An expert guide to understanding, treating, and preventing acne for clearer, healthier skin.',
    coverImageHint: 'clear skin',
    downloads: '9800+',
    downloadUrl: 'https://example.com/download',
    highlights: [
      'Identifying the root causes of pimples and breakouts.',
      'Effective over-the-counter ingredients and treatments.',
      'Lifestyle changes to prevent future acne.',
      'Safe and effective ways to handle a breakout.',
    ],
    razorpayPaymentId: 'pl_Qv7BbxqSxje0xR',
  },
];
