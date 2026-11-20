import type { Request } from "express";
import jwt from "jsonwebtoken";
import type { AuthChecker } from "type-graphql";

export type Context = { userId?: string };

export async function buildContext({ req }: { req: Request }): Promise<Context> {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return {};

  try {
    const { sub } = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    return { userId: sub };
  } catch {
    return {};
  }
}

export const authChecker: AuthChecker<Context> = ({ context }) => Boolean(context.userId);
