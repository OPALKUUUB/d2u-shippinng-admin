/* eslint-disable react/jsx-pascal-case */
import {
   SearchOutlined,
} from "@ant-design/icons"
import { Button, Input, message, Modal, Table, Space, Select, Spin, Tooltip } from "antd"
import { getSession } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import Highlighter from "react-highlight-words"
import * as XLSX from "xlsx"
import Layout from "../../components/layout/layout"
import { user_model } from "../../model/users"

function CustomerPage() {
   const [users, setUsers] = useState([])
   const [selectedRow, setSelectedRow] = useState(user_model)
   const [showEditModal, setShowEditModal] = useState(false)
   const [searchText, setSearchText] = useState("")
   const [searchedColumn, setSearchedColumn] = useState("")
   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
   const [loading, setLoading] = useState(false)
   const searchInput = useRef(null)
   
   const handleGetAllUserPoints = async () => {
      setLoading(true)
      try {
         const response = await fetch("/api/user/point", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ year: selectedYear }),
         })
         const responseJson = await response.json()
         console.log("All User Points:", responseJson)
         message.success(`ดึงข้อมูลคะแนนของผู้ใช้ ${responseJson.data.length} คน สำเร็จ (ปี ${selectedYear})`)
      } catch (err) {
         console.log(err)
         message.error("ดึงข้อมูลคะแนนล้มเหลว!")
      } finally {
         setLoading(false)
      }
   }

   const handleExportToExcel = async () => {
      setLoading(true)
      try {
         const response = await fetch("/api/user/point", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ year: selectedYear }),
         })
         const responseJson = await response.json()
         
         // จัดเตรียมข้อมูลสำหรับ Excel
         const exportData = responseJson.data.map((item, index) => ({
            "ลำดับ": index + 1,
            "User ID": item.user_id,
            "Username": item.username,
            "คะแนน": item.point,
            "จำนวน Tracking": item.trackings_count,
         }))

         // สร้าง worksheet
         const ws = XLSX.utils.json_to_sheet(exportData)
         
         // กำหนดความกว้างของคอลัมน์
         ws['!cols'] = [
            { wch: 8 },  // ลำดับ
            { wch: 10 }, // User ID
            { wch: 20 }, // Username
            { wch: 10 }, // คะแนน
            { wch: 18 }, // จำนวน Tracking
         ]

         // สร้าง workbook
         const wb = XLSX.utils.book_new()
         XLSX.utils.book_append_sheet(wb, ws, `คะแนนปี${selectedYear}`)
         
         // Download file
         XLSX.writeFile(wb, `คะแนนผู้ใช้_ปี${selectedYear}_${new Date().toISOString().split('T')[0]}.xlsx`)
         
         message.success(`Export ข้อมูลคะแนนปี ${selectedYear} สำเร็จ`)
      } catch (err) {
         console.log(err)
         message.error("Export ข้อมูลล้มเหลว!")
      } finally {
         setLoading(false)
      }
   }
   
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
      <Spin spinning={loading} tip="กำลังโหลดข้อมูล..." size="large">
         <div>
            <div className="w-[99%] mx-auto mt-2 bg-white p-3">
               <div className="flex justify-between items-center">
                  <h2 className="mb-0">ข้อมูลลูกค้า</h2>
                  <div className="flex gap-2 items-center">
                     <span>เลือกปี:</span>
                     <Select
                        value={selectedYear}
                        onChange={(value) => setSelectedYear(value)}
                        style={{ width: 120 }}
                        options={[
                           { value: 2026, label: "2026" },
                           { value: 2025, label: "2025" },
                           { value: 2024, label: "2024" },
                           { value: 2023, label: "2023" },
                           { value: 2022, label: "2022" },
                        ]}
                        disabled={loading}
                     />
                     {/* <Tooltip title="อาจใช้เวลาประมาณ 2 นาที" placement="bottom">
                        <Button 
                           type="primary" 
                           onClick={handleGetAllUserPoints}
                           loading={loading}
                           disabled={loading}
                        >
                           ดึงข้อมูลคะแนนทั้งหมด
                        </Button>
                     </Tooltip> */}
                     <Tooltip title="อาจใช้เวลาประมาณ 2 นาที" placement="bottom">
                        <Button 
                           type="default" 
                           onClick={handleExportToExcel}
                           loading={loading}
                           disabled={loading}
                        >
                           Export Excel
                        </Button>
                     </Tooltip>
                  </div>
               </div>
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
      </Spin>
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
