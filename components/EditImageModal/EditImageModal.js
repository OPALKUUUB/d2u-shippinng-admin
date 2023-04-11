import { Button } from "antd"
import React from "react"

const EditImageModal = ({ images, item }) => {
   const tracking_id = item.id
   const thumbUrl = images.length > 0 ? images[0] : false
   if (thumbUrl) {
      return (
         <div className="w-[100px] h-[100px] overflow-hidden">
            <img className="w-full" src={thumbUrl} alt="" />
         </div>
      )
   }
   return <div><Button>Add Image</Button></div>
}

export default EditImageModal
