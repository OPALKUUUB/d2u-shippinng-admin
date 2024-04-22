import { Fragment, useContext, useState } from "react"
import {
   Button,
   Card,
   Col,
   Divider,
   Modal,
   Row,
   Space,
   Table,
   Tag,
   Tooltip,
   message,
} from "antd"
import dayjs from "dayjs"
import {
   CheckCircleOutlined,
   ExclamationCircleOutlined,
   FileTextOutlined,
   SyncOutlined,
} from "@ant-design/icons"
import axios from "axios"
import { isEmpty } from "../../../utils/validate"
import ListMoneyInManualContext from "../../../context/ListMoneyInManualContext"
import MoneyInManualDetailTable from "./MoneyInManualDetailTable"
import PreviewImage from "../../PreviewImage/PreviewImage"
import { MONEY_IN_STATUS_OPTIONS } from "./ListMoneyInManualFilter"

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
         // width: 120,
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
         title: "สถานะ",
         dataIndex: "money_in_status",
         key: "money_in_status",
         render: (text) => {
            const statusOption = MONEY_IN_STATUS_OPTIONS.find(
               (option) => option.value === text
            )
            if (statusOption?.value === "SUCCESS") {
               return (
                  <Tag icon={<CheckCircleOutlined />} color="success">
                     {statusOption?.label}
                  </Tag>
               )
            } if (statusOption?.value === "WAITING") {
               return (
                  <Tag icon={<SyncOutlined spin />} color="processing">
                     {statusOption?.label}
                  </Tag>
               )
            }
         },
      },
      // {
      //    title: "ยอดชำระรวม(บาท)",
      //    key: "totalPrice",
      //    render: (_, record, _index) =>
      //       record?.moneyInItems
      //          ?.reduce(
      //             (sum, value) => sum + (parseFloat(value?.price) || 0),
      //             0
      //          )
      //          ?.toLocaleString("en-US", {
      //             minimumFractionDigits: 2,
      //             maximumFractionDigits: 2,
      //          }),
      // },
      {
         key: "operation",
         width: 60,
         fixed: "right",
         align: "center",
         render: (_, record) => (
            <Tooltip title="รายละเอียดรายการเงินเข้า">
               <Button
                  onClick={() => handleClickMoneyInDetail(record)}
                  type="primary"
                  title="รายละเอียด"
                  icon={<FileTextOutlined />}
               />
            </Tooltip>
         ),
      },
   ]

   const columns = defaultColumns.map((column, _index) => column)

   const renderMoneyInManualDialog = () => {
      const handleOkDialog = async (mnyId) => {
         try {
            if (!mnyId) return
            return await axios.put(
               `/api/for-accountant/money-in-manual/${mnyId}`,
               { money_in_status: "SUCCESS" }
            )
         } catch (error) {
            console.error(error)
         }
      }
      const handleConfirmMoneyInManual = () => {
         Modal.confirm({
            title: "ยืนยันการบันทึกรายการเงินเข้า",
            icon: <ExclamationCircleOutlined />,
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            async onOk() {
               try {
                  const response = await handleOkDialog(moneyInData?.mny_id)
                  if (response.data?.code === 200) {
                     message.success("เปลี่ยนสถานะการตรวจสอบสำเร็จ")
                     await handleSearchListMoneyInData(pagination)
                  }
               } catch (error) {
                  console.error(error)
                  message.error("เปลี่ยนสถานะการตรวจสอบล้มเหลว")
               } finally {
                  setShowMoneyInManualDialog(false)
               }
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
            width={1200}
            style={{ top: 15 }}
         >
            <Divider/>
            <Space align="start">
               <PreviewImage
                  width={300}
                  fileList={[{ url: moneyInData?.imageSlipUrl }]}
               />
               <Divider type="vertical" className="h-[500px]" />
               <Space direction="vertical">
                  <Card title="รายละเอียดรายการเงินเข้า" className="min-h-[500px]">
                     <MoneyInManualDetailTable dataSource={moneyInData} />
                  </Card>
               </Space>
            </Space>
            <Divider/>
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
               x: 800,
               y: 500,
            }}
         />
         {renderMoneyInManualDialog()}
      </Fragment>
   )
}

export default ListMoneyInManualTable
