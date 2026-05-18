import { env } from "../config/env";

/** Cross-origin SPA (e.g. Vercel → Render) needs SameSite=None + Secure. */
export const authCookieOptions = (maxAge?: number) => {
  const crossOrigin = env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: crossOrigin,
    sameSite: crossOrigin ? ("none" as const) : ("lax" as const),
    path: "/",
    ...(maxAge !== undefined ? { maxAge } : {})
  };
};
