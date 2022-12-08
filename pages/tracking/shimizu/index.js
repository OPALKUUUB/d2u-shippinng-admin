import { AppstoreAddOutlined } from "@ant-design/icons"
import {
   Button,
   DatePicker,
   Modal,
   Table,
   Input,
   InputNumber,
   Select,
} from "antd"
import { getSession } from "next-auth/react"
import React, { Fragment, useState } from "react"
import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
import customParseFormat from "dayjs/plugin/customParseFormat"
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"

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
function ShimizuTrackingsPage(props) {
   const { users } = props
   const [data, setData] = useState(props.trackings)
   const [addForm, setAddForm] = useState(addForm_model)
   const [InputDate, setInputDate] = useState(null)
   const [InputVoyageDate, setInputVoyageDate] = useState(null)
   const [showAddModal, setShowAddModal] = useState(false)
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
   const columns = [
      {
         title: "วันที่",
         dataIndex: "date",
         width: "120px",
         key: "date",
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         width: "120px",
         key: "username",
      },
      {
         title: "เลขแทรกกิงค์",
         dataIndex: "track_no",
         key: "track_no",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "เลขกล่อง",
         dataIndex: "box_no",
         key: "box_no",
         render: (text) => (text === null ? "-" : text),
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
      },
      {
         title: "จัดการ",
         dataIndex: "id",
         key: "manage",
         render: (text) => text,
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
            <div className="AddShimizuTrackingModal">
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
               {addForm.user_id !== "" && (
                  <>
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
                  </>
               )}
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
