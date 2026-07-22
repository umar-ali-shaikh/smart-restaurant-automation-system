import { ValidationError } from "../shared/errors/AppError.js";

export function validateRequest({ body, params, query } = {}) {
  return (req, res, next) => {
    const errors = [];

    for (const [location, schema] of [["body", body], ["params", params], ["query", query]]) {
      if (!schema) continue;
      const result = schema.safeParse(req[location]);
      if (!result.success) {
        errors.push(...result.error.issues.map((issue) => ({
          location,
          field: issue.path.join("."),
          message: issue.message,
        })));
      } else {
        req[location] = result.data;
      }
    }

    if (errors.length) return next(new ValidationError("Request validation failed", errors));
    return next();
  };
}
