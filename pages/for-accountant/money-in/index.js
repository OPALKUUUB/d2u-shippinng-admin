import React, { Fragment, useEffect, useState } from "react"
import { getSession } from "next-auth/react"
import { Button, Col, Divider, List, Row, Table, Tag, Typography } from "antd"
import { FileAddOutlined } from "@ant-design/icons"
import axios from "axios"
import Layout from "../../../components/layout/layout"
import SearchFormAccountant from "../../../components/SearchFormAccountant"
import LoadingPage from "../../../components/LoadingPage"

const mockDatasource = [
   {
      key: 1,
      date: "18/07/2023 11:00:00",
      username: "opal",
      channel: "shimizu",
      price: 12000,
   },
   {
      key: 2,
      date: "17/07/2023 12:00:00",
      username: "opal",
      channel: "yahoo",
      price: 13000,
   },
   {
      key: 3,
      date: "19/07/2023 05:00:00",
      username: "opal",
      channel: "mercari",
      price: 12500,
   },
   {
      key: 4,
      date: "20/07/2023 22:00:00",
      username: "opal",
      channel: "fril",
      price: 11000,
   },
]
function MoneyInPage() {
   const [loading, setLoading] = useState(false)
   const [selectedRowKeys, setSelectedRowKeys] = useState([])
   const [data, setData] = useState([])

   const handleSearch = async (params) => {
      setLoading(true)
      try {
         const searchData = await axios.get("/api/for-accountant", {
            params,
         })

         // Update the data state with the fetched results
         setData(
            searchData.data.moneyIns.map((item, index) => ({
               key: `MoneyIn_key_${index}`,
               ...item,
            }))
         )
      } catch (error) {
         console.error("Error fetching data:", error.message)
      } finally {
         setLoading(false)
      }
   }
   useEffect(() => {
      setLoading(true)
      setLoading(false)
   }, [])

   const columns = [
      {
         title: "วันที่",
         dataIndex: "date",
         key: "date",
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         key: "username",
      },
      {
         title: "ช่องทาง",
         dataIndex: "channel",
         key: "channel",
      },
      {
         title: "ราคา(บาท)",
         dataIndex: "price",
         key: "price",
      },
   ]

   const onSelectChange = (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys)
   }

   const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
   }

   const rowSelectionData = data.filter((fi) =>
      selectedRowKeys.includes(fi.key)
   )

   const THBath = new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
   })

   const sumPrice = rowSelectionData.reduce((acc, curr) => acc + curr.price, 0)

   return (
      <Fragment>
         <LoadingPage loading={loading} />
         <div className="p-4">
            <div className="bg-white rounded-lg p-4">
               <div className="font-bold text-[1.2rem] mb-4">
                  เลือกรายการเงินเข้า
               </div>
               <div>
                  <SearchFormAccountant onSearch={handleSearch} />
               </div>
               <Divider className="mt-0" />
               <Row gutter={16}>
                  <Col span={12}>
                     <Table
                        rowSelection={rowSelection}
                        // dataSource={data}
                        dataSource={data}
                        columns={columns}
                     />
                  </Col>
                  <Col span={12}>
                     <div className="w-full h-full">
                        <Divider orientation="left">
                           รวมยอดรายการเงินเข้า
                        </Divider>
                        <List
                           className="mb-3"
                           header={<div>รายการแทรกค์กิ้ง[opal]</div>}
                           footer={
                              <div className="w-full text-right">
                                 รวมยอด: {THBath.format(sumPrice)}
                              </div>
                           }
                           bordered
                           dataSource={rowSelectionData}
                           renderItem={(item, index) => (
                              <List.Item>
                                 <Row className="w-full">
                                    <Col span={4}>
                                       <Typography.Text>
                                          #{index + 1}
                                       </Typography.Text>
                                    </Col>
                                    <Col span={10}>
                                       <Typography.Text>
                                          {item.date}
                                       </Typography.Text>
                                    </Col>
                                    <Col span={4} className="text-center">
                                       <Tag color="magenta">{item.channel}</Tag>
                                    </Col>
                                    <Col span={6} className="text-right">
                                       <Typography.Text>
                                          {THBath.format(item.price)}
                                       </Typography.Text>
                                    </Col>
                                 </Row>
                              </List.Item>
                           )}
                        />
                        <div className="w-full flex justify-end">
                           <Button
                              disabled={selectedRowKeys.length === 0}
                              icon={<FileAddOutlined />}
                              type="primary"
                           >
                              สร้างรายการเงินเข้า
                           </Button>
                        </div>
                     </div>
                  </Col>
               </Row>
            </div>
         </div>
      </Fragment>
   )
}

MoneyInPage.getLayout = function getLayout(page) {
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

export default MoneyInPage
