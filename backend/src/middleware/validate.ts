import type { Request, Response, NextFunction } from "express";
import type { ZodSchema, ZodError } from "zod";

interface ValidateOptions {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

export const validate = (options: ValidateOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (options.body) {
        req.body = options.body.parse(req.body);
      }
      if (options.params) {
        // params is an object like { interviewId: "..." }, parse each value
        const parsedParams: Record<string, string> = {};
        for (const [key, value] of Object.entries(req.params)) {
          parsedParams[key] = options.params.parse(String(value)) as string;
        }
        req.params = parsedParams as typeof req.params;
      }
      if (options.query) {
        req.query = options.query.parse(req.query) as typeof req.query;
      }
      next();
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        const zodError = error as ZodError;
        const errors = zodError.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          message: "Validation failed",
          errors,
        });
      }
      throw error;
    }
  };
};
