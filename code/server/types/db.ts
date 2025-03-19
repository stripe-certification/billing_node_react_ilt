import { User } from "./users";
import { LlmModel, offeringsConfig, PricedLlmModel } from "./llm";
import { Session } from "express-session";

export interface SessionRecord {
  id: string;
  session: Session;
  expires: number;
}

export interface DatabaseSchema {
  users: Record<string, User>;
  llm: Record<string, LlmModel | PricedLlmModel>;
  sessions: SessionRecord[];
}

export const DB_FILE_PATH = "db.json";
export const INIT_DB_VALUE: DatabaseSchema = {
  users: {},
  llm: offeringsConfig.models,
  sessions: [],
};
