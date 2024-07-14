interface FieldError {
  message: string | null;
  field: string | null;
}

export class HTTPError extends Error {
  statusCode: number;
  errorsMessages: FieldError[];
  context: string | null;

  constructor(
    statusCode: number,
    message: string,
    field: string | null = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorsMessages = [{ message, field }];
  }
}
