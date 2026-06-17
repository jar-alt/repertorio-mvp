export type CardType = 
  | 'thought' 
  | 'quote' 
  | 'link' 
  | 'image' 
  | 'insight' 
  | 'reference' 
  | 'trend' 
  | 'observation' 
  | 'sketch'
  | 'concept';

export interface Card {
  id: string;
  user_id: string; // Owner of the card
  type: CardType;
  title?: string;
  content: string;
  tags: string[];
  date: string;
  context?: string; // Optional Project/Collection name
  author?: string;  // For quotes
  source?: string;  // For references/links
  imageUrl?: string; // For images
  projects?: string[]; // List of Project IDs
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  user_id: string; // Owner of the project
  name: string;
  description?: string;
  itemCount: number;
  created_at?: string;
}
