import { Table } from "antd"
import { renderUnitFromChannel } from "../../../utils/validate"

function MoneyInManualDetailTable({ dataSource }) {
   const moneyInItems = dataSource?.moneyInItems
   const defaultColumns = [
      {
         title: "ลำดับ",
         key: "no",
         width: 65,
         align: "center",
         render: (_text, _record, index) => index + 1,
      },
      {
         title: "วันที่",
         dataIndex: "date",
         width: 180,
         editable: true,
         render: (text) => text || "-",
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "user",
         width: 200,
         render: (userObj, _record) => userObj?.username,
      },
      {
         title: "ช่องทาง",
         dataIndex: "channel",
         width: 160,
         editable: true,
      },
      {
         title: "ราคา",
         dataIndex: "price",
         align: "right",
         editable: true,
         width: 160,
         render: (price, _record) =>
            price !== ""
               ? parseFloat(price).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                 })
               : "-",
      },
      {
         title: "หน่วย",
         width: 50,
         align: "center",
         render: (_, record) => (
            <span className="font-extrabold">
               {renderUnitFromChannel(record?.channel)}
            </span>
         ),
      },
      {
         title: "หมายเหตุ",
         dataIndex: "remark",
         align: "center",
         editable: true,
         render: (text) => (text !== "" ? text : "-"),
      },
   ]
   const columns = defaultColumns.map((column, _index) => column)
   return <Table columns={columns} dataSource={moneyInItems} pagination={false} />
}

export default MoneyInManualDetailTable
