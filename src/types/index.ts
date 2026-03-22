export interface Summary {
  id: string;
  user_id: string;
  title: string;
  source_type: 'pdf' | 'url' | 'text';
  source_url: string | null;
  original_text: string;
  summary: string;
  key_takeaways: string[];
  share_id: string;
  created_at: string;
}

export interface QAMessage {
  id: string;
  summary_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
