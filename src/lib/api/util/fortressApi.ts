import axios from "axios"

import { BACKEND_URL } from "@/constant/env"

type ApiResult<TData> = {
  data: TData | undefined | null
  status: string
}

export const fortressApi = {
  post: <ResponseBody>(endpoint: string, data: unknown) =>
    axios.post<ApiResult<ResponseBody>>(`${BACKEND_URL}/${endpoint}`, data),
}
