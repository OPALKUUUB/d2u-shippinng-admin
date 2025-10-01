import React, { forwardRef } from "react"
import { cn } from "../../lib/utils"

const FormField = ({ children, className, ...props }) => (
   <div className={cn("space-y-3", className)} {...props}>
      {children}
   </div>
)

const FormLabel = ({ children, required, className, ...props }) => (
   <label
      className={cn("block text-sm font-medium text-gray-900", className)}
      {...props}
   >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
   </label>
)

const FormInput = forwardRef(
   ({ className, type = "text", error, ...props }, ref) => {
      return (
         <input
            type={type}
            className={cn(
               "flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm",
               "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent",
               "disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
               error && "border-red-500 focus:ring-red-500",
               className
            )}
            ref={ref}
            {...props}
         />
      )
   }
)

const FormTextarea = forwardRef(({ className, error, ...props }, ref) => {
   return (
      <textarea
         className={cn(
            "flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm",
            "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50 resize-vertical transition-all duration-200",
            error && "border-red-500 focus:ring-red-500",
            className
         )}
         ref={ref}
         {...props}
      />
   )
})

const FormError = ({ children, className }) => {
   if (!children) return null

   return (
      <p className={cn("text-sm text-red-600 mt-1", className)}>{children}</p>
   )
}

const FormButton = ({
   children,
   variant = "primary",
   size = "default",
   loading = false,
   className,
   disabled,
   ...props
}) => {
   const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

   const variants = {
      primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900",
      secondary:
         "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300",
      outline:
         "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-900",
   }

   const sizes = {
      sm: "h-9 px-4 text-sm",
      default: "h-12 px-6 py-3",
      lg: "h-14 px-8 text-base",
   }

   return (
      <button
         className={cn(
            baseStyles,
            variants[variant],
            sizes[size],
            loading && "cursor-not-allowed opacity-50",
            className
         )}
         disabled={disabled || loading}
         {...props}
      >
         {loading && (
            <svg
               className="animate-spin -ml-1 mr-2 h-4 w-4"
               fill="none"
               viewBox="0 0 24 24"
            >
               <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
               />
               <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
               />
            </svg>
         )}
         {children}
      </button>
   )
}

FormInput.displayName = "FormInput"
FormTextarea.displayName = "FormTextarea"

export { FormField, FormLabel, FormInput, FormTextarea, FormError, FormButton }
