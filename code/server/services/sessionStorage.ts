import { Low } from "lowdb/lib";
import { DatabaseSchema, SessionRecord } from "../types/db";
import { Session } from "express-session";

interface SessionStoreOptions {
  ttl?: number;
  disablePurge?: boolean;
}

export default function (session: typeof import("express-session")) {
  const Store = session.Store;

  class SessionStore extends Store {
    private db: Sessions;

    constructor(db: Low<DatabaseSchema>, options: SessionStoreOptions = {}) {
      super({});

      if (!Array.isArray(db.data.sessions)) {
        throw new Error("The value of the first argument must be an array.");
      }
      this.db = new Sessions(db, options.ttl);

      if (!options.disablePurge) {
        setInterval(() => {
          this.db.purge();
        }, 60000);
      }
    }

    all(callback: (err: Error | null, sessions?: Session[]) => void): void {
      callback(null, this.db.all());
    }

    clear(callback: (err?: Error | null) => void): void {
      this.db.clear();
      this.db.write();
      callback(null);
    }

    destroy(sid: string, callback: (err?: Error | null) => void): void {
      this.db.destroy(sid);
      this.db.write();
      callback(null);
    }

    get(
      sid: string,
      callback: (err: Error | null, session?: Session | null) => void
    ): void {
      callback(null, this.db.get(sid) || null);
    }

    length(callback: (err: Error | null, length?: number) => void): void {
      callback(null, this.db.length());
    }

    set(
      sid: string,
      sessionData: Session,
      callback: (err?: Error | null) => void
    ): void {
      this.db.set(sid, sessionData);
      this.db.write();
      callback(null);
    }

    touch(
      sid: string,
      sessionData: Session,
      callback: (err?: Error | null) => void
    ): void {
      this.set(sid, sessionData, callback);
    }
  }

  return SessionStore;
}

class Sessions {
  private db: Low<DatabaseSchema>;
  private ttl: number;

  constructor(db: Low<DatabaseSchema>, ttl?: number) {
    this.db = db;
    this.ttl = ttl || 86400;
  }

  get(sid: string): Session | null {
    const obj = this.db.data.sessions.find(
      (obj: SessionRecord) => obj.id === sid
    );
    return obj ? obj.session : null;
  }

  all(): Session[] {
    return this.db.data.sessions.map((obj: SessionRecord) => obj.session);
  }

  length(): number {
    return this.db.data.sessions.length;
  }

  set(sid: string, sessionData: Session): void {
    const expires = Date.now() + this.ttl * 1000;

    const objIndex = this.db.data.sessions.findIndex(
      (obj: SessionRecord) => obj.id === sid
    );
    if (objIndex !== -1) {
      this.db.data.sessions[objIndex].session = sessionData;
      this.db.data.sessions[objIndex].expires = expires;
    } else {
      this.db.data.sessions.push({ id: sid, session: sessionData, expires });
    }
  }

  destroy(sid: string): void {
    this.db.data.sessions = this.db.data.sessions.filter(
      (obj: SessionRecord) => obj.id !== sid
    );
  }

  clear(): void {
    this.db.data.sessions = [];
  }

  purge(): void {
    const now = Date.now();

    this.db.data.sessions = this.db.data.sessions.filter(
      (obj: SessionRecord) => now < obj.expires
    );
  }

  write(): void {
    this.db.write();
  }
}
