import React from "react"

function PasteImage({ handlePasteImage, width="100px", height="100px", placeholder="Click then paste" }) {
   return (
      <div
         onPaste={handlePasteImage}
         // className={`w-[150px] h-[150px] cursor-pointer transition-all duration-300 hover:border-blue-500 bg-zinc-50 text-[rgba(0,0,0,.8)] border-[0.5px] rounded-lg border-dashed border-[rgba(0,0,0,0.1)] flex items-center justify-center text-center`}
         className={`w-[${width}] h-[${height}] cursor-pointer transition-all duration-300 hover:border-blue-500 bg-zinc-50 text-[rgba(0,0,0,.8)] border-[0.5px] rounded-lg border-dashed border-[rgba(0,0,0,0.1)] flex items-center justify-center text-center`}
      >
         {placeholder}
      </div>
   )
}

export default PasteImage
