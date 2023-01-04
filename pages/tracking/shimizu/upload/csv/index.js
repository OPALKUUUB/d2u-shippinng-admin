import React, { useState, useEffect, useRef, Fragment } from "react"
import {
   UploadOutlined,
   SearchOutlined,
   FileAddOutlined,
   LoadingOutlined,
} from "@ant-design/icons"
import {
   Button,
   Modal,
   Table,
   Input,
   Select,
   Space,
   Upload,
   message,
} from "antd"
import Highlighter from "react-highlight-words"
import { getSession } from "next-auth/react"
import Papa from "papaparse"
import Layout from "../../../../../components/layout/layout"
import sortDate from "../../../../../utils/sortDate"
import genDate from "../../../../../utils/genDate"

function UploadCSVShimizu() {
   const [data, setData] = useState([])
   const [users, setUsers] = useState([])
   const [searchText, setSearchText] = useState("")
   const [searchedColumn, setSearchedColumn] = useState("")
   const [showEditDataModal, setShowEditDataModal] = useState(false)
   const [selectedRow, setSelectedRow] = useState({
      id: "",
      date: "",
      username: "",
      track_no: "",
      box_no: "",
      weight: 0,
      voyage: "",
      remark: "",
   })
   const [userSelect, setUserSelect] = useState(null)
   const searchInput = useRef(null)
   const [loadingButton, setLoadingButton] = useState(false)

   const handleOkEditModal = () => {
      // console.log(userSelect, selectedRow)
      setData((prev) => {
         const dataIndex = prev.findIndex((fi) => fi.id === selectedRow.id)
         return [
            ...prev.slice(0, dataIndex),
            { ...selectedRow, username: userSelect },
            ...prev.slice(dataIndex + 1),
         ]
      })
      message.success("การแก้ไขสำเร็จ!")
      setSelectedRow({
         id: "",
         date: "",
         username: "",
         track_no: "",
         box_no: "",
         weight: 0,
         voyage: "",
         remark: "",
      })
      setShowEditDataModal(false)
   }
   const handleEditData = (id) => {
      setSelectedRow(data.find((f) => f.id === id))
      setShowEditDataModal(true)
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
   const dataCorrectUsername = data
      .filter(
         (ele) =>
            users.find((user) => user.username === ele.username) !== undefined
      )
      .map((item, index) => ({ ...item, key: index }))

   const dataNotCorrectUsername = data
      .filter(
         (ele) =>
            users.find((user) => user.username === ele.username) === undefined
      )
      .map((item, index) => ({ ...item, key: index }))

   const handleSubmit = async () => {
      if (dataCorrectUsername.length === 0) {
         message.warning("no data to upload!")
         return
      }
      setLoadingButton(true)
      const date = genDate()
      const bodyData = dataCorrectUsername.map((item) => ({
         date: item.date,
         user_id: users.find((fi) => fi.username === item.username).id,
         track_no: item.track_no,
         box_no: item.box_no,
         weight: item.weight || 0,
         voyage: item.voyage,
         remark_admin: item.remark,
         channel: "shimizu",
         created_at: date,
         updated_at: date,
      }))
      try {
         const response = await fetch("/api/tracking/shimizu/upload/csv", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ trackings: bodyData }),
         })
         const responseJson = await response.json()
         message.success(responseJson.message)
         setData([])
         setLoadingButton(false)
      } catch (error) {
         console.log(error)
         message.error(error.message)
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
   const columns_correct = [
      {
         title: "วันที่",
         dataIndex: "date",
         key: "date",
         sorter: (a, b) => sortDate(a.date, b.date),
         ...getColumnSearchProps("date"),
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         key: "username",
         ...getColumnSearchProps("username"),
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
         render: (text) => (text === null || text === "" ? "-" : text),
      },
      {
         title: "รอบเรือ",
         dataIndex: "voyage",
         key: "voyage",
         ...getColumnSearchProps("voyage"),
      },
      {
         title: "หมายเหตุแอดมิน",
         dataIndex: "remark",
         key: "remark",
         render: (text) => (text === null || text === "" ? "-" : text),
      },
   ]
   const columns_not_correct = [
      {
         title: "วันที่",
         dataIndex: "date",
         key: "date",
         sorter: (a, b) => sortDate(a.date, b.date),
         ...getColumnSearchProps("date"),
      },
      {
         title: "ชื่อลูกค้าใหม่",
         dataIndex: "username",
         key: "username",
         ...getColumnSearchProps("username"),
      },
      {
         title: "ชื่อลูกค้าที่ไม่มีข้อมูล",
         dataIndex: "username",
         key: "username",
         ...getColumnSearchProps("username"),
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
         render: (text) => (text === null || text === "" ? "-" : text),
      },
      {
         title: "รอบเรือ",
         dataIndex: "voyage",
         key: "voyage",
         ...getColumnSearchProps("voyage"),
      },
      {
         title: "หมายเหตุแอดมิน",
         dataIndex: "remark",
         key: "remark",
         render: (text) => (text === null || text === "" ? "-" : text),
      },
      {
         title: "แก้ไข",
         dataIndex: "id",
         key: "edit",
         fixed: "right",
         render: (id) => (
            <Button onClick={() => handleEditData(id)}>Edit</Button>
         ),
      },
   ]
   return (
      <Fragment>
         <div
            style={{
               width: "100vw",
               height: 50,
               background: "white",
               boxShadow: "4px 0px 10px rgba(0, 0, 0, 0.1) inset",
            }}
         >
            <Upload
               accept=".csv"
               showUploadList={false}
               onChange={(info) => {
                  if (info.file.status !== "uploading") {
                     console.log(info.file, info.fileList)
                  }
                  if (info.file.status === "done") {
                     message.success(
                        `${info.file.name} file uploaded successfully`
                     )
                  } else if (info.file.status === "error") {
                     message.error(`${info.file.name} file upload failed.`)
                  }
               }}
               beforeUpload={(file) => {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                     Papa.parse(e.target.result, {
                        header: true,
                        skipEmptyLines: true,
                        complete(results) {
                           setData(
                              results.data.map((item, index) => ({
                                 ...item,
                                 id: index,
                              }))
                           )
                        },
                     })
                  }
                  reader.readAsText(file)

                  // Prevent upload
                  return false
               }}
               maxCount={1}
            >
               <Button
                  style={{ margin: "10px 0 10px 25px" }}
                  icon={<UploadOutlined />}
               >
                  Click to Upload
               </Button>
            </Upload>
         </div>
         <div className="m-[10px] p-[10px] bg-white">
            <h3>ข้อมูลที่ไม่พบในฐานข้อมูล</h3>
            <Table
               dataSource={dataNotCorrectUsername}
               columns={columns_not_correct}
               scroll={{
                  x: 1500,
                  y: 200,
               }}
            />
            <Modal
               open={showEditDataModal}
               onCancel={() => setShowEditDataModal(false)}
               onOk={handleOkEditModal}
            >
               <div>
                  ชื่อลูกค้าที่ไม่มีข้อมูล:{" "}
                  {selectedRow?.username ?? "loading..."}
               </div>
               <div>
                  <label>ชื่อลูกค้าใหม่: </label>
                  <Select
                     optionFilterProp="children"
                     filterOption={(input, option) =>
                        (option?.label ?? "")
                           .toLowerCase()
                           .includes(input.toLowerCase())
                     }
                     filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                           .toLowerCase()
                           .localeCompare((optionB?.label ?? "").toLowerCase())
                     }
                     showSearch
                     style={{ width: 200 }}
                     placeholder="เลือกลูกค้า"
                     value={userSelect}
                     onChange={(value) => setUserSelect(value)}
                     options={users?.reduce((a, c) => {
                        const { username } = c
                        return [
                           ...a,
                           {
                              value: username,
                              label: username,
                           },
                        ]
                     }, [])}
                  />
               </div>
               <p className="text-[red]">
                  *
                  เมื่อทำการยืนยันการแก้ไขแล้วข้อมูลจะถูกย้ายลงไปตารางที่เตรียม
                  Import ข้อมูลโดยทันที
               </p>
            </Modal>
         </div>
         <div className="m-[10px] p-[10px] bg-white">
            <h3>ข้อมูลเตรียมอัพโหลด</h3>
            <Table
               dataSource={dataCorrectUsername}
               columns={columns_correct}
               scroll={{
                  x: 1500,
                  y: 200,
               }}
            />
            <div className="w-full h-[50px]">
               {!loadingButton && (
                  <Button
                     className="mt-3 float-right transition-all duration-100"
                     onClick={handleSubmit}
                     icon={<FileAddOutlined />}
                  >
                     ยืนยันการอัพโหลดข้อมูล
                  </Button>
               )}
               {loadingButton && (
                  <Button
                     className="mt-3 float-right transition-all duration-100"
                     icon={<LoadingOutlined />}
                  >
                     กำลังอัพโหลดข้อมูล
                  </Button>
               )}
            </div>
         </div>
      </Fragment>
   )
}

UploadCSVShimizu.getLayout = function getLayout(page) {
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
export default UploadCSVShimizu
