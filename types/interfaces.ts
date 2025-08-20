export interface LoginUserBody {
  email: string;
  password: string;
}

export interface JwtPayloadType {
  id: string;
  email: string;
  issuedAt: number;
  expiration: number;
}

import { Request } from 'express';
export interface AuthRequest extends Request {
  user?: JwtPayloadType;
}

export interface CreateProjectBody {
  name: string;
  description?: string;
  ownerId: string;
}

export interface ListProjectsQuery {
  q?: string;
  page?: string;
  limit?: string;
}

export interface CreateTaskBody {
  title: string;
  projectId: string;
  assignedToId?: string;
  status?: "todo" | "in_progress" | "done";
  dueDate?: string;
}

export interface GetTasksQuery {
  projectId: string;
  status?: "todo" | "in_progress" | "done";
  dueBefore?: string;
  dueAfter?: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}