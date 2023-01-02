/* eslint-disable indent */
import {
   AppstoreAddOutlined,
   DownOutlined,
   SearchOutlined,
} from "@ant-design/icons"

import {
   Button,
   DatePicker,
   Modal,
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
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"
import { addForm_model, trackingForm_model } from "../../../model/tracking"
import genDate from "../../../utils/genDate"
import sortDate from "../../../utils/sortDate"

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
   const searchInput = useRef(null)

   const handleOkUploadImages = async () => {
      try {
         const doneImage =
            fileList.map((file, index) => ({
               id: index,
               name: file.name,
               status: file.status,
               uid: file.uid,
               url: file.url ? file.url : file.thumbUrl,
            })) || []
         await fetch(`/api/tracking/images?tracking_id=${trackingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ doneImage }),
         })
         message.success("เพิ่มรูปภาพสำเร็จ!")
         setShowImagesModal(false)
      } catch (err) {
         console.log(err)
         message.error("เพิ่มรูปภาพผิดพลาด!")
      }
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
   const handleCancelImagesModal = () => {
      setShowImagesModal(false)
   }
   const handleShowImages = async (id) => {
      // set images by fetch id tracking
      try {
         const response = await fetch(`/api/tracking/images?id=${id}`)
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
         setTrackingId(id)
         setFileList(new_tracking_image)
      } catch (err) {
         console.log(err)
      }
      setShowImagesModal(true)
   }
   const handleCancelEditModal = () => {
      setshowEditModal(false)
   }
   const handleOkEditModal = async () => {
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
         setData(
            responseJson.trackings
               .sort((a, b) => sortDate(a.date, b.date))
               .reduce((a, c, i) => [...a, { ...c, key: i }], [])
         )
         setAddForm(addForm_model)
         setInputDate(null)
         setInputVoyageDate(null)
         message.success("แก้ไขข้อมูลสำเร็จ!")
         setshowEditModal(false)
      } catch (err) {
         console.log(err)
         message.error("แก้ไขข้อมูลผิดพลาด!")
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
         setData(
            responseJson.trackings
               .sort((a, b) => sortDate(a.date, b.date))
               .reduce((a, c, i) => [...a, { ...c, key: i }], [])
         )
         setAddForm(addForm_model)
         setInputDate(null)
         setInputVoyageDate(null)
         message.success("เพิ่มข้อมูลสำเร็จ!")
         setShowAddModal(false)
      } catch (err) {
         message.error("เพิ่มข้อมูลผิดพลาด!")
         console.log(err)
      }
   }

   const handleDeleteRow = async (id) => {
      try {
         const response = await fetch(`/api/tracking/mercari?id=${id}`, {
            method: "DELETE",
         })
         const responseJson = await response.json()
         setData(
            responseJson.trackings
               .sort((a, b) => sortDate(a.date, b.date))
               .reduce((a, c, i) => [...a, { ...c, key: i }], [])
         )
         message.success("ลบข้อมูลเรียบร้อย!")
      } catch (err) {
         console.log(err)
         message.error("ลบข้อมูลผิดพลาด!")
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
         render: (id) => (
            <Button onClick={() => handleShowImages(id)}>ดูรูปภาพ</Button>
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
         render: (text) =>
            text !== null ? (
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
         title: "เลขแทรกกิงค์",
         dataIndex: "track_no",
         key: "track_no",
         ...getColumnSearchProps("track_no"),
      },
      {
         title: "เลขกล่อง",
         dataIndex: "box_no",
         key: "box_no",
         ...getColumnSearchProps("box_no"),
      },
      {
         title: "น้ำหนัก",
         dataIndex: "weight",
         key: "weight",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "ราคา",
         dataIndex: "price",
         key: "price",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "รอบเรือ",
         dataIndex: "voyage",
         key: "voyage",
         ...getColumnSearchProps("voyage"),
      },
      {
         title: "รับของ",
         dataIndex: "received",
         key: "received",
         render: (text) => (text ? "รับของเรียบร้อย" : "ยังไม่ได้รับของ"),
      },
      {
         title: "Done",
         dataIndex: "finished",
         key: "finished",
         render: (text) => (text ? "Done" : "Not Done"),
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
   useEffect(() => {
      ;(async () => {
         const response = await fetch("/api/user")
         const responseJson = await response.json()
         setUsers(responseJson.users)
      })()
      ;(async () => {
         const response = await fetch("/api/tracking/mercari")
         const responseJson = await response.json()
         // console.log(responseJson)
         // console.log(responseJson.trackings.filter(ft => ft.voyage === null))
         setData(
            responseJson.trackings
               .sort((a, b) => sortDate(a.date, b.date))
               .reduce((a, c, i) => [...a, { ...c, key: i }], [])
         )
      })()
   }, [])
   return (
      <Fragment>
         <CardHead name="Mercari Trackings Page" />
         <div className="m-[10px] p-[10px] bg-white">
            <div style={{ marginBottom: "10px" }}>
               <Button
                  icon={<AppstoreAddOutlined />}
                  onClick={handleOpenAddModal}
               >
                  เพิ่มรายการ
               </Button>
            </div>
            <Table
               dataSource={data}
               columns={columns}
               scroll={{
                  x: 1500,
                  y: 450,
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
                                 voyage: genDate(value),
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
                           voyage: genDate(value),
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
