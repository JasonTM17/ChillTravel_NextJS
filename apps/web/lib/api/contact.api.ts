import { api } from "./client";
import type { ApiSuccess } from "@vietwander/shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  destinationInterested: string | null;
  message: string;
  status: string;
  assignedTo: string | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitContactRequest {
  name: string;
  email: string;
  phone?: string;
  destinationInterested?: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Contact API
// ---------------------------------------------------------------------------

export const contactApi = {
  submit: (data: SubmitContactRequest) =>
    api.post<ApiSuccess<ContactRequest>>("/contact-requests", data),
};
