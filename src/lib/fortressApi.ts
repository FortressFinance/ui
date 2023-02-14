import axios from "axios"

import { BACKEND_URL } from "@/constant/env"

type ApiResult<TResponseBody> = {
  data: TResponseBody | undefined | null
  status: string
}

const fortressApi = {
  post: <ResponseBody>(endpoint: string, data: unknown) =>
    axios.post<ApiResult<ResponseBody>>(`${BACKEND_URL}/${endpoint}`, data),
}

export default fortressApi
