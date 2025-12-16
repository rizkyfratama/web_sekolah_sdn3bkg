export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  image: string;
  nip?: string;
  phone?: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  category: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}