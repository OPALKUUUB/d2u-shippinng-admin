import React from "react"
import { cn } from "../../lib/utils"

const Card = ({ className, ...props }) => (
   <div
      className={cn(
         "rounded-xl border border-gray-200 bg-white shadow-sm",
         className
      )}
      {...props}
   />
)

const CardHeader = ({ className, ...props }) => (
   <div className={cn("flex flex-col space-y-1.5 p-8", className)} {...props} />
)

const CardTitle = ({ className, children, ...props }) => (
   <h3
      className={cn(
         "text-2xl font-semibold leading-none tracking-tight text-gray-900",
         className
      )}
      {...props}
   >
      {children}
   </h3>
)

const CardDescription = ({ className, children, ...props }) => (
   <p className={cn("text-sm text-gray-600", className)} {...props}>
      {children}
   </p>
)

const CardContent = ({ className, ...props }) => (
   <div className={cn("p-8 pt-0", className)} {...props} />
)

const CardFooter = ({ className, ...props }) => (
   <div className={cn("flex items-center p-8 pt-0", className)} {...props} />
)

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
