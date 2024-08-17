import { NextResponse } from "next/server"

const allowedOrigins = [
   "http://localhost:5173",
   "https://web-invoice.d2u-shipping.com",
]

const corsOptions = {
   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
   "Access-Control-Allow-Headers": "Content-Type, Authorization",
   "Access-Control-Allow-Credentials": "true",
}

export function middleware(request) {
   const origin = request.headers.get("origin")
   const response = NextResponse.next()
   if (allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin)
      response.headers.set(
         "Access-Control-Allow-Methods",
         "GET,POST,PUT,DELETE,OPTIONS"
      )
      response.headers.set(
         "Access-Control-Allow-Headers",
         "Content-Type, Authorization"
      )
      response.headers.set("Access-Control-Allow-Credentials", "true")
   }

   if (request.method === "OPTIONS") {
      return new NextResponse(null, {
         status: 204,
         headers: response.headers,
      })
   }

   return response
}

export const config = {
   matcher: "/api/:path*",
}
