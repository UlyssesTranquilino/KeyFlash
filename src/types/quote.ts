export interface Quote {
  id: number;
  created_at: string; // Typically an ISO 8601 string from database timestamps
  author: string;
  content: string;
  category: string | null; // Category can be null if not specified
}
