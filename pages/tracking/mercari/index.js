/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
import Resizer from 'react-image-file-resizer'
import {
   AppstoreAddOutlined,
   DownOutlined,
   EyeFilled,
   SearchOutlined,
} from "@ant-design/icons"

import {
   Button,
   DatePicker,
   Modal,
   Switch,
   Table,
   Input,
   InputNumber,
   Select,
   Space,
   Dropdown,
   Upload,
   message,
} from "antd"
import Highlighter from "react-highlight-words"
import { getSession } from "next-auth/react"
import React, { Fragment, useState, useRef, useEffect } from "react"
import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
import customParseFormat from "dayjs/plugin/customParseFormat"
import Link from "next/link"
import axios from "axios"
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"
import { addForm_model, trackingForm_model } from "../../../model/tracking"
import genDate from "../../../utils/genDate"
import sortDate from "../../../utils/sortDate"
import PasteImage from "../../../components/PasteImage"
import EditTrackingSlipImageModal from "../../../components/Modal/EditTrackingSlipImageModal"
import SelectPaidChannel from "../../../components/Select/SelectChannelPaid"
import EditImageModal from "../../../components/EditImageModal/EditImageModal"
import LoadingPage from "../../../components/LoadingPage"

const { TextArea } = Input
dayjs.extend(customParseFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)

function MercariTrackingsPage() {
   const [users, setUsers] = useState([])
   const [data, setData] = useState([])
   const [addForm, setAddForm] = useState(addForm_model)
   const [InputDate, setInputDate] = useState(null)
   const [InputVoyageDate, setInputVoyageDate] = useState(null)
   const [showAddModal, setShowAddModal] = useState(false)
   const [selectedRow, setSelectedRow] = useState(trackingForm_model)
   const [showEditModal, setshowEditModal] = useState(false)
   const [showImagesModal, setShowImagesModal] = useState(false)
   const [fileList, setFileList] = useState([])
   const [trackingId, setTrackingId] = useState("")
   const [searchText, setSearchText] = useState("")
   const [searchedColumn, setSearchedColumn] = useState("")
   const [tricker, setTricker] = useState(false)
   const searchInput = useRef(null)
   const [openEditSlipModal, setOpenEditSlipModal] = useState(false)
   const [viewMode, setViewMode] = useState(false)
   const [loading, setLoading] = useState(false)
   const handleChangeAccountCheck = async (status, id) => {
      setLoading(true)
      try {
         const response = await fetch(`/api/tracking/mercari?id=${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ accountCheck: status ? 0 : 1 }),
         })
         const responseJson = await response.json()
         setData(responseJson.trackings)
         message.success("success!")
      } catch (err) {
         console.log(err)
         message.error("fail!")
      } finally {
         setLoading(false)
      }
   }
   const handleChangeReceived = async (status, id) => {
      setLoading(true)
      try {
         const response = await fetch(`/api/tracking/mercari?id=${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ received: status ? 0 : 1 }),
         })
         const responseJson = await response.json()
         setData(responseJson.trackings)
         message.success("success!")
      } catch (err) {
         console.log(err)
         message.error("fail!")
      } finally {
         setLoading(false)
      }
   }
   const handleChangeMnyInCheck = async (status, id) => {
      setLoading(true)
      try {
         const response = await fetch(`/api/tracking/mercari?id=${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ mnyInCheck: status ? 0 : 1 }),
         })
         const responseJson = await response.json()
         setData(responseJson.trackings)
         message.success("success!")
      } catch (err) {
         console.log(err)
         message.error("fail!")
      } finally {
         setLoading(false)
      }
   }
   const handleChangeMnyOutCheck = async (status, id) => {
      setLoading(true)
      try {
         const response = await fetch(`/api/tracking/mercari?id=${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ mnyOutCheck: status ? 0 : 1 }),
         })
         const responseJson = await response.json()
         setData(responseJson.trackings)
         message.success("success!")
      } catch (err) {
         console.log(err)
         message.error("fail!")
      }finally {
         setLoading(false)
      }
   }
   const handleChangeCancelRefundCheck = async (status, id) => {
      setLoading(true)
      try {
         const response = await fetch(`/api/tracking/mercari?id=${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ cancelRefundCheck: status ? 0 : 1 }),
         })
         const responseJson = await response.json()
         setData(responseJson.trackings)
         message.success("success!")
      } catch (err) {
         console.log(err)
         message.error("fail!")
      } finally {
         setLoading(false)
      }
   }
   const handleChangeFinished = async (status, id) => {
      setLoading(true)
      try {
         const response = await fetch(`/api/tracking/mercari?id=${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ finished: status ? 0 : 1 }),
         })
         const responseJson = await response.json()
         setData(responseJson.trackings)
         message.success("success!")
      } catch (err) {
         console.log(err)
         message.error("fail!")
      } finally {
         setLoading(false)
      }
   }
   const toBase64 = (file) =>
      new Promise((resolve, reject) => {
         const reader = new window.FileReader()
         reader.readAsDataURL(file)
         reader.onload = () => resolve(reader.result)
         reader.onerror = (error) => reject(error)
      })
   const handlePasteImage = async (e) => {
      setLoading(true)
      const file = e.clipboardData.files[0]

      const image = await toBase64(file)
      try {
         const response = await fetch(`/api/tracking/images?id=${trackingId}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ image }),
         })
         const responseJson = await response.json()
         const { tracking_image } = responseJson
         const new_tracking_image = tracking_image.reduce(
            (accumulator, currentValue, index) => [
               ...accumulator,
               {
                  uid: index,
                  name: `image${index}.png`,
                  status: "done",
                  url: currentValue.image,
                  id: currentValue.id,
               },
            ],
            []
         )
         setFileList(new_tracking_image)
         message.success("add image success!")
      } catch (err) {
         console.log(err)
         message.error("add image fail")
      } finally {
         setLoading(false)
      }
   }
   // const handleOkUploadImages = async () => {
   //    setLoading(true)
   //    try {
   //       const doneImage =
   //          fileList.map((file, index) => ({
   //             id: index,
   //             name: file.name,
   //             status: file.status,
   //             uid: file.uid,
   //             url: file.url ? file.url : file.thumbUrl,
   //          })) || []
   //       await fetch(`/api/tracking/images?tracking_id=${trackingId}`, {
   //          method: "PATCH",
   //          headers: { "Content-Type": "application/json" },
   //          body: JSON.stringify({ doneImage }),
   //       })
   //       message.success("เพิ่มรูปภาพสำเร็จ!")
   //       setTricker(true)
   //       setShowImagesModal(false)
   //    } catch (err) {
   //       console.log(err)
   //       message.error("เพิ่มรูปภาพผิดพลาด!")
   //    }finally {
   //       setLoading(false)
   //    }
   // }
   const handleOkUploadImages = async () => {
      console.log("handleOkUploadImages...")
      setLoading(true)
      try {
          const resizedFilesPromises = fileList.map((file) => {
              return new Promise((resolve, reject) => {
                  Resizer.imageFileResizer(
                      file.originFileObj,
                      1920, // Max width
                      1920, // Max height
                      'JPEG', // Output format (JPEG, PNG, WEBP)
                      10, // Image quality (0-100)
                      0, // Rotation (0 = no rotation)
                      (uri) => {
                          const resizedFile = new File([uri], file.name, { type: file.type })
                          resolve(resizedFile)
                      },
                      'blob' // Output type (blob, base64)
                  )
              })
          })
  
          const resizedFiles = await Promise.all(resizedFilesPromises)
  
          const doneImage = resizedFiles.map((file, index) => ({
              id: index,
              name: file.name,
              status: "done",
              uid: `resized-${index}`,
              url: URL.createObjectURL(file),
          }))
  
          await fetch(`/api/tracking/images?tracking_id=${trackingId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ doneImage }),
          })
  
          message.success("เพิ่มรูปภาพสำเร็จ!")
          setTricker(true)
          setShowImagesModal(false)
      } catch (err) {
          console.error(err)
          message.error("เพิ่มรูปภาพผิดพลาด!")
      } finally {
          setLoading(false)
      }
  }
   const onChange = ({ fileList: newFileList }) => {
      setFileList(newFileList)
   }
   const onPreview = async (file) => {
      let src = file.url
      console.log("src", src)
      if (!src) {
         src = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.readAsDataURL(file.originFileObj)
            reader.onload = () => resolve(reader.result)
         })
      }
      const image = new Image(300)
      image.src = src
      const imgWindow = window.open(src)
      imgWindow?.document.write(image.outerHTML)
   }
   const handleCancelImagesModal = () => {
      setShowImagesModal(false)
   }
   const handleCancelEditModal = () => {
      setshowEditModal(false)
   }
   const handleOkEditModal = async () => {
      setLoading(true)
      const body = {
         date: selectedRow.date,
         user_id: selectedRow.user_id,
         link: selectedRow.link,
         box_no: selectedRow.box_no,
         track_no: selectedRow.track_no,
         weight: selectedRow.weight,
         price: selectedRow.price,
         voyage: selectedRow.voyage,
         received: selectedRow.received,
         finished: selectedRow.finished,
         remark_user: selectedRow.remark_user,
         remark_admin: selectedRow.remark_admin,
      }
      try {
         const response = await fetch(
            `/api/tracking/mercari?id=${selectedRow.id}`,
            {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(body),
            }
         )
         const responseJson = await response.json()
         setData(responseJson.trackings)
         setAddForm(addForm_model)
         setInputDate(null)
         setInputVoyageDate(null)
         message.success("แก้ไขข้อมูลสำเร็จ!")
         setshowEditModal(false)
      } catch (err) {
         console.log(err)
         message.error("แก้ไขข้อมูลผิดพลาด!")
      } finally {
         setLoading(false)
      }
   }
   const handleShowEditModal = (id) => {
      const temp = data.filter((ft) => ft.id === id)
      const tracking = temp[0]
      setInputDate(
         tracking.date === "" ? null : dayjs(tracking.date, "D/M/YYYY")
      )
      setInputVoyageDate(
         tracking.voyage === "" ? null : dayjs(tracking.voyage, "D/M/YYYY")
      )
      setSelectedRow(tracking)
      setshowEditModal(true)
   }

   const handleChangeAirBilling = async (status, id) => {
      setLoading(true)
      try {
         const response = await fetch(`/api/tracking/mercari?id=${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ airbilling: status ? 0 : 1 }),
         })
         const responseJson = await response.json()
         setData(responseJson.trackings)
         message.success("success!")
      } catch (err) {
         console.log(err)
         message.error("fail!")
      } finally {
         setLoading(false)
      }
   }
   const handleCancelAddModal = () => {
      setShowAddModal(false)
   }
   const handleOpenAddModal = () => {
      setShowAddModal(true)
   }
   const handleOkAddModal = async () => {
      if (addForm.user_id === "") {
         alert("please select user before add tracking!")
         message.warning("เลือกลูกค้าก่อนทำการเพิ่มข้อมูล!")
         return
      }
      setLoading(true)
      const body = {
         date: addForm.date,
         user_id: addForm.user_id,
         link: addForm.link,
         box_no: addForm.box_no,
         track_no: addForm.track_no,
         weight: addForm.weight,
         price: addForm.price,
         voyage: addForm.voyage,
         received: 0,
         finished: 0,
         remark_user: addForm.remark_user,
         remark_admin: addForm.remark_admin,
         channel: addForm.channel,
      }
      try {
         const response = await fetch("/api/tracking/mercari", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
         })
         const responseJson = await response.json()
         setData(responseJson.trackings)
         setAddForm(addForm_model)
         setInputDate(null)
         setInputVoyageDate(null)
         message.success("เพิ่มข้อมูลสำเร็จ!")
         setShowAddModal(false)
      } catch (err) {
         message.error("เพิ่มข้อมูลผิดพลาด!")
         console.log(err)
      } finally {
         setLoading(false)
      }
   }

   const handleDeleteRow = async (id) => {
      if (!window.confirm("คุณแน่ใจที่จะลบใช่หรือไม่")) {
         return
      }
      setLoading(true)
      try {
         const response = await fetch(`/api/tracking/mercari?id=${id}`, {
            method: "DELETE",
         })
         const responseJson = await response.json()
         setData(responseJson.trackings)
         message.success("ลบข้อมูลเรียบร้อย!")
      } catch (err) {
         console.log(err)
         message.error("ลบข้อมูลผิดพลาด!")
      } finally {
         setLoading(false)
      }
   }

   const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm()
      setSearchText(selectedKeys[0])
      setSearchedColumn(dataIndex)
   }
   const handleReset = (clearFilters) => {
      clearFilters()
      setSearchText("")
   }
   const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({
         setSelectedKeys,
         selectedKeys,
         confirm,
         clearFilters,
         close,
      }) => (
         <div className="p-[8px]" onKeyDown={(e) => e.stopPropagation()}>
            <Input
               ref={searchInput}
               placeholder={`Search ${dataIndex}`}
               value={selectedKeys[0]}
               onChange={(e) =>
                  setSelectedKeys(e.target.value ? [e.target.value] : [])
               }
               onPressEnter={() =>
                  handleSearch(selectedKeys, confirm, dataIndex)
               }
               className="mb-[8px] block"
            />
            <Space>
               <Button
                  type="primary"
                  onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{
                     width: 90,
                  }}
               >
                  Search
               </Button>
               <Button
                  onClick={() => clearFilters && handleReset(clearFilters)}
                  size="small"
                  style={{
                     width: 90,
                  }}
               >
                  Reset
               </Button>
               <Button
                  type="link"
                  size="small"
                  onClick={() => {
                     confirm({
                        closeDropdown: false,
                     })
                     setSearchText(selectedKeys[0])
                     setSearchedColumn(dataIndex)
                  }}
               >
                  Filter
               </Button>
               <Button
                  type="link"
                  size="small"
                  onClick={() => {
                     close()
                  }}
               >
                  close
               </Button>
            </Space>
         </div>
      ),
      filterIcon: (filtered) => (
         <SearchOutlined
            style={{
               color: filtered ? "#1890ff" : undefined,
            }}
         />
      ),
      onFilter: (value, record) => {
         if (record[dataIndex] === null) {
            return false
         }
         return record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
      },
      onFilterDropdownOpenChange: (visible) => {
         if (visible) {
            setTimeout(() => searchInput.current?.select(), 100)
         }
      },
      render: (text) =>
         // eslint-disable-next-line no-nested-ternary
         searchedColumn === dataIndex ? (
            <Highlighter
               highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
               }}
               searchWords={[searchText]}
               autoEscape
               textToHighlight={text ? text.toString() : ""}
            />
         ) : text === "" || text === null ? (
            "-"
         ) : (
            text
         ),
   })
   const handleSearchDate = (selectedKeys, confirm) => {
      confirm()
   }
   const handleResetDate = (clearFilters) => {
      clearFilters()
   }
   const getColumnDateProps = () => ({
      filterDropdown: ({
         setSelectedKeys,
         selectedKeys,
         confirm,
         clearFilters,
         close,
      }) => (
         <div className="p-[8px]" onKeyDown={(e) => e.stopPropagation()}>
            <Space direction="vertical">
               <Space>
                  <DatePicker
                     defaultValue={null}
                     value={selectedKeys[0]}
                     format="D/M/YYYY"
                     onChange={(value) => {
                        if (value === null) {
                           setSelectedKeys([])
                        } else {
                           setSelectedKeys([value])
                        }
                     }}
                     style={{ width: 300 }}
                  />
               </Space>
               <Space>
                  <Button
                     type="primary"
                     onClick={() => handleSearchDate(selectedKeys, confirm)}
                     icon={<SearchOutlined />}
                     size="small"
                     style={{
                        width: 90,
                     }}
                  >
                     Search
                  </Button>
                  <Button
                     onClick={() =>
                        clearFilters && handleResetDate(clearFilters)
                     }
                     size="small"
                     style={{
                        width: 90,
                     }}
                  >
                     Reset
                  </Button>
                  <Button
                     type="link"
                     size="small"
                     onClick={() => {
                        confirm({
                           closeDropdown: false,
                        })
                     }}
                  >
                     Filter
                  </Button>
                  <Button
                     type="link"
                     size="small"
                     onClick={() => {
                        close()
                     }}
                  >
                     close
                  </Button>
               </Space>
            </Space>
         </div>
      ),
      filterIcon: (filtered) => (
         <SearchOutlined
            style={{
               color: filtered ? "#1890ff" : undefined,
            }}
         />
      ),
      onFilter: (value, record) => {
         if (record.voyage === null) {
            return false
         }
         return record.voyage === genDate(value).split(" ")[0]
      },
      render: (text) =>
         // eslint-disable-next-line no-nested-ternary
         text === "" || text === null ? "-" : text,
   })
   async function handleSelectPaidChannel(id, paidChannel) {
      // console.log(id, paidChannel)
      try {
         const response = await axios.put(`/api/paid-channel/${id}`, {
            tracking_id: id,
            paid_channel: paidChannel,
         })
         const responseData = response.data
         console.log(responseData)
         setData((prev) => {
            const index = prev.findIndex((fi) => fi.id === id)
            return [
               ...prev.slice(0, index),
               {
                  ...prev[index],
                  paid_channel: responseData.paid_channel,
               },
               ...prev.slice(index + 1),
            ]
         })
      } catch (err) {
         console.log(err)
      }
   }
   const columns = [
      {
         title: "วันที่",
         dataIndex: "date",
         width: "120px",
         key: "date",
         sorter: (a, b) => sortDate(a.date, b.date),
         ...getColumnSearchProps("date"),
      },
      {
         title: "รูปภาพ",
         dataIndex: "id",
         width: "120px",
         key: "id",
         render: (id, item) => (
            <EditImageModal
               tracking={item}
               images={item.images}
               setTrigger={setTricker}
            />
         ),
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         width: "120px",
         key: "username",
         ...getColumnSearchProps("username"),
      },
      {
         title: "URL",
         dataIndex: "link",
         key: "link",
         width: 150,
         render: (text) =>
            text !== null && text !== "" ? (
               <Link href={text} target="_blank" rel="noopener">
                  <div style={{ display: "inline-block" }}>
                     {text.split("/").slice(-1)}
                  </div>
               </Link>
            ) : (
               "-"
            ),
      },
      {
         title: "Cargo",
         dataIndex: "airbilling",
         key: "airbilling",
         width: 80,
         render: (ck, item) =>
            ck ? (
               <Switch
                  checked={ck}
                  onChange={() => handleChangeAirBilling(ck, item.id)}
               />
            ) : (
               <Switch
                  checked={ck}
                  onChange={() => handleChangeAirBilling(ck, item.id)}
               />
            ),
      },
      {
         title: "รับของ",
         dataIndex: "received",
         key: "received",
         filters: [
            {
               text: "รับของแล้ว",
               value: 1,
            },
            {
               text: "รอรับของ",
               value: 0,
            },
         ],
         width: 120,
         onFilter: (value, record) => record.received === value,
         render: (received, record) =>
            received ? (
               <Space direction="vertical">
                  <span style={{ color: "green" }}>รับของแล้ว</span>
                  <Switch
                     checked={received}
                     onClick={() => handleChangeReceived(received, record.id)}
                  />
               </Space>
            ) : (
               <Space direction="vertical">
                  <span style={{ color: "red" }}>รอรับของ</span>
                  <Switch
                     checked={received}
                     onClick={() => handleChangeReceived(received, record.id)}
                  />
               </Space>
            ),
      },
      {
         title: "done",
         dataIndex: "finished",
         key: "finished",
         filters: [
            {
               text: "done",
               value: 1,
            },
            {
               text: "not done",
               value: 0,
            },
         ],
         width: 120,
         onFilter: (value, record) => record.finished === value,
         render: (finished, record) =>
            finished ? (
               <Space direction="vertical">
                  <span style={{ color: "green" }}>done</span>
                  <Switch
                     checked={finished}
                     onClick={() => handleChangeFinished(finished, record.id)}
                  />
               </Space>
            ) : (
               <Space direction="vertical">
                  <span style={{ color: "red" }}>not done</span>
                  <Switch
                     checked={finished}
                     onClick={() => handleChangeFinished(finished, record.id)}
                  />
               </Space>
            ),
      },
      {
         title: "บัญชี",
         dataIndex: "account_check",
         key: "accountCheck",
         filters: [
            {
               text: "check",
               value: 1,
            },
            {
               text: "not check",
               value: 0,
            },
         ],
         width: 120,
         onFilter: (value, record) => record.account_check === value,
         render: (accountCheck, record) =>
            accountCheck ? (
               <Space direction="vertical">
                  <span style={{ color: "green" }}>check</span>
                  <Switch
                     checked={accountCheck}
                     onClick={() => handleChangeAccountCheck(accountCheck, record.id)}
                  />
               </Space>
            ) : (
               <Space direction="vertical">
                  <span style={{ color: "red" }}>not check</span>
                  <Switch
                     checked={accountCheck}
                     onClick={() => handleChangeAccountCheck(accountCheck, record.id)}
                  />
               </Space>
            ),
      },
      // {
      //    title: "slip",
      //    dataIndex: "tracking_slip_image",
      //    width: "120px",
      //    key: "tracking_slip_image",
      //    render: (image, item) => {
      //       if (image) {
      //          return (
      //             <img
      //                src={image}
      //                alt=""
      //                className="w-[100px] h-[100px] object-cover object-center cursor-pointer hover:opacity-50"
      //                onClick={() => {
      //                   setSelectedRow(item)
      //                   setOpenEditSlipModal(true)
      //                }}
      //             />
      //          )
      //       }
      //       return (
      //          <Button
      //             onClick={() => {
      //                setSelectedRow(item)
      //                setOpenEditSlipModal(true)
      //             }}
      //          >
      //             Add Slip
      //          </Button>
      //       )
      //    },
      // },
      {
         title: "ช่องทางจ่ายออก",
         dataIndex: "paid_channel",
         key: "paid_channel",
         width: 100,
         render: (paid_channel, item) => (
            <SelectPaidChannel
               // eslint-disable-next-line react/jsx-no-bind
               onOk={handleSelectPaidChannel}
               defaultValue={paid_channel}
               id={item.id}
            />
         ),
      },
      {
         title: "เลขแทรกกิงค์",
         dataIndex: "track_no",
         key: "track_no",
         width: 150,
         ...getColumnSearchProps("track_no"),
      },
      {
         title: "เลขกล่อง",
         dataIndex: "box_no",
         key: "box_no",
         width: 100,
         ...getColumnSearchProps("box_no"),
      },
      {
         title: "น้ำหนัก",
         dataIndex: "weight",
         key: "weight",
         width: 80,
         render: (text) => (text === null ? "-" : `${text} Kg.`),
      },
      {
         title: "ราคา",
         dataIndex: "price",
         key: "price",
         width: 120,
         render: (text) =>
            text === null
               ? "-"
               : new Intl.NumberFormat("ja-JP", {
                    currency: "JPY",
                    style: "currency",
                 }).format(text),
      },
      {
         title: "รอบเรือ",
         dataIndex: "voyage",
         key: "voyage",
         width: 120,
         ...getColumnDateProps(),
      },
      {
         title: "หมายเหตุ",
         dataIndex: "remark_admin",
         key: "remark_admin",
         render: (text) => (text === null || text === "" ? "-" : text),
      },
      {
         title: "จัดการ",
         dataIndex: "id",
         key: "manage",
         width: "90px",
         fixed: "right",
         render: (id) => {
            const items = [
               {
                  key: "1",
                  label: "แก้ไข",
                  onClick: () => handleShowEditModal(id),
               },
               {
                  key: "2",
                  label: "ลบ",
                  onClick: () => handleDeleteRow(id),
               },
            ]
            return (
               <Space>
                  <Dropdown menu={{ items }}>
                     <span className="cursor-pointer">
                        จัดการ <DownOutlined />
                     </span>
                  </Dropdown>
               </Space>
            )
         },
      },
   ]
   const columnsViewMode = [
      {
         title: "วันที่",
         dataIndex: "date",
         width: "200px",
         key: "date",
         sorter: (a, b) => sortDate(a.date, b.date),
         ...getColumnSearchProps("date"),
      },
      {
         title: "รูปภาพ",
         dataIndex: "id",
         width: "200px",
         key: "id",
         render: (id, item) => (
            <EditImageModal
               tracking={item}
               images={item.images}
               setTrigger={setTricker}
            />
         ),
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         width: "200px",
         key: "username",
         ...getColumnSearchProps("username"),
      },
      // {
      //    title: "URL",
      //    dataIndex: "link",
      //    key: "link",
      //    width: 150,
      //    render: (text) =>
      //       text !== null && text !== "" ? (
      //          <Link href={text} target="_blank" rel="noopener">
      //             <div style={{ display: "inline-block" }}>
      //                {text.split("/").slice(-1)}
      //             </div>
      //          </Link>
      //       ) : (
      //          "-"
      //       ),
      // },
      // {
      //    title: "Cargo",
      //    dataIndex: "airbilling",
      //    key: "airbilling",
      //    width: 80,
      //    render: (ck, item) =>
      //       ck ? (
      //          <Switch
      //             checked={ck}
      //             onChange={() => handleChangeAirBilling(ck, item.id)}
      //          />
      //       ) : (
      //          <Switch
      //             checked={ck}
      //             onChange={() => handleChangeAirBilling(ck, item.id)}
      //          />
      //       ),
      // },
      // {
      //    title: "รับของ",
      //    dataIndex: "received",
      //    key: "received",
      //    filters: [
      //       {
      //          text: "รับของแล้ว",
      //          value: 1,
      //       },
      //       {
      //          text: "รอรับของ",
      //          value: 0,
      //       },
      //    ],
      //    width: 120,
      //    onFilter: (value, record) => record.received === value,
      //    render: (received, record) =>
      //       received ? (
      //          <Space direction="vertical">
      //             <span style={{ color: "green" }}>รับของแล้ว</span>
      //             <Switch
      //                checked={received}
      //                onClick={() => handleChangeReceived(received, record.id)}
      //             />
      //          </Space>
      //       ) : (
      //          <Space direction="vertical">
      //             <span style={{ color: "red" }}>รอรับของ</span>
      //             <Switch
      //                checked={received}
      //                onClick={() => handleChangeReceived(received, record.id)}
      //             />
      //          </Space>
      //       ),
      // },
      // {
      //    title: "done",
      //    dataIndex: "finished",
      //    key: "finished",
      //    filters: [
      //       {
      //          text: "done",
      //          value: 1,
      //       },
      //       {
      //          text: "not done",
      //          value: 0,
      //       },
      //    ],
      //    width: 120,
      //    onFilter: (value, record) => record.finished === value,
      //    render: (finished, record) =>
      //       finished ? (
      //          <Space direction="vertical">
      //             <span style={{ color: "green" }}>done</span>
      //             <Switch
      //                checked={finished}
      //                onClick={() => handleChangeFinished(finished, record.id)}
      //             />
      //          </Space>
      //       ) : (
      //          <Space direction="vertical">
      //             <span style={{ color: "red" }}>not done</span>
      //             <Switch
      //                checked={finished}
      //                onClick={() => handleChangeFinished(finished, record.id)}
      //             />
      //          </Space>
      //       ),
      // },
      {
         title: "บัญชี",
         dataIndex: "account_check",
         key: "accountCheck",
         filters: [
            {
               text: "check",
               value: 1,
            },
            {
               text: "not check",
               value: 0,
            },
         ],
         width: 120,
         onFilter: (value, record) => record.account_check === value,
         render: (accountCheck, record) =>
            accountCheck ? (
               <Space direction="vertical">
                  <span style={{ color: "green" }}>check</span>
                  <Switch
                     disabled
                     checked={accountCheck}
                     onClick={() => handleChangeAccountCheck(accountCheck, record.id)}
                  />
               </Space>
            ) : (
               <Space direction="vertical">
                  <span style={{ color: "red" }}>not check</span>
                  <Switch
                     disabled
                     checked={accountCheck}
                     onClick={() => handleChangeAccountCheck(accountCheck, record.id)}
                  />
               </Space>
            ),
      },
      // {
      //    title: "slip",
      //    dataIndex: "tracking_slip_image",
      //    width: "120px",
      //    key: "tracking_slip_image",
      //    render: (image, item) => {
      //       if (image) {
      //          return (
      //             <img
      //                src={image}
      //                alt=""
      //                className="w-[100px] h-[100px] object-cover object-center cursor-pointer hover:opacity-50"
      //                onClick={() => {
      //                   setSelectedRow(item)
      //                   setOpenEditSlipModal(true)
      //                }}
      //             />
      //          )
      //       }
      //       return (
      //          <Button
      //             onClick={() => {
      //                setSelectedRow(item)
      //                setOpenEditSlipModal(true)
      //             }}
      //          >
      //             Add Slip
      //          </Button>
      //       )
      //    },
      // },
      {
         title: "ช่องทางจ่ายออก",
         dataIndex: "paid_channel",
         key: "paid_channel",
         render: (paid_channel, item) => (
            <SelectPaidChannel
               disabled
               // eslint-disable-next-line react/jsx-no-bind
               onOk={handleSelectPaidChannel}
               defaultValue={paid_channel}
               id={item.id}
            />
         ),
      },
      // {
      //    title: "เลขแทรกกิงค์",
      //    dataIndex: "track_no",
      //    key: "track_no",
      //    width: 150,
      //    ...getColumnSearchProps("track_no"),
      // },
      // {
      //    title: "เลขกล่อง",
      //    dataIndex: "box_no",
      //    key: "box_no",
      //    width: 100,
      //    ...getColumnSearchProps("box_no"),
      // },
      // {
      //    title: "น้ำหนัก",
      //    dataIndex: "weight",
      //    key: "weight",
      //    width: 80,
      //    render: (text) => (text === null ? "-" : `${text} Kg.`),
      // },
      {
         title: "เช็คเงินออก",
         dataIndex: "mny_out_check",
         key: "mny_out_check",
         filters: [
            {
               text: "รับของแล้ว",
               value: 1,
            },
            {
               text: "รอรับของ",
               value: 0,
            },
         ],
         width: 120,
         onFilter: (value, record) => record.mny_out_check === value,
         render: (value, record) =>
            value ? (
               <Space direction="vertical">
                  <Switch
                     checked={value}
                     onClick={() => handleChangeMnyOutCheck(value, record.id)}
                  />
               </Space>
            ) : (
               <Space direction="vertical">
                  <Switch
                     checked={value}
                     onClick={() => handleChangeMnyOutCheck(value, record.id)}
                  />
               </Space>
            ),
      },
      {
         title: "ราคา",
         dataIndex: "price",
         key: "price",
         width: 120,
         render: (text) =>
            text === null
               ? "-"
               : new Intl.NumberFormat("ja-JP", {
                    currency: "JPY",
                    style: "currency",
                 }).format(text),
      },
      {
         title: "เช็คเงินเช้า",
         dataIndex: "mny_in_check",
         key: "mny_in_check",
         filters: [
            {
               text: "รับของแล้ว",
               value: 1,
            },
            {
               text: "รอรับของ",
               value: 0,
            },
         ],
         width: 120,
         onFilter: (value, record) => record.mny_in_check === value,
         render: (value, record) =>
            value ? (
               <Space direction="vertical">
                  <Switch
                     checked={value}
                     onClick={() => handleChangeMnyInCheck(value, record.id)}
                  />
               </Space>
            ) : (
               <Space direction="vertical">
                  <Switch
                     checked={value}
                     onClick={() => handleChangeMnyInCheck(value, record.id)}
                  />
               </Space>
            ),
      },
      {
         title: "ยกเลิก/refund",
         dataIndex: "cancel_refund_check",
         key: "cancel_refund_check",
         filters: [
            {
               text: "รับของแล้ว",
               value: 1,
            },
            {
               text: "รอรับของ",
               value: 0,
            },
         ],
         width: 120,
         onFilter: (value, record) => record.cancel_refund_check === value,
         render: (value, record) =>
            value ? (
               <Space direction="vertical">
                  <Switch
                     checked={value}
                     onClick={() => handleChangeCancelRefundCheck(value, record.id)}
                  />
               </Space>
            ) : (
               <Space direction="vertical">
                  <Switch
                     checked={value}
                     onClick={() => handleChangeCancelRefundCheck(value, record.id)}
                  />
               </Space>
            ),
      },
      // {
      //    title: "รอบเรือ",
      //    dataIndex: "voyage",
      //    key: "voyage",
      //    width: 120,
      //    ...getColumnDateProps(),
      // },
      // {
      //    title: "หมายเหตุ",
      //    dataIndex: "remark_admin",
      //    key: "remark_admin",
      //    render: (text) => (text === null || text === "" ? "-" : text),
      // },
      // {
      //    title: "จัดการ",
      //    dataIndex: "id",
      //    key: "manage",
      //    width: "90px",
      //    fixed: "right",
      //    render: (id) => {
      //       const items = [
      //          {
      //             key: "1",
      //             label: "แก้ไข",
      //             onClick: () => handleShowEditModal(id),
      //          },
      //          {
      //             key: "2",
      //             label: "ลบ",
      //             onClick: () => handleDeleteRow(id),
      //          },
      //       ]
      //       return (
      //          <Space>
      //             <Dropdown menu={{ items }}>
      //                <span className="cursor-pointer">
      //                   จัดการ <DownOutlined />
      //                </span>
      //             </Dropdown>
      //          </Space>
      //       )
      //    },
      // },
   ]
   useEffect(() => {
      ;(async () => {
         const response = await fetch("/api/user")
         const responseJson = await response.json()
         setUsers(responseJson.users)
      })()
   }, [])
   useEffect(() => {
      ;(async () => {
         setLoading(true)
         try {
            const response = await fetch("/api/tracking/mercari")
            const responseJson = await response.json()
            setData(responseJson.trackings)
         } catch(error) {
            console.log(error)
         } finally {
            setLoading(false)
         }
      })()
   }, [tricker])

   return (
      <Fragment>
         <LoadingPage loading={loading} />
         <CardHead name="Mercari Trackings Page" />
         <div className="m-[10px] p-[10px] bg-white">
            <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
               <Button
                  icon={<AppstoreAddOutlined />}
                  onClick={handleOpenAddModal}
               >
                  เพิ่มรายการ
               </Button>
               <Button icon={<EyeFilled/>} type={viewMode ? "primary" : "default"} onClick={() => setViewMode(prev => !prev)}>view mode</Button>
            </div>
            <Table
               dataSource={data}
               columns={viewMode ? columnsViewMode : columns}
               scroll={viewMode ? {
                  x: 1000,
                  y: 700,
               } : {
                  x: 2000,
                  y: 700,
               }}
            />
         </div>
         <Modal
            title="เพิ่มรายการ Mercari"
            open={showAddModal}
            onCancel={handleCancelAddModal}
            onOk={handleOkAddModal}
         >
            <Space className="mx-auto my-auto">
               <label>ชื่อลูกค้า: </label>
               <Select
                  value={addForm.user_id}
                  onChange={(value) =>
                     setAddForm({ ...addForm, user_id: value })
                  }
                  showSearch
                  style={{ width: 200 }}
                  placeholder="เลือกลูกค้า"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                     (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                     (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={users?.reduce((accumulator, currentValue) => {
                     const { id, username } = currentValue
                     return [
                        ...accumulator,
                        {
                           value: id,
                           label: username,
                        },
                     ]
                  }, [])}
               />
            </Space>
            {addForm.user_id !== "" && (
               <>
                  <Space style={{ marginLeft: 8 }}>
                     <label>วันที่: </label>
                     <DatePicker
                        defaultValue={null}
                        value={InputDate}
                        format="D/M/YYYY"
                        onChange={(value) => {
                           if (value === null) {
                              setAddForm((prev) => ({
                                 ...prev,
                                 date: null,
                              }))
                              setInputDate(null)
                           } else {
                              setAddForm((prev) => ({
                                 ...prev,
                                 date: genDate(value),
                              }))
                              setInputDate(value)
                           }
                        }}
                     />
                  </Space>
                  <Space className="mb-[10px]">
                     <label>URL: </label>
                     <Input
                        value={addForm.link}
                        onChange={(e) =>
                           setAddForm({
                              ...addForm,
                              link: e.target.value,
                           })
                        }
                     />
                  </Space>
                  <Space className="mb-[10px]">
                     <label>เลขแทรกกิงค์: </label>
                     <Input
                        value={addForm.track_no}
                        onChange={(e) =>
                           setAddForm({
                              ...addForm,
                              track_no: e.target.value,
                           })
                        }
                     />
                  </Space>
                  <Space className="mb-[10px]">
                     <label>เลขกล่อง: </label>
                     <Input
                        value={addForm.box_no}
                        onChange={(e) =>
                           setAddForm({
                              ...addForm,
                              box_no: e.target.value,
                           })
                        }
                     />
                     <label>น้ำหนัก: </label>
                     <InputNumber
                        value={addForm.weight}
                        onChange={(value) =>
                           setAddForm({
                              ...addForm,
                              weight: value,
                           })
                        }
                     />
                  </Space>
                  <Space className="mb-[10px]">
                     <label>ราคา: </label>
                     <InputNumber
                        value={addForm.price}
                        onChange={(value) =>
                           setAddForm({
                              ...addForm,
                              price: value,
                           })
                        }
                        step="0.1"
                     />
                     <label>รอบเรือ: </label>
                     <DatePicker
                        value={InputVoyageDate}
                        format="D/M/YYYY"
                        onChange={(value) => {
                           if (value === null) {
                              setAddForm((prev) => ({
                                 ...prev,
                                 voyage: null,
                              }))
                              setInputVoyageDate(null)
                           } else {
                              setAddForm((prev) => ({
                                 ...prev,
                                 voyage: genDate(value).split(" ")[0],
                              }))
                              setInputVoyageDate(value)
                           }
                        }}
                     />
                  </Space>
                  <Space className="mb-[10px]">
                     <label>หมายเหตุลูกค้า: </label>
                     <TextArea
                        rows={2}
                        value={addForm.remark_user}
                        onChange={(e) => {
                           setAddForm({
                              ...addForm,
                              remark_user: e.target.value,
                           })
                        }}
                     />
                  </Space>
                  <Space>
                     <label>หมายเหตุแอดมิน: </label>
                     <TextArea
                        rows={2}
                        value={addForm.remark_admin}
                        onChange={(e) =>
                           setAddForm({
                              ...addForm,
                              remark_admin: e.target.value,
                           })
                        }
                     />
                  </Space>
               </>
            )}
         </Modal>
         <Modal
            title="แก้ไขรายการ Mercari"
            open={showEditModal}
            onCancel={handleCancelEditModal}
            onOk={handleOkEditModal}
         >
            <Space className="mx-auto my-[10px]">
               <label>ชื่อลูกค้า: </label>
               <Select
                  value={selectedRow.user_id}
                  onChange={(value) =>
                     setAddForm({ ...selectedRow, user_id: value })
                  }
                  showSearch
                  style={{ width: 200 }}
                  placeholder="เลือกลูกค้า"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                     (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                     (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={users?.reduce((accumulator, currentValue) => {
                     const { id, username } = currentValue
                     return [
                        ...accumulator,
                        {
                           value: id,
                           label: username,
                        },
                     ]
                  }, [])}
               />
               <label>วันที่: </label>
               <DatePicker
                  value={InputDate}
                  format="D/M/YYYY"
                  onChange={(value) => {
                     if (value === null) {
                        setSelectedRow((prev) => ({
                           ...prev,
                           date: null,
                        }))
                        setInputDate(null)
                     } else {
                        setSelectedRow((prev) => ({
                           ...prev,
                           date: genDate(value),
                        }))
                        setInputDate(value)
                     }
                  }}
               />
            </Space>
            <Space className="mb-[10px]">
               <label>URL: </label>
               <Input
                  value={selectedRow.link}
                  onChange={(e) =>
                     setSelectedRow({
                        ...selectedRow,
                        link: e.target.value,
                     })
                  }
               />
            </Space>
            <Space className="mb-[10px]">
               <label>เลขแทรกกิงค์: </label>
               <Input
                  value={selectedRow.track_no}
                  onChange={(e) =>
                     setSelectedRow({
                        ...selectedRow,
                        track_no: e.target.value,
                     })
                  }
               />
            </Space>
            <Space className="mb-[10px]">
               <label>เลขกล่อง: </label>
               <Input
                  value={selectedRow.box_no}
                  onChange={(e) =>
                     setSelectedRow({
                        ...selectedRow,
                        box_no: e.target.value,
                     })
                  }
               />
               <label>น้ำหนัก: </label>
               <InputNumber
                  value={selectedRow.weight}
                  onChange={(value) =>
                     setSelectedRow({
                        ...selectedRow,
                        weight: value,
                     })
                  }
               />
            </Space>
            <Space className="mb-[10px]">
               <label>ราคา: </label>
               <InputNumber
                  value={selectedRow.price}
                  onChange={(value) =>
                     setSelectedRow({
                        ...selectedRow,
                        price: value,
                     })
                  }
                  step="0.1"
               />
               <label>รอบเรือ: </label>
               <DatePicker
                  value={InputVoyageDate}
                  format="D/M/YYYY"
                  onChange={(value) => {
                     if (value === null) {
                        setSelectedRow((prev) => ({
                           ...prev,
                           voyage: null,
                        }))
                        setInputVoyageDate(null)
                     } else {
                        setSelectedRow((prev) => ({
                           ...prev,
                           voyage: genDate(value).split(" ")[0],
                        }))
                        setInputVoyageDate(value)
                     }
                  }}
               />
            </Space>
            <Space className="mb-[10px]">
               <label>รับของ: </label>
               <Select
                  defaultValue={0}
                  style={{
                     width: 150,
                  }}
                  onChange={(value) =>
                     setSelectedRow({ ...selectedRow, received: value })
                  }
                  options={[
                     {
                        value: 0,
                        label: "ยังไม่ได้รับของ",
                     },
                     {
                        value: 1,
                        label: "รับของเรียบร้อย",
                     },
                  ]}
               />
               <label>Done: </label>
               <Select
                  defaultValue={0}
                  style={{
                     width: 150,
                  }}
                  onChange={(value) =>
                     setSelectedRow({ ...selectedRow, finished: value })
                  }
                  options={[
                     {
                        value: 0,
                        label: "Not Done",
                     },
                     {
                        value: 1,
                        label: "Done",
                     },
                  ]}
               />
            </Space>
            <Space className="mb-[10px]">
               <label>หมายเหตุลูกค้า: </label>
               <TextArea
                  rows={2}
                  value={selectedRow.remark_user}
                  onChange={(e) => {
                     setSelectedRow({
                        ...selectedRow,
                        remark_user: e.target.value,
                     })
                  }}
               />
            </Space>
            <Space>
               <label>หมายเหตุแอดมิน: </label>
               <TextArea
                  rows={2}
                  value={selectedRow.remark_admin}
                  onChange={(e) =>
                     setSelectedRow({
                        ...selectedRow,
                        remark_admin: e.target.value,
                     })
                  }
               />
            </Space>
         </Modal>
         <EditTrackingSlipImageModal
            open={openEditSlipModal}
            onCancel={() => setOpenEditSlipModal(false)}
            setData={setData}
            item={selectedRow}
         />
         <Modal
            title="เพิ่มรูปภาพ"
            open={showImagesModal}
            onCancel={handleCancelImagesModal}
            onOk={handleOkUploadImages}
         >
            <div>
               <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
               >
                  {fileList.length < 7 && "+ Upload"}
               </Upload>
               <PasteImage handlePasteImage={handlePasteImage} />
            </div>
         </Modal>
      </Fragment>
   )
}

MercariTrackingsPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}
export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })

   if (!session) {
      return {
         redirect: {
            destination: "/auth/signin",
            permanent: false,
         },
      }
   }
   return {
      props: {
         session,
      },
   }
}
export default MercariTrackingsPage
