export interface Lead {
  id: number;
  name: string;
  email: string;
}

export interface Session {
  name: string;
  password: string;
  isSignedIn: boolean;
  theme: 'light' | 'dark' | 'device';
}
