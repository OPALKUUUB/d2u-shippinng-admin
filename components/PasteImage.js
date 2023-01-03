import React from "react"

function PasteImage({ handlePasteImage }) {
   return (
      <div
         onPaste={handlePasteImage}
         className="w-[100px] h-[100px] cursor-pointer transition-all duration-300 hover:border-blue-500 bg-zinc-50 text-[rgba(0,0,0,.8)] border-[0.5px] rounded-lg border-dashed border-[rgba(0,0,0,0.1)] flex items-center justify-center text-center"
      >
         Click then paste
      </div>
   )
}

export default PasteImage
