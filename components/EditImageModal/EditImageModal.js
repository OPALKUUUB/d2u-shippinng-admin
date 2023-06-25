import { Button, Modal, Upload, message } from "antd"
import React, { useEffect, useState } from "react"
import PasteImage from "../PasteImage"

const EditImageModal = ({ images, tracking, setTrigger }) => {
   const [open, setOpen] = useState(false)
   const [confirmLoading, setConfirmLoading] = useState(false)
   const [thumbUrl, setThumbUrl] = useState(
      images.length > 0 ? images[0] : null
   )
   
   const [fileList, setFileList] = useState(
      images.map((img, idx) => ({
         uid: `image-${idx}`,
         name: `image-${idx}`,
         url: typeof img === "string" ? img : null, // Handle URL images
         thumbUrl: typeof img === "string" ? img : null, // Handle URL images
         originFileObj: typeof img === "string" ? null : img, // Handle base64 images
      }))
   )
   const handleOpenModal = () => {
      setOpen(true)
   }
   const handleCloseModal = () => {
      setOpen(false)
   }
   const onChange = ({ fileList: newFileList }) => {
      setFileList(newFileList)
   }
   const onPreview = async (file) => {
      // let src = file.url
      let src = file.url || file.thumbUrl
      if (!src) {
         src = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.readAsDataURL(file.originFileObj)
            reader.onload = () => resolve(reader.result)
         })
      }
      const image = new Image()
      image.src = src
      const imgWindow = window.open(src)
      imgWindow?.document.write(image.outerHTML)
   }

   const handlePasteImage = async (e) => {
      const items = e.clipboardData?.items
      if (!items) return

      // Look for an image among the pasted items
      const blob = Array.from(items)
         .filter((item) => item.type.indexOf("image") !== -1)
         .map((item) => item.getAsFile())[0]

      // If an image is found, read it as a data URL and add it to the file list
      if (blob) {
         const reader = new FileReader()
         reader.readAsDataURL(blob)
         reader.onload = () => {
            const newFileList = [
               {
                  uid: `paste-${Date.now()}`,
                  name: blob.name,
                  type: blob.type,
                  size: blob.size,
                  originFileObj: blob,
                  url: reader.result,
                  status: "done"
               },
               ...fileList,
            ]
            setFileList(newFileList.slice(0, 7))
         }
      }
   }

   // eslint-disable-next-line consistent-return
   const handleOk = async () => {
      setConfirmLoading(true)
      const temp_images = await Promise.all(
         fileList
            .filter((fi) => fi?.status === "done")
            .map(async (cur) => {
               // console.log(cur)
               // const file = cur
               // const src = await new Promise((resolve) => {
               //    const reader = new FileReader()
               //    reader.readAsDataURL(file.originFileObj)
               //    reader.onload = () => resolve(reader.result)
               // })
               // const image = new Image()
               // image.src = src
               // return image.src
               if (cur.url) {
                  // URL image
                  return cur.url
               } 
               // Base64 image
               const src = await new Promise((resolve) => {
                  const reader = new FileReader()
                  reader.readAsDataURL(cur.originFileObj)
                  reader.onload = () => resolve(reader.result)
               })
               const image = new Image()
               image.src = src
               return image.src
               
            })
      )
      try {
         const deletedImages = images.filter(
            (image) => !fileList.some((fi) => fi.url === image)
         )
         console.log(temp_images)
         console.log("deleted images:")
         console.log(deletedImages)
         await fetch("/api/tracking/shimizu/upload/image", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               images: temp_images,
               delete_images: deletedImages,
               tracking_id: tracking.id,
            }),
         })
         setTrigger((prev) => !prev)
      } catch (err) {
         console.log(`Error: ${err}`)
      } finally {
         message.success("upload successful!")
         console.log("upload image finished")
         setConfirmLoading(false)
         setOpen(false)
      }
   }

   useEffect(() => {
      // console.log(tracking)
      setThumbUrl(images.length > 0 ? images[0] : null)
      setFileList(
         images.map((img, idx) => ({
            uid: `image-${idx}`,
            name: `image-${idx}`,
            url: img,
         }))
      )
   }, [images, tracking])

   return (
      <>
         {!thumbUrl && (
            <div>
               <Button onClick={handleOpenModal}>เพิ่มรูปภาพ</Button>
            </div>
         )}
         {thumbUrl && (
            <div className="w-[100px] h-[100px] overflow-hidden">
               <img
                  className="w-full cursor-pointer"
                  src={thumbUrl}
                  alt=""
                  onClick={handleOpenModal}
               />
            </div>
         )}
         <Modal
            onOk={handleOk}
            title="เพิ่มรูปภาพ"
            open={open}
            onCancel={handleCloseModal}
            confirmLoading={confirmLoading}
         >
            <div>
               <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
               >
                  {fileList.length < 3 && "+ Upload"}
               </Upload>
               {fileList.length < 3 && (
                  <PasteImage handlePasteImage={handlePasteImage} />
               )}
            </div>
         </Modal>
      </>
   )
}

export default EditImageModal
