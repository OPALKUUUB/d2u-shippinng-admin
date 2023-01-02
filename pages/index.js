/* eslint-disable react/jsx-pascal-case */
import { Button, Input, message, Modal, Table } from "antd"
import { getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Layout from "../components/layout/layout"
import { user_model } from "../model/users"

function Dashboard() {
   const [users, setUsers] = useState([])
   const [selectedRow, setSelectedRow] = useState(user_model)
   const [showEditModal, setShowEditModal] = useState(false)
   const handleClickCheckScore = async (id) => {
      const user = users.filter((ft) => ft.id === id)[0]
      try {
         const response = await fetch("/api/point", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: id }),
         })
         const responseJson = await response.json()
         message.info(`${user.username} มีคะแนนปัจจุบัน: ${responseJson.point}`)
      } catch (err) {
         console.log(err)
         message.error("get point fail!")
      }
   }
   const handleShowEditModal = (id) => {
      setSelectedRow(users.filter((ft) => ft.id === id)[0])
      setShowEditModal(true)
   }
   const handleUpdateUser = async () => {
      console.log(selectedRow)
      try {
         const response = await fetch("/api/user/all", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedRow),
         })
         const responseJson = await response.json()
         setUsers(responseJson.users)
         setShowEditModal(false)
         message.success("แก้ไข้ข้อมูลเรียบร้อย")
      } catch (err) {
         console.log(err)
         message.error("Edit user fail!")
      }
   }
   useEffect(() => {
      ;(async () => {
         const response = await fetch("/api/user/all")
         const responseJson = await response.json()
         setUsers(
            responseJson.users.reduce((a, c) => [...a, { ...c, key: c.id }], [])
         )
      })()
   }, [])
   const columns = [
      {
         title: "username",
         dataIndex: "username",
         key: "username",
         fixed: "left",
         width: "130px",
      },
      {
         title: "ชื่อ",
         dataIndex: "name",
         key: "name",
         width: "150px",
      },
      {
         title: "คะแนนเก่า",
         dataIndex: "point_last",
         key: "point_last",
         width: "100px",
      },
      {
         title: "คะแนนปัจจุบัน",
         dataIndex: "id",
         key: "point_current",
         width: "100px",
         render: (id) => (
            <Button onClick={() => handleClickCheckScore(id)}>click</Button>
         ),
      },
      {
         title: "ติดต่อ",
         dataIndex: "contact",
         key: "contact",
         width: "120px",
      },
      {
         title: "เบอร์",
         dataIndex: "phone",
         key: "phone",
         width: "120px",
      },
      {
         title: "ที่อยู่",
         dataIndex: "address",
         key: "address",
         width: "200px",
      },

      {
         title: "จัดการ",
         dataIndex: "id",
         key: "manage",
         fixed: "right",
         width: "100px",
         render: (id) => (
            <Button onClick={() => handleShowEditModal(id)}>แก้ไข</Button>
         ),
      },
   ]
   return (
      <div>
         <div className="w-[99%] mx-auto mt-2 bg-white p-3">
            <h2 className="mb-0">ข้อมูลลูกค้า</h2>
         </div>
         <div className="w-[99%] bg-white mx-auto mt-2">
            <Table
               columns={columns}
               dataSource={users}
               scroll={{
                  x: 1500,
                  y: 500,
               }}
            />
            <Modal
               title="แก้ไขข้อมูลลูกค้า"
               open={showEditModal}
               onCancel={() => setShowEditModal(false)}
               onOk={handleUpdateUser}
            >
               <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                     <label>username: </label>
                     <Input
                        value={selectedRow.username}
                        onChange={(e) =>
                           setSelectedRow({
                              ...selectedRow,
                              username: e.target.value,
                           })
                        }
                     />
                  </div>
                  <div className="flex items-center gap-2">
                     <label>ชื่อ: </label>
                     <Input
                        value={selectedRow.name}
                        onChange={(e) =>
                           setSelectedRow({
                              ...selectedRow,
                              name: e.target.value,
                           })
                        }
                     />
                  </div>
                  <div className="flex items-center gap-2">
                     <label>ติดต่อ: </label>
                     <Input
                        value={selectedRow.contact}
                        onChange={(e) =>
                           setSelectedRow({
                              ...selectedRow,
                              contact: e.target.value,
                           })
                        }
                     />
                  </div>
                  <div className="flex items-center gap-2">
                     <label>เบอร์: </label>
                     <Input
                        value={selectedRow.phone}
                        onChange={(e) =>
                           setSelectedRow({
                              ...selectedRow,
                              phone: e.target.value,
                           })
                        }
                     />
                  </div>
                  <div className="flex items-center gap-2">
                     <label className="w-[35px]">ที่อยู่: </label>
                     <Input
                        value={selectedRow.address}
                        onChange={(e) =>
                           setSelectedRow({
                              ...selectedRow,
                              address: e.target.value,
                           })
                        }
                     />
                  </div>
               </div>
            </Modal>
         </div>
      </div>
   )
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
      props: { session },
   }
}

Dashboard.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export default Dashboard
