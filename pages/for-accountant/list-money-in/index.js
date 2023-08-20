/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-unresolved */
import React, { Fragment, useEffect, useState } from "react"
import { getSession } from "next-auth/react"
import { Button, Col, Divider, Row, Table } from "antd"
import axios from "axios"
import dayjs from "dayjs"
import Link from "next/link"
import Layout from "../../../components/layout/layout"
import LoadingPage from "../../../components/LoadingPage"
import ListMoneyInModal from "../../../components/ListMoneyInModal"

function ListMoneyInPage() {
   const [loading, setLoading] = useState(false)
   const [data, setData] = useState([])
   const [modalVisible, setModalVisible] = useState(false) // State to control modal visibility
   const [selectedMiId, setSelectedMiId] = useState(null) // State to store selected mi_id
   const [fetchDataTrigger, setFetchDataTrigger] = useState(false)

   const fetchMoneyInData = async () => {
      setLoading(true)
      try {
         const response = await axios.get("/api/for-accountant/money-in")
         const responseData = await response.data.data
         setData(
            responseData.map((item, index) => ({
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

   const handleDetailClick = (mi_id) => {
      setModalVisible(true)
      setSelectedMiId(mi_id) // Store the selected mi_id in state
   }

   useEffect(() => {
      fetchMoneyInData()
   }, [fetchDataTrigger])

   const columns = [
      {
         title: "วันที่",
         dataIndex: "created_at",
         key: "created_at",
         render: (datetime) => dayjs(datetime).format("DD/MM/YYYY"),
      },
      {
         title: "username",
         dataIndex: "username",
         key: "username",
      },
      {
         title: "สลิป",
         dataIndex: "image",
         key: "image",
         render: (url) =>
            url === "" || url === null ? (
               "-"
            ) : (
               <Link href={url} target="_blank">
                  <img src={url} alt={url} height={100} />
               </Link>
            ),
      },
      {
         title: "ประเภทการชำระเงิน",
         dataIndex: "payment_type",
         key: "payment_type",
      },
      {
         title: "วันที่ชำระเงิน",
         dataIndex: "datetime",
         key: "datetime",
      },
      {
         title: "จำนวนเงิน(บาท)",
         dataIndex: "total",
         key: "total",
      },
      {
         title: "หมายเหตุ",
         dataIndex: "remark",
         key: "remark",
      },
      {
         title: "รายละเอียด",
         key: "detail",
         render: (row) => {
            const mi_id = row.id
            return (
               <Button onClick={() => handleDetailClick(mi_id)}>Detail</Button>
            )
         },
      },
   ]

   return (
      <Fragment>
         <LoadingPage loading={loading} />
         <div className="p-4">
            <div className="bg-white rounded-lg p-4">
               <div className="font-bold text-[1.2rem] mb-4">
                  รายการเงินเข้าทั้งหมด
               </div>
               <Divider className="mt-0" />
               <Row gutter={16}>
                  <Col span={24}>
                     <Table dataSource={data} columns={columns} />
                  </Col>
               </Row>
            </div>
         </div>
         <ListMoneyInModal
            miId={selectedMiId}
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            setFetchDataTrigger={setFetchDataTrigger}
         />
      </Fragment>
   )
}

ListMoneyInPage.getLayout = function getLayout(page) {
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

export default ListMoneyInPage
