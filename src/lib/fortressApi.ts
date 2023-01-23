import axios from "axios"

import { BACKEND_URL } from "@/constant/env"
export interface ApiResult {
  status: string
}

const fortressApi = {
  post: <ResponseBody>(endpoint: string, data: unknown) =>
    axios.post<ResponseBody>(`${BACKEND_URL}/${endpoint}`, data),
}

export default fortressApi
