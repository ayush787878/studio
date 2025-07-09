
import React from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  publishDate: string;
  author: string;
  summary: string;
  content: React.ReactNode;
}

export const blogPosts: BlogPost[] = [];
