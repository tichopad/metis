import type { ColumnType } from 'kysely';

type ISO8601 = string;

export interface Conversation {
  id: string;
  user_id: string;
  group_id: string | null;
  name: string;
  description: string | null;
  system_prompt: string | null;
  created_at: ColumnType<ISO8601, ISO8601 | undefined, never>;
  updated_at: ColumnType<ISO8601, ISO8601 | undefined, string | undefined>;
}

export interface Group {
  id: string;
  user_id: string;
  name: string;
  system_prompt: string | null;
  created_at: ColumnType<ISO8601, ISO8601 | undefined, never>;
  updated_at: ColumnType<ISO8601, ISO8601 | undefined, string | undefined>;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  author: 'user' | 'bot' | 'system';
  created_at: ColumnType<ISO8601, ISO8601 | undefined, never>;
  updated_at: ColumnType<ISO8601, ISO8601 | undefined, string | undefined>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  openai_api_key: string;
  created_at: ColumnType<ISO8601, ISO8601 | undefined, never>;
  updated_at: ColumnType<ISO8601, ISO8601 | undefined, string | undefined>;
}

export interface DB {
  conversation: Conversation;
  group: Group;
  message: Message;
  user: User;
}
