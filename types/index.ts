export interface Lead {
  id: string; // Changed from number to string to match mock data
  name: string;
  email: string;
  company?: string | null; // Optional, can be null
  title?: string; // Optional, can be empty string
  phone?: string; // Optional
  tags?: string[]; // Optional array of tags
  notes?: string | null; // Optional, can be null
  createdAt?: string; // Optional ISO date string
  image?: string | null; // Optional image URL or path
}

export interface Session {
  name: string;
  password: string;
  isSignedIn: boolean;
  theme: 'light' | 'dark' | 'device';
}
