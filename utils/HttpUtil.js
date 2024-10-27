import axios from "axios"

const axiosClient = axios.create({
   timeout: 50000,
   maxContentLength: Infinity,
   maxBodyLength: Infinity,
   withCredentials: false,
   decompress: true,
   validateStatus(status) {
      return status >= 200 && status < 300
   },
})

const handleRequest = async (requestFn, ...params) => {
   try {
      const response = await requestFn(...params)
      return response.data
   } catch (error) {
      console.error("API Request Error:", error)
      throw error
   }
}

const get = (url, config = {}) => handleRequest(axiosClient.get, url, config)

const post = (url, data, config = {}) =>
   handleRequest(axiosClient.post, url, data, config)

const put = (url, data, config = {}) =>
   handleRequest(axiosClient.put, url, data, config)

const patch = (url, data, config = {}) =>
   handleRequest(axiosClient.patch, url, data, config)

const deleteRequest = (url, config = {}) =>
   handleRequest(axiosClient.delete, url, config)

export const extractContentApi = (response) => response.data

export const handleError = (error) => {
   console.error("Error in API call:", error.message || error)

   if (error.response) {
      console.error("Response data:", error.response.data)
      console.error("Response status:", error.response.status)
      console.error("Response headers:", error.response.headers)
   } else if (error.request) {
      console.error("No response received:", error.request)
   } else {
      console.error("Error message:", error.message)
   }

   // Rethrow error for further handling
   throw error
}

const HttpUtil = { get, post, put, patch, delete: deleteRequest }
export default HttpUtil
