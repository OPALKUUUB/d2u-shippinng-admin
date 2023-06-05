import React, { useEffect, useState } from "react"
import { Button, DatePicker, Form, Input, InputNumber, message } from "antd"
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons"
import moment from "moment"
import axios from "axios"
import Layout from "../components/layout/layout"

function DashboardPage() {
   const [todolist, setTodolist] = useState([])
   const [trigger, setTrigger] = useState(0)

   const tik = () => {
      setTrigger((prev) => prev + 1)
   }

   useEffect(() => {
      const fetchTasks = async () => {
         try {
            const response = await axios.get("/api/tasks")
            const { tasks } = response.data
            setTodolist(tasks)
         } catch (error) {
            console.error(error)
         }
      }

      fetchTasks()
   }, [trigger])

   return (
      <div className="w-full h-full p-5">
         <div className="w-full h-full bg-white rounded-md p-3">
            <div className="w-full flex gap-3">
               <ChangeRateYen />
               <TodolistForm stik={tik} />
            </div>
            <div className="overflow-y-scroll h-[420px] my-3"> 
               <TodolistList tasks={todolist} />
            </div>
         </div>
      </div>
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
      <div className="w-[200px] h-[160px] bg-slate-200 rounded-lg text-gray-600 p-2">
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

function TodolistForm({ tik }) {
   const [startDate, setStartDate] = useState(null)
   const [endDate, setEndDate] = useState(null)
   const [title, setTitle] = useState("")
   const [price, setPrice] = useState(null)
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
   const handleChangePrice = (value) => {
      setPrice(value)
   }
   const handleAddTodolist = () => {
      const task = {
         title,
         price,
         startDate,
         endDate,
      }
      axios
         .post("/api/tasks", task)
         .then((response) => {
            // Handle the successful response
            console.log(response.data)
            // Reset the form fields
            message.success("เพิ่มข้อมูลสำเร็จ!")
            setTitle("")
            setPrice(null)
            setStartDate(null)
            setEndDate(null)
            tik()
         })
         .catch((error) => {
            // Handle the error
            console.error(error)
            message.error("เพิ่มข้อมูลล้มเหลว!")
         })
   }
   return (
      <div className="w-[730px] h-[160px] bg-slate-100 rounded-md p-2">
         <Form className="flex flex-wrap w-[700px]">
            <div className="flex-col w-[350px]">
               <Form.Item labelCol={{ span: 8 }} label="วันที่ลงข้อมูล">
                  <DatePicker
                     className="w-full"
                     format="DD/MM/YYYY"
                     value={startDate && moment(startDate, "DD/MM/YYYY")}
                     onChange={(value) => handleChangeStartDate(value)}
                  />
               </Form.Item>
               <Form.Item
                  labelCol={{ span: 8 }}
                  label="วันที่จบรายการ"
                  className="mb-4"
               >
                  <DatePicker
                     className="w-full"
                     format="DD/MM/YYYY"
                     value={endDate && moment(endDate, "DD/MM/YYYY")}
                     onChange={(value) => handleChangeEndDate(value)}
                  />
               </Form.Item>
            </div>
            <div className="flex-col w-[350px]">
               <Form.Item
                  labelCol={{ span: 5 }}
                  label="เรื่อง"
                  value={title}
                  onChange={handleChangeTitle}
               >
                  <Input className="w-full" />
               </Form.Item>
               <Form.Item labelCol={{ span: 5 }} className="mb-4" label="รายละเอียด"
                  value={price}
                  onChange={handleChangePrice}
               >
                  {/* <InputNumber
                     className="w-full"
                     value={price}
                     onChange={handleChangePrice}
                  /> */}
                  <Input className="w-full" />
               </Form.Item>
            </div>
            <div className="w-full text-center">
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
            </div>
         </Form>
      </div>
   )
}

function TodolistList({ tasks }) {
   return (
      <div className="flex flex-wrap w-full mt-2">
         {tasks.map((task) => (
            <TodolistItem key={task.id} task={task} />
         ))}
      </div>
   )
}

function TodolistItem({ task }) {

   //----- calculate differenceInDays to set TodolistItem color -----//
   const currentDate = Date.now();
   // const targetDate = new Date('2023-04-06'); // Replace with your specific date
   if (task.end_date && typeof task.end_date === 'string') {
      const dateParts = task.end_date.split(/\s*\/\s*/);
      const targetDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

      const differenceInTime = targetDate.getTime() - currentDate;
      var differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
   }
   const classNameColor = differenceInDays > 1 ? 'relative bg-green-700 w-[290px] h-[310px] text-white rounded-md p-2 mx-2 my-5' 
      : differenceInDays >= 0 ? 'relative bg-red-700 w-[290px] h-[310px] text-white rounded-md p-2 mx-2 my-5' : 'relative bg-gray-500 w-[290px] h-[310px] text-white rounded-md p-2 mx-2 my-5';
   

   const handleEdit = () => {
      console.log("Edit")
   }

   const handleDelete = () => {
      console.log("Delete")
   }

   return (
      // <div className="bg-gray-300 w-[100px] h-[100px] text-gray-600 rounded-md p-2">
      //    <div>{task.start_date}</div>
      //    <div>{task.end_date}</div>
      //    <div>{task.title}</div>
      //    <div>{task.price}</div>
      // </div>
      <div className={classNameColor}>
            <Button className="float-right bg-white hover:border-white"
               icon={<DeleteOutlined />}
               onClick={handleDelete}
            />
            <Button className="float-right bg-white mr-1" hoverStyle={{ backgroundColor: 'red', borderColor: 'red' }}
               icon={ <EditOutlined />}
               onClick={handleEdit}
            />
            <div className="text-lg">วันที่จบรายการ</div>
            <div>{task.end_date}</div>

         <div className="absolute bottom-2 bg-white w-[275px] h-[240px] text-gray-600 rounded-md p-2">
            <div className="text-lg">TITLE: {task.title}</div>
            <br/>
            <div>{task.price}</div>
            <div className="absolute bottom-2">วันที่ลงข้อมูล: {task.start_date}</div>
         </div>
      </div>
   )
}
DashboardPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export default DashboardPage
