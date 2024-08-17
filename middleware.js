import { NextResponse } from "next/server"

const allowedOrigins = [
   "http://localhost:5173",
   "https://web-invoice.d2u-shipping.com",
]

const corsOptions = {
   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
   "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export function middleware(request) {
   const origin = request.headers.get("origin") ?? ""
   const method = request.method
   const isAllowedOrigin = allowedOrigins.includes(origin)
   let response = NextResponse.next()
   if (isAllowedOrigin) {
      console.log("Allowed Origin", origin)

      response.headers.set("Access-Control-Allow-Origin", origin)
   }
   Object.entries(corsOptions).forEach(([key, value]) => {
      response.headers.set(key, value)
   })

   if (method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: response.headers })
   }

   return response
}

export const config = {
   matcher: "/api/:path*",
}
