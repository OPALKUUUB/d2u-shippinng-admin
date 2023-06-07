/* eslint-disable react/jsx-pascal-case */
import {
   SearchOutlined,
} from "@ant-design/icons"
import { Button, Input, message, Modal, Table, Space } from "antd"
import { getSession } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import Highlighter from "react-highlight-words"
import Layout from "../../components/layout/layout"
import { user_model } from "../../model/users"

function CustomerPage() {
   const [users, setUsers] = useState([])
   const [selectedRow, setSelectedRow] = useState(user_model)
   const [showEditModal, setShowEditModal] = useState(false)
   const [searchText, setSearchText] = useState("")
   const [searchedColumn, setSearchedColumn] = useState("")
   const searchInput = useRef(null)
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
         title: "username",
         dataIndex: "username",
         key: "username",
         fixed: "left",
         width: "130px",
         ...getColumnSearchProps("username"),
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
                  <div className="flex items-center gap-2">
                     <label>คะแนน: </label>
                     <Input
                        value={selectedRow.point_last}
                        onChange={(e) =>
                           setSelectedRow({
                              ...selectedRow,
                              point_last: e.target.value,
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
CustomerPage.getLayout = function getLayout(page) {
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
      props: { session },
   }
}


export default CustomerPage
