export class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", errors = null) { super(message, 400, errors); }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") { super(message, 401); }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access denied") { super(message, 403); }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") { super(message, 404); }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict") { super(message, 409); }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal server error") { super(message, 500); }
}
