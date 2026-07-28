/** Error con status HTTP explícito, para que errorHandler sepa qué código devolver. */
export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}
