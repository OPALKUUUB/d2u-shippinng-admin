import { Table, message, Select } from "antd"
import { getSession } from "next-auth/react"
import React, { Fragment, useEffect, useState } from "react"
import { useRouter } from "next/router"
import CardHead from "../../components/CardHead"
import Layout from "../../components/layout/layout"

function ShipBilling() {
   const router = useRouter()
   const [data, setData] = useState([])
   const [voyageSelect, setVoyageSelect] = useState("เลือกรอบเรือ")
   const [items, setItems] = useState([])
   const handleChangeSelect = async (value) => {
      message.info(`voyage ${value}`)
      setVoyageSelect(value)
      try {
         const response = await fetch(`/api/shipbilling?voyage=${value}`)
         const responseJson = await response.json()
         console.log(responseJson.trackings)
         setData(
            responseJson.trackings.sort((a, b) => {
               if (a.username < b.username) {
                  return -1
               }
               if (a.username > b.username) {
                  return 1
               }
               return 0
            })
         )
      } catch (err) {
         console.log(err)
      }
   }
   const handleSelectRow = async (user_id) => {
      // console.log(voyageSelect, user_id)
      router.push(
         `/shipbilling/invoice?&voyage=${voyageSelect}&user_id=${user_id}`
      )
   }
   const columns = [
      {
         title: "วันที่",
         dataIndex: "created_at",
         width: "120px",
         key: "created_at",
      },
      {
         title: "username",
         dataIndex: "username",
         width: "120px",
         key: "username",
      },
      {
         title: "payment_type",
         dataIndex: "payment_type",
         width: "120px",
         key: "payment_type",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "invoice_notificate",
         dataIndex: "invoice_notificate",
         width: "120px",
         key: "invoice_notificate",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "check",
         dataIndex: "check",
         width: "120px",
         key: "check",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "remark",
         dataIndex: "remark",
         width: "120px",
         key: "remark",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "จัดการ",
         fixed: "right",
         dataIndex: "user_id",
         width: "80px",
         key: "user_id",
         render: (user_id) => (
            <button onClick={() => handleSelectRow(user_id)}>manage</button>
         ),
      },
   ]
   useEffect(() => {
      ;(async () => {
         const response = await fetch("/api/shipbilling/voyage")
         const responseJson = await response.json()
         setItems(
            responseJson.voyages
               .sort((a, b) => {
                  const date_a = a.voyage
                  const date_b = b.voyage
                  const date_a_f = date_a.split("/")
                  // [y,m,d]
                  const datetime_a_f = [
                     parseInt(date_a_f[2], 10) > 2500
                        ? parseInt(date_a_f[2], 10) - 543
                        : parseInt(date_a_f[2], 10),
                     parseInt(date_a_f[1], 10),
                     parseInt(date_a_f[0], 10),
                  ]
                  const date_b_f = date_b.split("/")
                  // [y,m,d]
                  const datetime_b_f = [
                     parseInt(date_b_f[2], 10) > 2500
                        ? parseInt(date_b_f[2], 10) - 543
                        : parseInt(date_b_f[2], 10),
                     parseInt(date_b_f[1], 10),
                     parseInt(date_b_f[0], 10),
                  ]

                  for (let i = 0; i < 3; i++) {
                     if (datetime_a_f[i] - datetime_b_f[i] !== 0) {
                        return datetime_b_f[i] - datetime_a_f[i]
                     }
                  }
                  return 0
               })
               .reduce(
                  (accumulator, currentValue) => [
                     ...accumulator,
                     { label: currentValue.voyage, value: currentValue.voyage },
                  ],
                  []
               )
         )
      })()
   }, [])
   return (
      <Fragment>
         <CardHead name="Ship Billing" />
         <div className="container-table">
            <Select
               size="middle"
               defaultValue={voyageSelect}
               onChange={handleChangeSelect}
               style={{ width: 200 }}
               options={items}
            />
            <div style={{ width: "100%" }}>
               <Table
                  dataSource={data}
                  columns={columns}
                  scroll={{
                     x: 1500,
                     y: 450,
                  }}
               />
            </div>
         </div>
         <style jsx>
            {`
               .container-table {
                  margin: 10px;
                  padding: 10px;
                  background: white;
               }
            `}
         </style>
      </Fragment>
   )
}

ShipBilling.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })
   // const api = `/api/shipbilling/voyage`
   // const response = await fetch(api)
   // const responseJson = await response.json()
   // const { voyages } = await responseJson
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
         // voyages,
         session,
      },
   }
}
export default ShipBilling
