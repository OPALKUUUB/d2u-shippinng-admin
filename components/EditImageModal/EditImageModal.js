import { Button, Modal, Upload } from "antd"
import React, { useEffect, useState } from "react"
import PasteImage from "../PasteImage"

const EditImageModal = ({ images, tracking }) => {
   const [open, setOpen] = useState(false)
   const [thumbUrl, setThumbUrl] = useState(
      images.length > 0 ? images[0] : null
   )
   const [fileList, setFileList] = useState(
      images.map((img, idx) => ({
         uid: `image-${idx}`,
         name: `image-${idx}`,
         url: img,
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
      let src = file.url
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
               },
               ...fileList,
            ]
            setFileList(newFileList.slice(0, 7))
         }
      }
   }

   // eslint-disable-next-line consistent-return
   const handleOk = async () => {
      const temp_images = await Promise.all(
         fileList
            .filter((fi) => fi?.status === "done")
            .map(async (cur) => {
               const file = cur
               const src = await new Promise((resolve) => {
                  const reader = new FileReader()
                  reader.readAsDataURL(file.originFileObj)
                  reader.onload = () => resolve(reader.result)
               })
               const image = new Image()
               image.src = src
               // console.log(image.src)
               return image.src
            })
      )
      // console.log(temp_images)
      try {
         const response = await fetch("/api/tracking/shimizu/upload/image", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ images: temp_images }),
         })
         const responseJson = await response.json()
         console.log(responseJson)
      } catch (err) {
         console.log(`Error: ${err}`)
      }
   }

   useEffect(() => {
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
      <div className="w-[100px] h-[100px] overflow-hidden">
         {thumbUrl && (
            <img
               className="w-full cursor-pointer"
               src={thumbUrl}
               alt=""
               onClick={handleOpenModal}
            />
         )}
         {!thumbUrl && (
            <div>
               <Button onClick={handleOpenModal}>Add Image</Button>
            </div>
         )}
         <Modal
            onOk={handleOk}
            title="เพิ่มรูปภาพ"
            open={open}
            onCancel={handleCloseModal}
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
      </div>
   )
}

export default EditImageModal
