import { Button, Table, Dropdown, message, Space, Select } from "antd"
import { DownOutlined } from "@ant-design/icons"
import { getSession } from "next-auth/react"
import React, { Fragment, useState } from "react"
import { useRouter } from "next/router"
import CardHead from "../../components/CardHead"
import Layout from "../../components/layout/layout"

function ShipBilling(props) {
   const router = useRouter()
   const { voyages } = props
   const [data, setData] = useState([])
   const [voyageSelect, setVoyageSelect] = useState("เลือกรอบเรือ")
   const items = voyages.reduce(
      (accumulator, currentValue) => [
         ...accumulator,
         { label: currentValue.voyage, value: currentValue.voyage },
      ],
      []
   )
   const handleChangeSelect = async (value) => {
      message.info(`voyage ${value}`)
      setVoyageSelect(value)
      try {
         const response = await fetch(`/api/shipbilling?voyage=${value}`)
         const responseJson = await response.json()
         // console.log(responseJson.trackings)
         setData(responseJson.trackings)
      } catch (err) {
         console.log(err)
      }
   }
   const handleSelectRow = async ( voyage, user_id) => {
      console.log( voyage, user_id)
      router.replace(
         `/shipbilling/invoice?&voyage=${voyage}&user_id=${user_id}`
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
         dataIndex: "id",
         width: "80px",
         key: "id",
         render: (id) => {
            const tracking_id = id
            const voyage = voyageSelect
            return (
               <button
                  onClick={() =>
                     handleSelectRow(
                        voyage,
                        data.filter((ft) => ft.id === tracking_id)[0].user_id
                     )
                  }
               >
                  manage
               </button>
            )
         },
      },
   ]
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
   const api = `/api/shipbilling/voyage`
   const response = await fetch(api)
   const responseJson = await response.json()
   const { voyages } = await responseJson
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
         voyages,
      },
   }
}
export default ShipBilling
