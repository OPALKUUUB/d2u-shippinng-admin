import {
   AppstoreAddOutlined,
   DownOutlined,
   FilterFilled,
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
} from "antd"
import Highlighter from "react-highlight-words"
import { getSession } from "next-auth/react"
import React, { Fragment, useState, useRef } from "react"
import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
import customParseFormat from "dayjs/plugin/customParseFormat"
// import ImgCrop from "antd-img-crop"
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"
// import UploadImages from "../../../components/UploadImages"

const { TextArea } = Input
dayjs.extend(customParseFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
const addForm_model = {
   date: "",
   user_id: "",
   box_no: "",
   track_no: "",
   weight: "",
   voyage: "",
   remark_user: "",
   remark_admin: "",
   channel: "shimizu",
}
const trackingForm_model = {
   id: "",
   username: "",
   user_id: 1,
   rate_yen: "",
   date: "",
   link: "",
   price: "",
   weight: "",
   track_no: "",
   box_no: "",
   voyage: "",
   channel: "",
   remark_user: "",
   remark_admin: "",
   received: "",
   finished: "",
   created_at: "",
   updated_at: "",
}
function ShimizuTrackingsPage(props) {
   const { users } = props
   const [data, setData] = useState(props.trackings)
   const [addForm, setAddForm] = useState(addForm_model)
   const [InputDate, setInputDate] = useState(null)
   const [InputVoyageDate, setInputVoyageDate] = useState(null)
   const [showAddModal, setShowAddModal] = useState(false)
   const [selectedRow, setSelectedRow] = useState(trackingForm_model)
   const [showEditModal, setshowEditModal] = useState(false)
   const [showImagesModal, setShowImagesModal] = useState(false)
   const [addImages, setAddImages] = useState([])
   const [deleteImages, setDeleteImages] = useState([])
   const [fileList, setFileList] = useState([])
   const [trackingId, setTrackingId] = useState("")
   const handleOkUploadImages = async () => {
      // console.log(deleteImages)
      // console.log(addImages)
      try {
         const doneImage =
            fileList.map((file, index) => ({
               id: index,
               name: file.name,
               status: file.status,
               uid: file.uid,
               url: file.url ? file.url : file.thumbUrl,
            })) || []
         // const response = await fetch(
         //    `/api/tracking/images?tracking_id=${trackingId}`,
         //    {
         //       method: "PATCH",
         //       headers: { "Content-Type": "application/json" },
         //       body: JSON.stringify({ deleteImages, addImages }),
         //    }
         // )
         const response = await fetch(
            `/api/tracking/images?tracking_id=${trackingId}`,
            {
               method: "PATCH",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ doneImage }),
            }
         )
         const responseJson = await response.json()
         setShowImagesModal(false)
      } catch (err) {
         console.log(err)
      }
   }
   const onChange = ({ fileList: newFileList }) => {
      // const temp1 = fileList.filter((ft) => ft.status === "removed")
      // const temp2 = fileList.filter(
      //    (ft) => ft.status === "uploading" && ft.percent === 100
      // )
      // if (temp1.length === 1) {
      //    setDeleteImages((prev) => [...prev, temp1[0].id])
      // }
      // if (temp2.length === 1) {
      //    setAddImages((prev) => [...prev, temp2[0].thumbUrl])
      // }
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
         box_no: selectedRow.box_no,
         track_no: selectedRow.track_no,
         weight: selectedRow.weight,
         voyage: selectedRow.voyage,
         remark_user: selectedRow.remark_user,
         remark_admin: selectedRow.remark_admin,
      }
      try {
         const response = await fetch(
            `/api/tracking/shimizu?id=${selectedRow.id}`,
            {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(body),
            }
         )
         const responseJson = await response.json()
         const { trackings } = responseJson
         setData(trackings)
         setAddForm(addForm_model)
         setInputDate(null)
         setInputVoyageDate(null)
         setshowEditModal(false)
      } catch (err) {
         console.log(err)
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
      }
      const body = {
         date: addForm.date,
         user_id: addForm.user_id,
         box_no: addForm.box_no,
         track_no: addForm.track_no,
         weight: addForm.weight,
         voyage: addForm.voyage,
         remark_user: addForm.remark_user,
         remark_admin: addForm.remark_admin,
         channel: addForm.channel,
      }
      try {
         const response = await fetch("/api/tracking/shimizu", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
         })
         const responseJson = await response.json()
         const { trackings } = responseJson
         setData(trackings)
         setAddForm(addForm_model)
         setInputDate(null)
         setInputVoyageDate(null)
         setShowAddModal(false)
      } catch (err) {
         console.log(err)
      }
   }
   const [searchText, setSearchText] = useState("")
   const [searchedColumn, setSearchedColumn] = useState("")
   const searchInput = useRef(null)
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
         <div
            style={{
               padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
         >
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
               style={{
                  marginBottom: 8,
                  display: "block",
               }}
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
      onFilter: (value, record) =>
         record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
         if (visible) {
            setTimeout(() => searchInput.current?.select(), 100)
         }
      },
      render: (text) =>
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
         sorter: (a, b) => {
            const datetime_a = a.date
            const date_a_f = datetime_a.split("/")
            // [y,m,d,h,m,s]
            const datetime_a_f = [
               parseInt(date_a_f[2], 10),
               parseInt(date_a_f[1], 10),
               parseInt(date_a_f[0], 10),
            ]
            const datetime_b = b.date
            const date_b_f = datetime_b.split("/")
            const datetime_b_f = [
               parseInt(date_b_f[2], 10),
               parseInt(date_b_f[1], 10),
               parseInt(date_b_f[0], 10),
            ]
            for (let i = 0; i < 3; i++) {
               if (datetime_a_f[i] - datetime_b_f[i] !== 0) {
                  return datetime_a_f[i] - datetime_b_f[i]
               }
            }
            return 0
         },
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
         title: "เลขแทรกกิงค์",
         dataIndex: "track_no",
         key: "track_no",
         render: (text) => (text === null ? "-" : text),
         ...getColumnSearchProps("track_no"),
      },
      {
         title: "เลขกล่อง",
         dataIndex: "box_no",
         key: "box_no",
         render: (text) => (text === null ? "-" : text),
         ...getColumnSearchProps("box_no"),
      },
      {
         title: "น้ำหนัก",
         dataIndex: "weight",
         key: "weight",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "รอบเรือ",
         dataIndex: "voyage",
         key: "voyage",
         render: (text) => (text === null ? "-" : text),
         ...getColumnSearchProps("voyage"),
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
               },
            ]
            return (
               <Space>
                  <Dropdown menu={{ items }}>
                     <span style={{ cursor: "pointer" }}>
                        จัดการ <DownOutlined />
                     </span>
                  </Dropdown>
               </Space>
            )
         },
      },
   ]
   return (
      <Fragment>
         <CardHead name="Shimizu Trackings Page" />
         <div className="container-table">
            <div style={{ marginBottom: "10px" }}>
               <Button
                  icon={<AppstoreAddOutlined />}
                  onClick={handleOpenAddModal}
               >
                  เพิ่มรายการ
               </Button>
            </div>
            <Table dataSource={data} columns={columns} />
         </div>
         <Modal
            title="เพิ่มรายการ Shimizu"
            open={showAddModal}
            onCancel={handleCancelAddModal}
            onOk={handleOkAddModal}
         >
            <Space style={{ margin: "10px auto" }}>
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
                  options={users.reduce((accumulator, currentValue) => {
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
                                 date: new Date(value).toLocaleDateString(
                                    "th-TH"
                                 ),
                              }))
                              setInputDate(value)
                           }
                        }}
                     />
                  </Space>
                  <Space style={{ marginBottom: 10 }}>
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
                  <Space style={{ marginBottom: 10 }}>
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
                  </Space>
                  <Space style={{ marginBottom: 10 }}>
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
                                 voyage: new Date(value).toLocaleDateString(
                                    "th-TH"
                                 ),
                              }))
                              setInputVoyageDate(value)
                           }
                        }}
                     />
                  </Space>
                  <Space style={{ marginBottom: 10 }}>
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
            title="แก้ไขรายการ Shimizu"
            open={showEditModal}
            onCancel={handleCancelEditModal}
            onOk={handleOkEditModal}
         >
            <Space style={{ margin: "10px auto" }}>
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
                  options={users.reduce((accumulator, currentValue) => {
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
                           date: new Date(value).toLocaleDateString("th-TH"),
                        }))
                        setInputDate(value)
                     }
                  }}
               />
            </Space>
            <Space style={{ marginBottom: 10 }}>
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
            <Space style={{ marginBottom: 10 }}>
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
            </Space>
            <Space style={{ marginBottom: 10 }}>
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
                           voyage: new Date(value).toLocaleDateString("th-TH"),
                        }))
                        setInputVoyageDate(value)
                     }
                  }}
               />
            </Space>
            <Space style={{ marginBottom: 10 }}>
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
         <style jsx>
            {`
               .container-table {
                  margin: 10px;
                  background: white;
                  padding: 10px;
               }
            `}
         </style>
      </Fragment>
   )
}

ShimizuTrackingsPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}
export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })
   // get trackings shimizu
   const api_tracking_shimizu = `${process.env.BACKEND_URL}/api/tracking/shimizu`
   const response = await fetch(api_tracking_shimizu)
   const responseJson = await response.json()
   const { trackings } = responseJson
   // get users
   const api_user = `${process.env.BACKEND_URL}/api/user`
   const response2 = await fetch(api_user)
   const respones2Json = await response2.json()
   const { users } = respones2Json
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
         trackings,
         users,
      },
   }
}
export default ShimizuTrackingsPage