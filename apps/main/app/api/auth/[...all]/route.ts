import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@ydtb/core/server/auth";

export const { GET, POST } = toNextJsHandler(auth.handler);