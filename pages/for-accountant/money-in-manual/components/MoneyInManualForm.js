import {
   Form,
   Button,
   Divider,
   Upload,
   message,
   Modal,
   Image,
   Space,
} from "antd"
import SelectCustomerFormItem from "./SelectCustomerFormItem"
import {
   CheckCircleOutlined,
   ExclamationCircleOutlined,
   UploadOutlined,
} from "@ant-design/icons"
import MoneyInManualFormTable from "./MoneyInManualFormTable"
import PasteImage from "../../../../components/PasteImage"
import { Fragment, useContext, useRef, useState } from "react"
import axios from "axios"
import { MoneyInManualContext } from ".."

function MoneyInManualForm() {
   const { form, dataSource, resetDataSource, setLoading, user } =
      useContext(MoneyInManualContext)
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

   const handleSubmitForm = async () => {
      setLoading(true)
      let body = {
         userId: user?.userId,
         moneyInItems: dataSource,
         imageSlipUrl: "",
      }
      try {
         if (!body?.userId) {
            return message.warning("กรุณาเลือกชื่อลูกค้า")
         }

         if (!body?.moneyInItems.length) {
            return message.warning(
               "กรุณาเลือกเพิ่มรายการเงินเข้าอย่างน้อยหนึ่งรายการ"
            )
         } else if (
            body?.moneyInItems?.some((item) => !item.price || !item.channel)
         ) {
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

   const addMoneyInApi = async (body) => {
      try {
         return await axios.post("/api/for-accountant/money-in-manual", body)
      } catch (error) {
         console.error(error)
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

   const renderFormUploadImage = () => {
      return (
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
   }

   const renderConfirmMoneyInManualFormBtn = () => {
      return (
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
   }

   return (
      <Form form={form}>
         <SelectCustomerFormItem />
         <Divider className="m-3" />
         <MoneyInManualFormTable />
         <div className="flex justify-end">
            <div className="flex gap-2 mb-3">
               <Image
                  width={200}
                  preview={fileList && fileList[0]?.url ? true : false}
                  src={fileList && fileList[0]?.url ? fileList[0]?.url : ''}
                  fallback="data:image/png;base64,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"
               />
               <Divider type="vertical" className="h-auto" />
               {renderFormUploadImage()}
            </div>
         </div>

         {renderConfirmMoneyInManualFormBtn()}
      </Form>
   )
}

export default MoneyInManualForm
