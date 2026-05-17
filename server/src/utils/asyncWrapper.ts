import type { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncWrapper = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
};
