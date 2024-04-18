/* eslint-disable import/no-named-as-default */
import React, { Fragment, useState } from "react"
import { getSession } from "next-auth/react"
import { Col, Divider, List, Row, Table, Tag, Typography, message } from "antd"
import axios from "axios"
import Layout from "../../../components/layout/layout"
import SearchFormAccountant from "../../../components/SearchFormAccountant"
import LoadingPage from "../../../components/LoadingPage"
import CreateMoneyInForm from "../../../components/CreateMoneyInForm"

function MoneyInPage() {
   const [loading, setLoading] = useState(false)
   const [selectedRowKeys, setSelectedRowKeys] = useState([])
   const [data, setData] = useState([])
   const [trigger, setTrigger] = useState(false)

   const handleSearch = async (params) => {
      setLoading(true)
      try {
         const searchData = await axios.get("/api/for-accountant", {
            params,
         })
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
         setSelectedRowKeys([])
      }
   }

   const handleAddMoneyIn = async (moneyInForm) => {
      setLoading(true)
      try {
         console.log(moneyInForm)
         const rowSelectionDataList = data.filter((fi) =>
            selectedRowKeys.includes(fi.key)
         )
         const { user_id } = data.filter((fi) =>
            selectedRowKeys.includes(fi.key)
         )[0]
         await axios.post("/api/for-accountant/money-in", {
            moneyInForm,
            user_id,
            rowSelectionDataList,
         })
         message.success("เพิ่มรายการเงินเข้าสำเร็จ")
      } catch (error) {
         console.error("Error fetching data:", error.message)
         message.error("เพิ่มรายการเงินเข้าล้มเหลว")
      } finally {
         setTrigger(!trigger)
         setLoading(false)
      }
   }

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

               {/* Search Form */}
               <SearchFormAccountant
                  onSearch={handleSearch}
                  trigger={trigger}
               />

               <Divider className="mt-0" />
               <Row gutter={16}>
                  <Col span={12}>
                     <Table
                        rowSelection={rowSelection}
                        dataSource={data}
                        columns={columns}
                     />
                  </Col>
                  <Col span={12}>
                     <Col span={24}>
                        <Divider orientation="left">
                           รวมยอดรายการเงินเข้า
                        </Divider>
                        <List
                           className="mb-3"
                           header={<div>รายการแทรกค์กิ้ง</div>}
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
                     </Col>
                     <Col span={24}>
                        <CreateMoneyInForm
                           selectedRowKeys={selectedRowKeys}
                           onCreateMoneyInList={handleAddMoneyIn}
                        />
                     </Col>
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
