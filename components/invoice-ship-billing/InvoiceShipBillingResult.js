import {
   Button,
   Col,
   Form,
   Modal,
   Row,
   Select,
   Table,
   Tabs,
   message,
} from "antd"
import { useRouter } from "next/router"
import React, { Fragment, useContext, useEffect, useState } from "react"
import axios from "axios"
import {
   InvoiceShipBillingContext,
   TABLIST,
} from "../../context/InvoiceShipBillingContext"

const SHIP_BILLING_STATUS_OPTIONS = [
   { label: "unpaid", value: "unpaid" },
   { label: "toship", value: "toship" },
   { label: "pickup", value: "pickup" },
   { label: "ship", value: "ship" },
   { label: "finish", value: "finish" },
]

export default function InvoiceShipBillingResult() {
   const router = useRouter()
   const [showManageModal, setShowManageModal] = useState(false)
   const [selectRowData, setSelectRowData] = useState()
   const [loading, setLoading] = useState(false)

   const {
      _shipBillingData,
      _handleChangePaginaiton,
      _handleUpdateShipBillingStatus,
      _loading,
   } = useContext(InvoiceShipBillingContext)

   const [dataSource, setDataSource] = useState([])
   const [paging, setPaging] = useState({
      current: 1,
      pageSize: 10,
      total: 0,
      defaultPageSize: 10,
      pageSizeOptions: [10, 20, 50, 100],
      showSizeChanger: true,
   })

   const onChangePaging = async (pagination) => {
      try {
         await _handleChangePaginaiton(
            pagination.current - 1,
            pagination.pageSize
         )
      } catch (error) {
         console.log(error)
      }
   }

   const onChange = (key) => {
      const tabSelect = TABLIST.find((fi) => fi.key === key)
      router.push({ query: { ...router.query, tabSelect: tabSelect.label } })
   }

   const defaultColumns = [
      {
         title: "ลำดับ",
         key: "no",
         width: 65,
         align: "center",
         render: (_text, _record, index) =>
            (paging.current - 1) * paging.pageSize + index + 1,
      },
      {
         title: "username",
         key: "username",
         dataIndex: "username",
      },
      {
         title: "สถานะ",
         key: "shipBillingStatus",
         dataIndex: "shipBillingStatus",
      },
      {
         title: "ค่าเรือ",
         key: "voyagePrice",
         dataIndex: "voyagePrice",
         align: "right",
         render: (text) => {
            return text || "-"
         },
      },
      {
         title: "ประเภทค่าใช้จ่าย",
         key: "paymentType",
         dataIndex: "paymentType",
         render: (text) => {
            return text || "-"
         },
      },
      {
         title: "วิธีจัดส่ง",
         key: "deliveryType",
         dataIndex: "deliveryType",
         render: (text) => {
            return text || "-"
         },
      },
      {
         title: "จัดการ",
         align: "center",
         width: "250px",
         render: (_, record) => {
            const handleClickManage = () => {
               setSelectRowData(record)
               setShowManageModal(true)
            }
            const handleClickCreateInvoice = async () => {
               if (
                  record.shipBillingStatus === "unpaid" ||
                  record.shipBillingStatus === "ship"
               ) {
                  try {
                     const payload = {
                        shipBillingId: record.shipbillingId,
                        shipBillingStatus: record.shipBillingStatus,
                        userId: record.userId,
                     }
                     console.log(payload)
                     await axios
                        .post("/api/shipbilling/invoice", payload)
                        .then((res) => res.data)
                        .then((data) => {
                           window.open(data.link)
                        })
                  } catch (error) {
                     console.log(error)
                  }
               } else {
                  message.warning("สถานะต้องเป็น ship หรือ unpaid เท่านั้น")
               }
            }

            return (
               <Row>
                  <Col>
                     <Button onClick={handleClickManage}>จัดการ</Button>
                  </Col>
                  {(record.shipBillingStatus === "unpaid" ||
                     record.shipBillingStatus === "ship") && (
                     <Col>
                        <Button onClick={handleClickCreateInvoice}>
                           สร้างใบวางบิล
                        </Button>
                     </Col>
                  )}
               </Row>
            )
         },
      },
   ]

   const columns = defaultColumns.map((column, _index) => column)

   useEffect(() => {
      if (
         _shipBillingData?.results &&
         Array.isArray(_shipBillingData?.results)
      ) {
         setDataSource(
            _shipBillingData?.results?.map((item, index) => ({
               ...item,
               key: `ShipBillingItemKey_${index + 1}`,
            }))
         )
         const { current, pageSize, total } = _shipBillingData
         setPaging((prev) => ({
            ...prev,
            current: current + 1,
            pageSize,
            total,
         }))
      }
   }, [_shipBillingData])

   const renderManageRowModal = (title) => {
      const handleOk = async () => {
         try {
            setLoading(true)
            await _handleUpdateShipBillingStatus(
               selectRowData.shipBillingStatus,
               selectRowData.shipbillingId,
               paging.current - 1,
               paging.pageSize
            )
         } catch (error) {
            console.log(error)
         } finally {
            setLoading(false)
            setSelectRowData()
            setShowManageModal(false)
         }
      }
      const handleCancel = () => {
         setSelectRowData()
         setShowManageModal(false)
      }
      return (
         <Modal
            title={title}
            open={showManageModal}
            onCancel={handleCancel}
            onOk={handleOk}
            loading={!selectRowData}
            footer={[
               <Button
                  key="submit"
                  type="primary"
                  loading={loading}
                  onClick={handleOk}
               >
                  บันทึก
               </Button>,
               <Button key="cancel" disabled={loading} onClick={handleCancel}>
                  ยกเลิก
               </Button>,
            ]}
         >
            <Form>
               <Form.Item label="สถานะ">
                  <Select
                     value={selectRowData?.shipBillingStatus}
                     options={SHIP_BILLING_STATUS_OPTIONS}
                     onChange={(value) => {
                        setSelectRowData((prev) => ({
                           ...prev,
                           shipBillingStatus: value,
                        }))
                     }}
                  />
               </Form.Item>
            </Form>
         </Modal>
      )
   }

   return (
      <Fragment>
         <Tabs
            className="pb-0 h-[40px]"
            onChange={onChange}
            type="card"
            items={TABLIST}
         />
         <Table
            loading={_loading}
            scroll={{ x: 300 }}
            columns={columns}
            dataSource={dataSource}
            pagination={paging}
            onChange={onChangePaging}
         />
         {renderManageRowModal("จัดการข้อมูลการวางบิล")}
      </Fragment>
   )
}
