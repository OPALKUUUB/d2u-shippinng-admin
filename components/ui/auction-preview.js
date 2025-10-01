import React from "react"
import { cn } from "../../lib/utils"

const AuctionPreview = ({ auctionData, className }) => {
   if (!auctionData) return null

   const { title, images, price, detail } = auctionData

   return (
      <div
         className={cn(
            "rounded-xl border-2 border-gray-200 bg-gray-50 p-6 space-y-6",
            className
         )}
      >
         <div className="flex items-center space-x-3">
            <div className="h-2 w-2 rounded-full bg-gray-900" />
            <h3 className="text-lg font-semibold text-gray-900">
               ข้อมูลสินค้าที่ค้นพบ
            </h3>
         </div>

         <div className="grid md:grid-cols-3 gap-6">
            {/* Product Image */}
            {images && images.length > 0 && (
               <div className="md:col-span-1">
                  <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white">
                     <img
                        src={images[0]}
                        alt={title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                           e.target.style.display = "none"
                        }}
                     />
                  </div>
               </div>
            )}

            {/* Product Details */}
            <div
               className={cn(
                  "space-y-4",
                  images && images.length > 0
                     ? "md:col-span-2"
                     : "md:col-span-3"
               )}
            >
               <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                     ชื่อสินค้า:
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{title}</p>
               </div>

               <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xl font-bold text-gray-900">
                     ราคาปัจจุบัน: {price?.toLocaleString()} เยน
                  </p>
               </div>

               {detail && detail !== title && (
                  <div>
                     <h4 className="font-semibold text-gray-900 mb-2">
                        รายละเอียด:
                     </h4>
                     <p className="text-gray-600 text-sm leading-relaxed max-h-24 overflow-y-auto">
                        {typeof detail === "string"
                           ? detail
                           : JSON.stringify(detail)}
                     </p>
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}

export default AuctionPreview
