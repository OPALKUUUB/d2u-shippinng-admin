/* eslint-disable indent */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-shadow */
/* eslint-disable block-scoped-var */
import React, { useEffect, useState } from "react"
import {
   Button,
   DatePicker,
   Form,
   Input,
   InputNumber,
   message,
   Modal,
   Space,
   Spin,
} from "antd"
import {
   AppstoreAddOutlined,
   DeleteOutlined,
   EditOutlined,
} from "@ant-design/icons"
import axios from "axios"
import moment from "moment/moment"
import dayjs from "dayjs"
import { getSession } from "next-auth/react"
import Layout from "../components/layout/layout"
// import TextArea from "antd/es/input/TextArea"
const { TextArea } = Input

function DashboardPage() {
   const [todolist, setTodolist] = useState([])
   const [trigger, setTrigger] = useState(0)
   const [loading, setLoading] = useState(false)

   function tik() {
      setTrigger((prev) => prev + 1)
   }

   useEffect(() => {
      setLoading(true)
      const fetchTasks = async () => {
         try {
            const response = await axios.get("/api/tasks")
            const { tasks } = response.data
            setTodolist(tasks)
         } catch (error) {
            console.error(error)
         } finally {
            setLoading(false)
         }
      }

      fetchTasks()
   }, [trigger])

   return (
      <>
         {loading && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] z-10">
               <div className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                  <Spin size="large" />
               </div>
            </div>
         )}
         <div className="w-full h-full p-5">
            <div className="w-full h-full bg-white rounded-md p-3 flex">
               <div>
                  <ChangeRateYen />
                  <TodolistForm stik={tik} />
               </div>
               <div className="overflow-y-scroll h-[98%] w-full">
                  <TodolistList tasks={todolist} stik={tik} />
               </div>
            </div>
         </div>
      </>
   )
}

function ChangeRateYen() {
   const [rateYen, setRateYen] = useState(null)

   useEffect(() => {
      const fetchRateYen = async () => {
         try {
            const response = await axios.get("/api/config")
            // eslint-disable-next-line no-shadow
            const { rateYen } = response.data
            setRateYen(rateYen)
         } catch (error) {
            console.error(error)
         }
      }

      fetchRateYen()
   }, [])

   const handleRateYenChange = (value) => {
      setRateYen(value)
   }

   const handleRateYenUpdate = () => {
      axios
         .put("/api/config", { rateYen })
         .then((response) => {
            console.log(response.data)
            message.success("set success!")
         })
         .catch((error) => {
            console.error(error)
         })
   }

   return (
      <div className="w-[220px] h-[160px] bg-slate-200 rounded-lg text-gray-600 p-2 mb-3">
         <div className="mb-3">อัตราการแลกเปลี่ยน (เยน)</div>
         <div className="mb-3 font-bold">{rateYen} บาท</div>
         <div className="mb-3">
            <InputNumber
               value={rateYen}
               className="w-full"
               prefix="1￥ ต่อ "
               onChange={handleRateYenChange}
            />
         </div>
         <div className="mb-3">
            <Button
               type="primary"
               className="w-full"
               onClick={handleRateYenUpdate}
            >
               ยืนยันการเปลี่ยนค่า
            </Button>
         </div>
      </div>
   )
}

function TodolistForm({ stik }) {
   const [startDate, setStartDate] = useState(null)
   const [endDate, setEndDate] = useState(null)
   const [title, setTitle] = useState("")
   const [desc, setDesc] = useState("")
   const handleChangeStartDate = (value) => {
      if (value) {
         const formattedDate = value.format("DD/MM/YYYY")
         setStartDate(formattedDate)
      } else {
         setStartDate(null)
      }
   }
   const handleChangeEndDate = (value) => {
      if (value) {
         const formattedDate = value.format("DD/MM/YYYY")
         setEndDate(formattedDate)
      } else {
         setEndDate(null)
      }
   }
   const handleChangeTitle = (e) => {
      setTitle(e.target.value)
   }
   const handleChangeDesc = (e) => {
      setDesc(e.target.value)
   }
   function handleClearForm() {
      setTitle("")
      setDesc("")
      setStartDate(null)
      setEndDate(null)
   }
   const handleAddTodolist = async () => {
      const task = {
         title,
         desc,
         startDate,
         endDate,
      }
      try {
         await axios.post("/api/tasks", task)
         message.success("เพิ่มข้อมูลสำเร็จ!")
         handleClearForm()
         stik()
      } catch (error) {
         console.error(error)
         message.error("เพิ่มข้อมูลล้มเหลว!")
      } finally {
         handleClearForm()
      }
   }

   return (
      <div className="w-[220px] bg-slate-100 rounded-md px-2 py-4 shadow-md">
         <Form>
            <Form.Item>
               <DatePicker
                  placeholder="วันที่ลงข้อมูล"
                  className="w-full"
                  format="DD/MM/YYYY"
                  value={startDate && moment(startDate, "DD/MM/YYYY")}
                  onChange={(value) => handleChangeStartDate(value)}
               />
            </Form.Item>
            <Form.Item>
               <DatePicker
                  placeholder="วันที่จบรายการ"
                  className="w-full"
                  format="DD/MM/YYYY"
                  value={endDate && moment(endDate, "DD/MM/YYYY")}
                  onChange={(value) => handleChangeEndDate(value)}
               />
            </Form.Item>
            <Form.Item value={title} onChange={handleChangeTitle}>
               <Input className="w-full" placeholder="เรื่อง" />
            </Form.Item>
            <Form.Item>
               <TextArea
                  className="w-full"
                  placeholder="รายละเอียด"
                  value={desc}
                  onChange={handleChangeDesc}
                  rows={6}
               />
            </Form.Item>
            <Form.Item>
               <Button
                  className="w-full"
                  icon={<AppstoreAddOutlined />}
                  type="primary"
                  onClick={handleAddTodolist}
               >
                  เพิ่มรายการที่ต้องทำ
               </Button>
            </Form.Item>
         </Form>
      </div>
   )
}

function TodolistList({ tasks, stik }) {
   return (
      <div className="flex flex-wrap w-full justify-center">
         {tasks.map((task) => (
            <TodolistItem key={task.id} task={task} stik={stik} />
         ))}
      </div>
   )
}

function TodolistItem({ task, stik }) {
   const TodoListForm_model = {
      id: "",
      start_date: "",
      end_date: "",
      title: "",
      desc: "",
   }

   const [selectedRow, setSelectedRow] = useState(TodoListForm_model)
   const [showEditModal, setShowEditModal] = useState(false)
   const [startDate, setStartDate] = useState(null)
   const [endDate, setEndDate] = useState(null)

   // ----- calculate differenceInDays to set TodolistItem color -----//
   const currentDate = Date.now()
   if (task.end_date && typeof task.end_date === "string") {
      const dateParts = task.end_date.split(/\s*\/\s*/)
      const targetDate = new Date(
         `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
      )

      const differenceInTime = targetDate.getTime() - currentDate
      // eslint-disable-next-line vars-on-top, no-var
      var differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24))
   }
   // eslint-disable-next-line no-nested-ternary
   const classNameColor =
      differenceInDays > 1
         ? "relative bg-green-700 w-[290px] h-[310px] text-white rounded-md p-2 mx-2 my-5"
         : differenceInDays >= 0
         ? "relative bg-red-700 w-[290px] h-[310px] text-white rounded-md p-2 mx-2 my-5"
         : "relative bg-gray-500 w-[290px] h-[310px] text-white rounded-md p-2 mx-2 my-5"

   const handleShowEditModal = (task) => {
      console.log(task)
      if (task.end_date === null) {
         setEndDate(null)
      } else {
         setEndDate(dayjs(task.end_date, "D/M/YYYY"))
      }
      if (task.start_date === null) {
         setStartDate(null)
      } else {
         setStartDate(dayjs(task.start_date, "D/M/YYYY"))
      }
      setSelectedRow(task)
      setShowEditModal(true)
   }

   const handleUpdateTodoList = async () => {
      console.log(selectedRow)
      console.log("ID:", selectedRow.id)
      try {
         const response = await fetch(`/api/tasks?id=${selectedRow.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedRow),
         })
         const responseJson = await response.json()
         console.log("Json", responseJson)
         setShowEditModal(false)
         message.success("แก้ไข้ข้อมูลเรียบร้อย")
         stik()
      } catch (err) {
         console.log(err)
         message.error("Edit user fail!")
      }
   }

   const handleDeleteTodoList = async (taskId) => {
      if (!window.confirm("คุณแน่ใจที่จะลบใช่หรือไม่")) {
         return
      }
      try {
         await axios.delete(`/api/tasks?id=${taskId}`)
         message.success("ลบข้อมูลเรียบร้อย!")
         stik()
      } catch (err) {
         console.log(err)
         message.error("ลบข้อมูลผิดพลาด!")
      }
   }

   const handleEditStartDate = (value) => {
      if (value) {
         setStartDate(value)
         setSelectedRow({
            ...selectedRow,
            start_date: dayjs(value, "D/M/YYYY").format("D/M/YYYY"),
         })
      } else {
         setStartDate(null)
      }
   }

   const handleEditEndDate = (value) => {
      if (value) {
         setEndDate(value)
         setSelectedRow({
            ...selectedRow,
            end_date: dayjs(value, "D/M/YYYY").format("D/M/YYYY"),
         })
      } else {
         setEndDate(null)
      }
   }

   return (
      <div>
         <Modal
            title="แก้ไข List"
            open={showEditModal}
            onCancel={() => setShowEditModal(false)}
            onOk={handleUpdateTodoList}
         >
            <div className="flex flex-col gap-2">
               <Space className="mb-[10px]">
                  <label>วันที่ลงข้อมูล: </label>
                  <DatePicker
                     value={startDate}
                     format="DD/MM/YYYY"
                     onChange={(value) => handleEditStartDate(value)}
                  />
               </Space>
               <Space className="mb-[10px]">
                  <label>วันที่จบรายการ: </label>
                  <DatePicker
                     value={endDate}
                     format="DD/MM/YYYY"
                     onChange={(value) => handleEditEndDate(value)}
                  />
               </Space>
               <div className="mb-[10px]">
                  <label>เรื่อง: </label>
                  <Input
                     className="w-full mt-2"
                     // value={task.title}
                     value={selectedRow.title}
                     onChange={(e) =>
                        setSelectedRow({
                           ...selectedRow,
                           title: e.target.value,
                        })
                     }
                  />
               </div>
               <div>
                  <label>รายละเอียด: </label>
                  <TextArea
                     className="w-full mt-2"
                     rows={4}
                     value={selectedRow.desc}
                     onChange={(e) =>
                        setSelectedRow({
                           ...selectedRow,
                           desc: e.target.value,
                        })
                     }
                  />
               </div>
            </div>
         </Modal>

         <div className={classNameColor}>
            <Button
               className="float-right bg-white hover:border-white"
               icon={<DeleteOutlined />}
               onClick={() => handleDeleteTodoList(task.id)}
            />
            <Button
               className="float-right bg-white mr-1"
               icon={<EditOutlined />}
               onClick={() => handleShowEditModal(task)}
            />
            <div className="text-lg">วันที่จบรายการ</div>
            <div>{task.end_date}</div>

            <div className="absolute bottom-2 bg-white w-[275px] h-[240px] text-gray-600 rounded-md p-2">
               <div className="text-lg">TITLE: {task.title}</div>
               <br />
               <div className="whitespace-pre-line overflow-auto h-[120px]">{task.desc}</div>
               <div className="absolute bottom-2">
                  วันที่ลงข้อมูล: {task.start_date}
               </div>
            </div>
         </div>
      </div>
   )
}
DashboardPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   // console.log(context.req)
   const session = await getSession({ req: context.req })
   
   // eslint-disable-next-line prefer-template
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

export default DashboardPage
