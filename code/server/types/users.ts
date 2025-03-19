import { Request } from "express";

export type Nullable<T> = T | null;

export interface User {
  id: string;
  customerId: string;
  subscriptionId: Nullable<string>;
  status: Status;
  lastPaymentFailure: Nullable<Date>;
  failedPaymentId: Nullable<string>;
  createdAt: Date;
  updatedAt: Date;
  email: string;
}

export enum Status {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  PAYMENT_FAILED = "payment_failed",
  TRIALING = "trialing",
  NOT_STARTED = "not_started",
}

export enum PortalAction {
  UPDATE_PAYMENT_METHOD = "payment_method_update",
  CANCEL = "subscription_cancel",
  ACCOUNT = "account",
}

export interface CustomRequest extends Request {
  userId?: string;
  email?: string;
  status?: Status;
}
