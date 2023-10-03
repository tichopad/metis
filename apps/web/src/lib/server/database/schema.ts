import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

type ISO8601 = string;

export interface ConversationTable {
  id: string;
  user_id: string;
  group_id: string | null;
  name: string;
  description: string | null;
  system_prompt: string | null;
  created_at: ColumnType<ISO8601, ISO8601 | undefined, never>;
  updated_at: ColumnType<ISO8601, ISO8601 | undefined, string | undefined>;
}
export type Conversation = Selectable<ConversationTable>;
export type NewConversation = Insertable<ConversationTable>;
export type ConversationUpdate = Updateable<ConversationTable>;

export interface GroupTable {
  id: string;
  user_id: string;
  name: string;
  system_prompt: string | null;
  created_at: ColumnType<ISO8601, ISO8601 | undefined, never>;
  updated_at: ColumnType<ISO8601, ISO8601 | undefined, string | undefined>;
}
export type Group = Selectable<GroupTable>;
export type NewGroup = Insertable<GroupTable>;
export type GroupUpdate = Updateable<GroupTable>;

export interface MessageTable {
  id: string;
  conversation_id: string;
  content: string;
  author: 'system' | 'user' | 'assistant' | 'function';
  created_at: ColumnType<ISO8601, ISO8601 | undefined, never>;
  updated_at: ColumnType<ISO8601, ISO8601 | undefined, string | undefined>;
}
export type Message = Selectable<MessageTable>;
export type NewMessage = Insertable<MessageTable>;
export type MessageUpdate = Updateable<MessageTable>;

export interface UserTable {
  id: string;
  email: string;
  name: string;
  openai_api_key: string;
  created_at: ColumnType<ISO8601, ISO8601 | undefined, never>;
  updated_at: ColumnType<ISO8601, ISO8601 | undefined, string | undefined>;
}
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface DB {
  conversation: ConversationTable;
  group: GroupTable;
  message: MessageTable;
  user: UserTable;
}
