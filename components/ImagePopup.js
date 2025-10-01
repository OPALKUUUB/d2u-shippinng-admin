/* eslint-disable import/no-extraneous-dependencies */
import React from "react"
import ImageGallery from "react-image-gallery"
import "react-image-gallery/styles/css/image-gallery.css"
import { CloseOutlined } from "@ant-design/icons"

const ImagePopup = ({ images, isOpen, onClose, startIndex = 0 }) => {
   if (!isOpen) return null

   // Convert single image or array to gallery format
   const galleryImages = Array.isArray(images)
      ? images.map((img) => ({
           original: img,
           thumbnail: img,
           originalAlt: "Product Image",
           thumbnailAlt: "Product Thumbnail",
        }))
      : [
           {
              original: images,
              thumbnail: images,
              originalAlt: "Product Image",
              thumbnailAlt: "Product Thumbnail",
           },
        ]

   return (
      <div
         style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
         }}
         onClick={onClose} // ปิดเมื่อคลิกพื้นหลัง
      >
         <div
            style={{
               position: "relative",
               maxWidth: "90vw",
               maxHeight: "90vh",
               width: "100%",
            }}
            onClick={(e) => e.stopPropagation()} // ป้องกันการปิดเมื่อคลิกใน gallery
         >
            <ImageGallery
               items={galleryImages}
               startIndex={startIndex}
               showThumbnails={galleryImages.length > 1}
               showPlayButton={false}
               showFullscreenButton
               showNav={galleryImages.length > 1}
               slideDuration={300}
               slideInterval={3000}
               lazyLoad
               additionalClass="custom-image-gallery"
            />

            {/* ปุ่มปิด */}
            <button
               onClick={onClose}
               style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  background: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  color: "#666",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  transition: "all 0.2s ease",
                  zIndex: 10000,
               }}
               onMouseOver={(e) => {
                  e.target.style.background = "#f5f5f5"
                  e.target.style.color = "#262626"
               }}
               onMouseOut={(e) => {
                  e.target.style.background = "white"
                  e.target.style.color = "#666"
               }}
               onFocus={(e) => {
                  e.target.style.background = "#f5f5f5"
                  e.target.style.color = "#262626"
               }}
               onBlur={(e) => {
                  e.target.style.background = "white"
                  e.target.style.color = "#666"
               }}
            >
               <CloseOutlined />
            </button>
         </div>

         <style jsx global>{`
            .custom-image-gallery .image-gallery-slide img {
               max-height: 70vh;
               object-fit: contain;
            }

            .custom-image-gallery .image-gallery-thumbnail img {
               border-radius: 4px;
            }

            .custom-image-gallery .image-gallery-thumbnail.active,
            .custom-image-gallery .image-gallery-thumbnail:hover {
               border: 2px solid #1677ff;
            }
         `}</style>
      </div>
   )
}

export default ImagePopup
