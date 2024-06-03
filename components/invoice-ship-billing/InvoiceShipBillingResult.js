import { Table, Tabs } from "antd"
import React, { Fragment } from "react"

const TABLIST = [
   { label: "all", key: "TabItem_all" },
   { label: "unpaid", key: "TabItem_unpaid" },
   { label: "pickup", key: "TabItem_pickup" },
   { label: "toship", key: "TabItem_toship" },
   { label: "ship", key: "TabItem_ship" },
   { label: "finish", key: "TabItem_finish" },
]

export default function InvoiceShipBillingResult() {
   const onChange = (key) => {
      console.log(key)
   }

   const defaultColumns = [
      {
         title: "ลำดับ",
         key: "no",
         width: 65,
         align: "center",
        //  render: (_text, _record, index) =>
        //     (pagination.current - 1) * pagination.pageSize + index + 1,
      },
      {
        title: "username",
        key: "username",
      },
      {
        title: "สถานะ",
        key: "status"
      },
      {
        title: "ค่าเรือ",
        key: "voyagePrice"
      },
      {
        title: "ประเภทค่าใช้จ่าย",
        key: "payType"
      },
      {
        title: "วิธีจัดส่ง",
        key: "deliveryType"
      },
      {
        title: "จัดการ",
        key: "id"
      }
   ]

   const columns = defaultColumns.map((column, _index) => column)

   return (
      <Fragment>
         <Tabs onChange={onChange} type="card" items={TABLIST} />
         <Table columns={columns} />
      </Fragment>
   )
}
