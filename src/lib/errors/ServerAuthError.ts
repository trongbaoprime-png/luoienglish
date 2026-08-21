export class ServerAuthError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 401) {
    super(message);
    this.name = "ServerAuthError";
    this.statusCode = statusCode;
  }
}
