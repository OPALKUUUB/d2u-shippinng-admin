import { useContext } from "react"
import { Button, Table } from "antd"
import Link from "next/link"
import dayjs from "dayjs"
import { FileTextOutlined } from "@ant-design/icons"
import { ListMoneyInManualContext } from "../ListMoneyInManualContext"
import { isEmpty } from "../../../../utils/validate"

function ListMoneyInManualTable() {
   const { listMoneyInData, handleSearchListMoneyInData, pagination } =
      useContext(ListMoneyInManualContext)

   const onChangePaginate = async (paginate) => {
      await handleSearchListMoneyInData({
         pageSize: paginate.pageSize,
         current: paginate.current,
      })
   }
   const defaultColumns = [
      {
         title: "ลำดับ",
         key: "no",
         width: 65,
         align: "center",
         render: (_text, _record, index) =>
            (pagination.current - 1) * pagination.pageSize + index + 1,
      },
      {
         title: "วันที่",
         dataIndex: "created_at",
         key: "createdAt",
         width: 120,
         render: (date) => dayjs(date).format("DD/MM/YYYY"),
      },
      {
         title: "ใบเสร็จ",
         dataIndex: "imageSlipUrl",
         key: "imageSlipUrl",
         render: (url) =>
            isEmpty(url) ? (
               "-"
            ) : (
               <Link href={url} target="_blank">
                  <img src={url} alt={url} height={100} />
               </Link>
            ),
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         key: "username",
      },
      {
         title: "ยอดชำระ",
         key: "totalPrice",
         render: (_, record, _index) => record?.moneyInItems
               ?.reduce(
                  (sum, value) => sum + (parseFloat(value?.price) || 0),
                  0
               )
               ?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
               }),
      },
      {
         key: "operation",
         width: 60,
         fixed: "right",
         align: "center",
         render: () => (
               <Button
                  type="primary"
                  title="รายละเอียด"
                  icon={<FileTextOutlined />}
               />
            ),
      },
   ]
   const columns = defaultColumns.map((column, _index) => column)
   return (
      <Table
         pagination={pagination}
         onChange={onChangePaginate}
         dataSource={listMoneyInData || []}
         columns={columns}
         scroll={{
            x: 1000,
         }}
      />
   )
}

export default ListMoneyInManualTable
