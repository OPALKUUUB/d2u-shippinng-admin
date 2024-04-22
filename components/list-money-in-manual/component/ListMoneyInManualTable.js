import { Fragment, useContext, useState } from "react"
import { Button, Modal, Table } from "antd"
import dayjs from "dayjs"
import { ExclamationCircleOutlined, FileTextOutlined } from "@ant-design/icons"
import { isEmpty } from "../../../utils/validate"
import ListMoneyInManualContext from "../../../context/ListMoneyInManualContext"
import MoneyInManualDetailTable from "./MoneyInManualDetailTable"
import PreviewImage from "../../PreviewImage/PreviewImage"

function ListMoneyInManualTable() {
   const { listMoneyInData, handleSearchListMoneyInData, pagination } =
      useContext(ListMoneyInManualContext)
   const [showMoneyInManualDialog, setShowMoneyInManualDialog] = useState(false)
   const [moneyInData, setMoneyInData] = useState()

   const onChangePaginate = async (paginate) => {
      await handleSearchListMoneyInData({
         pageSize: paginate.pageSize,
         current: paginate.current,
      })
   }

   const handleClickMoneyInDetail = (record) => {
      setMoneyInData(record)
      setShowMoneyInManualDialog(true)
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
         width: 120,
         render: (url) =>
            isEmpty(url) ? (
               "-"
            ) : (
               <PreviewImage width={100} fileList={[{ url }]} />
            ),
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         key: "username",
      },
      {
         title: "ยอดชำระรวม(บาท)",
         key: "totalPrice",
         render: (_, record, _index) =>
            record?.moneyInItems
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
         render: (_, record) => (
            <Button
               onClick={() => handleClickMoneyInDetail(record)}
               type="primary"
               title="รายละเอียด"
               icon={<FileTextOutlined />}
            />
         ),
      },
   ]

   const columns = defaultColumns.map((column, _index) => column)

   const renderMoneyInManualDialog = () => {
      const handleOkDialog = () => {
         console.log(moneyInData)
      }
      const handleConfirmMoneyInManual = () => {
         Modal.confirm({
            title: "ยืนยันการบันทึกรายการเงินเข้า",
            icon: <ExclamationCircleOutlined />,
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            onOk() {
               handleOkDialog()
               setShowMoneyInManualDialog(false)
            },
         })
      }
      return (
         <Modal
            title="รายละเอียดรายการเงินเข้า"
            open={showMoneyInManualDialog}
            onCancel={() => setShowMoneyInManualDialog(false)}
            onOk={handleConfirmMoneyInManual}
            okText="ยืนยันรายการเงินเข้า"
            cancelText="ยกเลิก"
            width={800}
         >
            <MoneyInManualDetailTable dataSource={moneyInData} />
         </Modal>
      )
   }

   return (
      <Fragment>
         <Table
            pagination={pagination}
            onChange={onChangePaginate}
            dataSource={listMoneyInData || []}
            columns={columns}
            scroll={{
               x: 1000,
            }}
         />
         {renderMoneyInManualDialog()}
      </Fragment>
   )
}

export default ListMoneyInManualTable
