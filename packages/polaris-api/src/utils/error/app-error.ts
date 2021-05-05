import HttpStatus from "http-status-codes";

/* eslint-disable @typescript-eslint/no-explicit-any */
type ErrorExtraData = Record<string, string | number | null | undefined>;

type ErrorData = {
  name?: string;
  statusCode?: number;
  error?: Error;
  extra?: ErrorExtraData;
} & ({ name: string } | { statusCode: number });

/**
 * Since most of the errors we throw should have an Http code attached, we extend the native Error
 * to support this. The error type is defined by the name field, just like the native Error.
 *
 * For more info @see https://github.com/goldbergyoni/nodebestpractices#2-error-handling-practices
 */
export class AppError extends Error {
  public get statusCode(): number | undefined {
    return this.data.statusCode;
  }

  public get originalError(): Error | undefined {
    return this.data.error;
  }

  public get extra(): ErrorExtraData {
    return this.data.extra || {};
  }

  constructor(message: string, private data: ErrorData) {
    super(message);
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, AppError.prototype);

    this.setName(data.name, data.statusCode);

    if (data.error && data.error.stack) {
      this.stack = data.error.stack;
    }
  }

  public toJSON(): Record<string, any> {
    const result: Record<string, any> = {
      name: this.name,
      message: this.message,
    };

    if (Object.keys(this.extra).length > 0) {
      result.extra = this.extra;
    }

    if (this.originalError instanceof AppError) {
      result.error = this.originalError.toJSON();
    } else if (this.originalError) {
      result.error = {
        name: this.originalError.name,
        message: this.originalError.message,
      };
    }

    return result;
  }

  private setName(name?: string, statusCode?: number): void {
    if (name) {
      this.name = name;
    } else if (statusCode !== undefined) {
      this.name = HttpStatus.getStatusText(statusCode).replace(" ", "");
    } else {
      this.name = "AppError";
    }
  }
}
