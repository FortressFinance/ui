export class FortressApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "FortressApiResponseError"
    Object.setPrototypeOf(this, FortressApiError.prototype)
  }
}

export function handledResponse<ResponseBody>(data: ResponseBody) {
  if (!data) throw new FortressApiError("Invalid response")
  return data
}
