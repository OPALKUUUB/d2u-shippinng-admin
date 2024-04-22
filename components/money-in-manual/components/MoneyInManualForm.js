import { Form, Button, Divider, Upload, message, Modal } from "antd"
import {
   CheckCircleOutlined,
   ExclamationCircleOutlined,
   UploadOutlined,
} from "@ant-design/icons"
import { useContext, useRef, useState } from "react"
import axios from "axios"
import SelectCustomerFormItem from "./SelectCustomerFormItem"
import MoneyInManualFormTable from "./MoneyInManualFormTable"
import PasteImage from "../../PasteImage"
import PreviewImage from "../../PreviewImage/PreviewImage"
import MoneyInManualContext from "../../../context/MoneyInManualContext"

function MoneyInManualForm() {
   const {
      form,
      dataSource,
      resetDataSource,
      setLoading,
      user,
      rateYenToBath,
   } = useContext(MoneyInManualContext)
   const [fileList, setFileList] = useState([])
   const fileInputRef = useRef(null)

   const resetFormData = () => {
      setFileList([])
      resetDataSource()
      form.resetFields()
      if (fileInputRef.current) {
         fileInputRef.current.value = ""
      }
   }

   const addMoneyInApi = async (body) => {
      try {
         return await axios.post("/api/for-accountant/money-in-manual", body)
      } catch (error) {
         console.error(error)
         throw error
      }
   }

   const uploadImageApi = async (images) => {
      try {
         const response = await axios.post("/api/upload", { images })
         return response?.data?.imageURL
      } catch (error) {
         console.error(error)
         message.error("อัพโหลดรูปภาพไม่สำเร็จ")
         throw error
      }
   }

   const uploadImage = async (fileListUpload) => {
      const images = await Promise.all(
         fileListUpload.map(async (curr) => {
            const src = await new Promise((resolve) => {
               const reader = new FileReader()
               reader.readAsDataURL(curr.originFileObj)
               reader.onload = () => resolve(reader.result)
            })
            const image = new Image()
            image.src = src
            return image.src
         })
      )
      try {
         return await uploadImageApi(images)
      } catch (error) {
         console.error(error)
         throw error
      }
   }

   const handleSubmitForm = async () => {
      setLoading(true)
      const body = {
         userId: user?.userId,
         moneyInItems: dataSource,
         imageSlipUrl: "",
         rateYenToBath,
      }
      try {
         if (!body?.userId) {
            return message.warning("กรุณาเลือกชื่อลูกค้า")
         }

         if (!body?.moneyInItems.length) {
            return message.warning(
               "กรุณาเลือกเพิ่มรายการเงินเข้าอย่างน้อยหนึ่งรายการ"
            )
         }
         if (body?.moneyInItems?.some((item) => !item.price || !item.channel)) {
            return message.warning("กรุณากรอกข้อมูลรายการเงินเข้าให้ครบถ้วน")
         }

         if (fileList.length > 0) {
            body.imageSlipUrl = await uploadImage(fileList)
         } else {
            return message.warning("กรุณาแนบใบเสร็จ")
         }
         const response = await addMoneyInApi(body)
         if (response?.data?.code === 200) {
            message.success("เพิ่มรายการเงินเข้าสำเร็จ")
            resetFormData()
         }
      } catch (error) {
         console.error(error)
         message.error("เพิ่มรายการเงินเข้าล้มเหลว")
      } finally {
         setLoading(false)
      }
   }

   const handleConfirmForm = () => {
      Modal.confirm({
         title: "ยืนยันการบันทึกรายการเงินเข้า",
         icon: <ExclamationCircleOutlined />,
         okText: "ตกลง",
         cancelText: "ยกเลิก",
         onOk() {
            handleSubmitForm()
         },
      })
   }

   const handlePasteImage = async (e) => {
      const items = e.clipboardData?.items
      if (!items) return

      const blob = Array.from(items)
         .filter((item) => item.type.indexOf("image") !== -1)
         .map((item) => item.getAsFile())[0]

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
                  status: "done",
               },
            ]
            setFileList(newFileList)
         }
      }
   }

   const handleChangeFileList = (event) => {
      setFileList(event.fileList)
      if (!event.fileList.length && fileInputRef.current) {
         fileInputRef.current.value = ""
      }
   }

   const onPreview = async (file) => {
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

   const renderFormUploadImage = () => (
      <div className="flex flex-col justify-between gap-2">
         <div className="flex flex-col gap-2">
            <PasteImage
               placeholder="Click to paste"
               handlePasteImage={handlePasteImage}
               width="300px"
               height="100px"
            />
            <label htmlFor="selectFileInputValue">
               <Button
                  className="w-full"
                  icon={<UploadOutlined />}
                  onClick={() => fileInputRef?.current.click()}
               >
                  Click to upload
               </Button>
               <input
                  type="file"
                  name="selectFileInputValue"
                  id="selectFileInputValue"
                  ref={fileInputRef}
                  accept="image/png, image/jpg, image/jpeg"
                  className="w-0 h-0"
                  onChange={(e) => {
                     if (e.target?.files) {
                        const file = e.target.files[0]
                        const newFileList = [
                           {
                              uid: `FileList-${Date.now()}`,
                              name: file.name,
                              type: file.type,
                              size: file.size,
                              originFileObj: file,
                              url: URL.createObjectURL(file),
                              status: "done",
                           },
                        ]
                        setFileList(newFileList)
                     }
                  }}
               />
               <p
                  className="mt-1 text-xs text-gray-500 dark:text-gray-300"
                  id="file_input_help"
               >
                  ACCEPT FILETYPE PNG, JPG, JPEG ONLY
               </p>
            </label>
         </div>
         {fileList.length ? <Divider /> : <></>}
         <Upload
            className="cursor-pointer"
            onPreview={onPreview}
            fileList={fileList}
            maxCount={1}
            listType="picture"
            onChange={handleChangeFileList}
         />
      </div>
   )

   const renderConfirmMoneyInManualFormBtn = () => (
      <div className="flex justify-end">
         <Button
            icon={<CheckCircleOutlined />}
            type="primary"
            htmlType="submit"
            onClick={handleConfirmForm}
         >
            ยืนยันรายการเงินเข้า
         </Button>
      </div>
   )

   return (
      <Form form={form}>
         <SelectCustomerFormItem />
         <Divider className="m-3" />
         <MoneyInManualFormTable />
         <div className="flex justify-end">
            <div className="flex gap-2 mb-3">
               <PreviewImage fileList={fileList} width={200} />
               <Divider type="vertical" className="h-auto" />
               {renderFormUploadImage()}
            </div>
         </div>

         {renderConfirmMoneyInManualFormBtn()}
      </Form>
   )
}

export default MoneyInManualForm
