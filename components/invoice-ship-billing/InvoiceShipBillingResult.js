import {
   Badge,
   Button,
   Card,
   Checkbox,
   Col,
   Collapse,
   Divider,
   Form,
   Input,
   InputNumber,
   List,
   Modal,
   Row,
   Select,
   Table,
   Tabs,
   Typography,
   message,
} from "antd"
import { useRouter } from "next/router"
import React, { Fragment, useContext, useEffect, useState } from "react"
import axios from "axios"
import { useSearchParams } from "next/navigation"
import {
   InvoiceShipBillingContext,
   TABLIST,
} from "../../context/InvoiceShipBillingContext"
import ReportInvoice from "../ReportInvoice"

const SHIP_BILLING_STATUS_OPTIONS = [
   { label: "unpaid", value: "unpaid" },
   { label: "keep", value: "keep" },
   { label: "toship", value: "toship" },
   { label: "pickup", value: "pickup" },
   { label: "ship", value: "ship" },
   { label: "finish", value: "finish" },
]

const STATUS = {
   TOSHIP: "toship",
   SHIP: "ship",
   FINISH: "finish",
   PICKUP: "pickup",
}

export default function InvoiceShipBillingResult() {
   const router = useRouter()
   const [showManageModal, setShowManageModal] = useState(false)
   const [selectRowData, setSelectRowData] = useState()
   const [loading, setLoading] = useState(false)
   const searchParams = useSearchParams()

   const {
      _shipBillingData,
      _handleChangePaginaiton,
      _handleUpdateShipBillingStatus,
      _handleUpdateInvoice,
      _loading,
   } = useContext(InvoiceShipBillingContext)

   const [dataSource, setDataSource] = useState([])
   const [paging, setPaging] = useState({
      current: 1,
      pageSize: 10,
      total: 0,
      defaultPageSize: 10,
      pageSizeOptions: [10, 20, 50, 100, 500, 10000],
      showSizeChanger: true,
   })

   const onChangePaging = async (pagination) => {
      try {
         await _handleChangePaginaiton(
            pagination.current - 1,
            pagination.pageSize,
            router.query?.tabSelect,
            router.query?.voyage
         )
      } catch (error) {
         console.log(error)
      }
   }

   const onChange = async (key) => {
      const tabSelect = TABLIST.find((fi) => fi.key === key)
      const voyage = router.query?.voyage
      try {
         await _handleChangePaginaiton(0, 10, tabSelect.label, voyage)
      } catch (error) {
         console.error(error)
      } finally {
         router.push(
            `/invoice-ship-billing?voyage=${voyage}&tabSelect=${tabSelect.label}`,
            undefined,
            { shallow: true }
         )
      }
   }

   const renderAddressInfo = (label, type, address) => (
      <div>
         <p>
            <span className="mr-2 font-bold">{label}:</span>
            {type || "-"}
         </p>
         <p>
            <span className="mr-2 font-bold">ที่อยู่:</span>
            {address || "-"}
         </p>
      </div>
   )

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
         title: "ที่อยู่",
         key: "contentData",
         dataIndex: "contentData",
         render: (text) => {
            if (!text) return "-"

            let contentData
            try {
               contentData = JSON.parse(text)
            } catch (e) {
               console.error("Failed to parse text:", e)
               return "-"
            }

            const { addressType, addAddressType, address, addAddress } =
               contentData

            return (
               <div>
                  {renderAddressInfo("ประเภทที่อยู่", addressType, address)}
                  {renderAddressInfo(
                     "ประเภทที่อยู่ 2",
                     addAddressType,
                     addAddress
                  )}
               </div>
            )
         },
      },
      {
         title: "checkbox ทั้งสองแล้ว",
         key: "isBothChecked",
         align: "center",
         width: 100,
         render: (_, record) => {
            let contentData
            try {
               contentData = JSON.parse(record.contentData)
            } catch (e) {
               console.error("Failed to parse text:", e)
               return "-"
            }
            const {
               isAddressDeliveryed = false,
               sendedTrackNoAndPriceAddress = false,
            } = contentData || {}

            const isBothChecked =
               isAddressDeliveryed && sendedTrackNoAndPriceAddress

            if (isBothChecked) {
               return <Badge text="เสร็จสิ้น" color="#52c41a" />
            }
            return <Badge text="รอตรวจสอบ" color="#faad14" />
         },
      },
      {
         title: "ชำระเงินหน้างาน",
         key: "isPickUp",
         dataIndex: "contentData",
         align: "center",
         width: 120,
         render: (text, record) => {
            if (!text) return "-"

            let contentData
            try {
               contentData = JSON.parse(text)
            } catch (e) {
               console.error("Failed to parse text:", e)
               return "-"
            }

            const { tabSelect } = router.query
            const {
               isAddressPickup,
               isAddAddressPickup,
               addressType,
               addAddressType,
            } = contentData

            const handleCheckIsPickUp = async (checked, key) => {
               try {
                  const payload = {
                     ...contentData,
                     [key]: checked,
                  }
                  await _handleUpdateInvoice(record.shipbillingId, payload)
                  message.success("checkbox จ่ายเงินหน้างานสำเร็จ")
               } catch (error) {
                  console.error(error)
               } finally {
                  await _handleChangePaginaiton(
                     paging.current - 1,
                     paging.pageSize,
                     router.query?.tabSelect,
                     router.query?.voyage
                  )
               }
            }

            if (tabSelect === "pickup") {
               const addressTypeList = ["พระราม3", "ร่มเกล้า"]
               const addressTypeIsPickup = addressTypeList.includes(addressType)
               const addAddressTypeIsPickup =
                  addressTypeList.includes(addAddressType)
               return (
                  <div className="flex flex-col justify-center items-center">
                     {addressTypeIsPickup && (
                        <Checkbox
                           // disabled={!enabled}
                           checked={isAddressPickup}
                           children="ที่อยู่ 1"
                           onChange={(e) =>
                              handleCheckIsPickUp(
                                 e.target.checked,
                                 "isAddressPickup"
                              )
                           }
                        />
                     )}
                     {addAddressTypeIsPickup && (
                        <Checkbox
                           // disabled={!enabled}
                           checked={isAddAddressPickup}
                           children="ที่อยู่ 2"
                           onChange={(e) =>
                              handleCheckIsPickUp(
                                 e.target.checked,
                                 "isAddAddressPickup"
                              )
                           }
                        />
                     )}
                  </div>
               )
            }
            return "-"
         },
      },
      {
         title: "สถานะการตรวจสอบ Slip",
         key: "slipStatus",
         dataIndex: "slipStatus",
         align: "center",
         width: 130,
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
               if (record.shipBillingStatus === "unpaid") {
                  if (record?.shipbillingId === null) {
                     return message.warning(
                        "ไม่สามารถสร้างใบวางบิลได้ เนื่องจากรายนี้ยังไม่ถูกสร้างใน shipbilling"
                     )
                  }
                  setLoading(true)
                  try {
                     const payload = {
                        shipBillingId: record.shipbillingId,
                        shipBillingStatus: record.shipBillingStatus,
                        userId: record.userId,
                     }
                     await axios
                        .post("/api/shipbilling/invoice", payload)
                        .then((res) => res.data)
                        .then((data) => {
                           window.open(data.link)
                        })
                     await _handleChangePaginaiton(
                        paging.current - 1,
                        paging.pageSize,
                        router.query?.tabSelect,
                        router.query?.voyage
                     )
                  } catch (error) {
                     console.log(error)
                  } finally {
                     setLoading(false)
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
                  {record.shipBillingStatus === "unpaid" && (
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

   const columns = defaultColumns
      .filter((column, _index) => {
         const tabSelect = router.query?.tabSelect || "all"

         if (tabSelect !== "pickup") {
            if (["isPickUp"].some((fi) => fi === column.key)) return false
         }
         if (!["ship", "toship"].some((fi) => fi === tabSelect)) {
            if (["isBothChecked"].some((fi) => fi === column.key)) return false
         }
         if (!["pickup", "ship", "toship", "keep"].some((fi) => fi === tabSelect)) {
            if (["slipStatus"].some((fi) => fi === column.key)) {
               return false
            }
         }
         return true
      })
      .map((column, _index) => column)

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
      const addressTypeList = [
         "D2U เรียกรถให้ หรือ Grab",
         "ขนส่ง",
         "ไปรษณี(EMS)",
      ]
      const addressPickupTypeList = ["ร่มเกล้า", "พระราม3"]
      const contentData = selectRowData?.contentData
         ? JSON.parse(selectRowData?.contentData)
         : {}
      const {
         addressType,
         addAddressType,
         isAddressDeliveryed,
         isAddAddressDeliveryed,
         sendedTrackNoAndPriceAddress,
         sendedTrackNoAndPriceAddAddress,
      } = contentData
      const isAddressTypeIsToShip = addressTypeList.includes(addressType)
      const isAddAddressTypeIsToShip = addressTypeList.includes(addAddressType)
      const isAddressTypeIsPickup = addressPickupTypeList.includes(addressType)
      const isAddAddressTypeIsPickup =
         addressPickupTypeList.includes(addAddressType)

      const addressTrackNo = contentData?.addressTrackNo || ""
      const addAddressTrackNo = contentData?.addAddressTrackNo || ""
      const addressPrice = contentData?.addressPrice || ""
      const addAddressPrice = contentData?.addAddressPrice || ""
      const trackingPriceList1 = contentData?.trackingPriceList1 || []
      const trackingPriceList2 = contentData?.trackingPriceList2 || []
      const updateShipBillingStatus = async (newStatus) => {
         await _handleUpdateShipBillingStatus(
            newStatus,
            selectRowData.shipbillingId
         )
         await _handleChangePaginaiton(
            paging.current - 1,
            paging.pageSize,
            router.query.tabSelect,
            router.query.voyage
         )
      }

      const confirmUpdate = (newStatus) => {
         Modal.confirm({
            title: "โปรดยืนยันการเปลี่ยนสถานะ",
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            onOk: async () => {
               await updateShipBillingStatus(newStatus)
            },
         })
      }
      const onChangeTracking = (value, key) => {
         setSelectRowData((prev) => ({
            ...prev,
            contentData: JSON.stringify({
               ...JSON.parse(selectRowData?.contentData),
               [key]: value,
            }),
         }))
      }
      const onChangePrice = (value, key) => {
         setSelectRowData((prev) => ({
            ...prev,
            contentData: JSON.stringify({
               ...JSON.parse(selectRowData?.contentData),
               [key]: value,
            }),
         }))
      }
      const onAddTrackingList = (mode) => {
         const trackingPriceListVal =
            contentData[`trackingPriceList${mode}`] || []
         const addressTrackNo = contentData?.addressTrackNo
         const addressPrice = contentData?.addressPrice
         setSelectRowData((prev) => ({
            ...prev,
            contentData: JSON.stringify({
               ...contentData,
               addressTrackNo: "",
               addressPrice: "",
               [`trackingPriceList${mode}`]: [
                  ...trackingPriceListVal,
                  { trackingNo: addressTrackNo, price: addressPrice },
               ],
            }),
         }))
      }
      const handleCheckDeliveryed = (checked, key) => {
         Modal.confirm({
            title: "ยืนยันการ checkbox จัดส่งแล้ว",
            content: `จะทำการส่งข้อความไปหาลูกค้าว่า\n
                  "ทาง d2u ได้ทำการส่ง
                  พัสดุให้ทาง ลคเรียบร้อยแล้ว กรุณารอแทร็กกิ้งและราคาภายใน 24
                  ชั่วโมง"
                  และทำการเปลี่ยนสถานะเป็น ship`,

            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            onOk: async () => {
               try {
                  const payload = {
                     ...contentData,
                     [key]: checked,
                     apiFlag: key,
                  }
                  await _handleUpdateInvoice(
                     selectRowData.shipbillingId,
                     payload
                  )
                  const temp = selectRowData.shipBillingStatus.split("/")
                  if (
                     temp.length === 2 &&
                     temp[0] === STATUS.TOSHIP &&
                     temp[1] === STATUS.SHIP &&
                     !checked
                  ) {
                     await _handleUpdateShipBillingStatus(
                        [temp[0], STATUS.TOSHIP].join("/"),
                        selectRowData.shipbillingId
                     )
                  } else {
                     await _handleUpdateShipBillingStatus(
                        selectRowData.shipBillingStatus.replace(
                           checked ? STATUS.TOSHIP : STATUS.SHIP,
                           checked ? STATUS.SHIP : STATUS.TOSHIP
                        ),
                        selectRowData.shipbillingId
                     )
                  }
                  await _handleChangePaginaiton(
                     paging.current - 1,
                     paging.pageSize,
                     router.query?.tabSelect,
                     router.query?.voyage
                  )
               } catch (error) {
                  console.error(error)
               } finally {
                  setShowManageModal(false)
                  setSelectRowData(undefined)
                  await _handleChangePaginaiton(
                     paging.current - 1,
                     paging.pageSize,
                     router.query?.tabSelect,
                     router.query?.voyage
                  )
                  message.info("ได้ทำการ checkbox สำเร็จ")
               }
            },
         })
      }
      const handleClickSendLink = (checked, key) => {
         Modal.confirm({
            title: "ยืนยันการส่งเลข tracking และ ราคา",
            okText: "ยืนยัน",
            cancelText: "ยกเลิก",
            onOk: async () => {
               try {
                  const payload = {
                     ...contentData,
                     [key]: checked,
                     apiFlag: key,
                  }
                  await _handleUpdateInvoice(
                     selectRowData.shipbillingId,
                     payload
                  )
                  await _handleChangePaginaiton(
                     paging.current - 1,
                     paging.pageSize,
                     router.query?.tabSelect,
                     router.query?.voyage
                  )
               } catch (error) {
                  console.error(error)
               } finally {
                  setShowManageModal(false)
                  setSelectRowData(undefined)
                  await _handleChangePaginaiton(
                     paging.current - 1,
                     paging.pageSize,
                     router.query?.tabSelect,
                     router.query?.voyage
                  )
                  message.info("ได้ทำการ checkbox สำเร็จ")
               }
            },
         })
      }
      const handleOk = async () => {
         try {
            setLoading(true)

            const lastShipBillingStatus = dataSource.find(
               (fi) => fi.shipbillingId === selectRowData.shipbillingId
            )

            const updateStatus = selectRowData.shipBillingStatus
            const lastStatus = lastShipBillingStatus?.shipBillingStatus || "-"

            if (updateStatus === STATUS.FINISH) {
               if (router.query?.tabSelect === STATUS.SHIP) {
                  const temp = lastStatus.split("/")
                  if (
                     temp.length === 2 &&
                     temp[0] === STATUS.SHIP &&
                     temp[1] === STATUS.SHIP
                  ) {
                     confirmUpdate([updateStatus, temp[1]].join("/"))
                  } else {
                     confirmUpdate(
                        lastStatus.replace(STATUS.SHIP, updateStatus)
                     )
                  }
               } else if (
                  router.query?.tabSelect === STATUS.PICKUP &&
                  lastStatus.includes(STATUS.PICKUP)
               ) {
                  const temp = lastStatus.split("/")
                  if (
                     temp.length === 2 &&
                     temp[0] === STATUS.PICKUP &&
                     temp[1] === STATUS.PICKUP
                  ) {
                     confirmUpdate([updateStatus, temp[1]].join("/"))
                  } else {
                     confirmUpdate(
                        lastStatus.replace(STATUS.PICKUP, updateStatus)
                     )
                  }
               }
            } else {
               confirmUpdate(updateStatus)
            }

            await _handleUpdateInvoice(
               selectRowData.shipbillingId,
               JSON.parse(selectRowData?.contentData)
            )

            await _handleChangePaginaiton(
               paging.current - 1,
               paging.pageSize,
               router.query?.tabSelect,
               router.query?.voyage
            )
         } catch (error) {
            console.log(error)
         } finally {
            setLoading(false)
            setSelectRowData(undefined)
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
            <Divider />
            <Form
               name="ManageRowInvoiceForm"
               labelCol={{
                  span: 4,
               }}
            >
               {router.query?.tabSelect !== "toship" && (
                  <Form.Item label="สถานะ" className="text-left">
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
               )}

               {router.query?.tabSelect?.includes("ship") && (
                  <>
                     {isAddressTypeIsToShip && (
                        <>
                           <Card className="mb-2">
                              <Row>
                                 <Col>ที่อยู่ 1: </Col>
                                 <Col>{contentData?.address}</Col>
                              </Row>
                              <Row>
                                 Box No. :{" "}
                                 {Object.keys(contentData?.groupTrackingList)
                                    .map((key) =>
                                       contentData?.groupTrackingList[key]
                                          .map(
                                             (item) =>
                                                item
                                                   .split("-")[0]
                                                   .split("Box No. ")[1]
                                          )
                                          .join(", ")
                                    )
                                    .join(", ")}
                              </Row>
                           </Card>
                           <Form.Item label="เลขแทร็คกิ้ง">
                              <Input
                                 onChange={(e) =>
                                    onChangeTracking(
                                       e.target.value,
                                       "addressTrackNo"
                                    )
                                 }
                                 value={addressTrackNo}
                                 placeholder="xxx-xxx-xxx"
                              />
                           </Form.Item>
                           <Form.Item label="ราคา">
                              <InputNumber
                                 addonAfter="บาท"
                                 value={addressPrice}
                                 onChange={(e) =>
                                    onChangePrice(e, "addressPrice")
                                 }
                                 placeholder="x,xxx.xx"
                                 style={{ width: "100%" }}
                              />
                           </Form.Item>
                           <Form.Item>
                              <Button onClick={() => onAddTrackingList(1)}>
                                 เพิ่ม
                              </Button>
                           </Form.Item>
                           <List
                              bordered
                              dataSource={trackingPriceList1}
                              renderItem={(item) => (
                                 <List.Item>
                                    <Typography.Text mark>
                                       [{item.trackingNo}]
                                    </Typography.Text>{" "}
                                    {item.price}
                                 </List.Item>
                              )}
                           />
                           <Form.Item>
                              <Checkbox
                                 checked={isAddressDeliveryed}
                                 children="จัดส่งแล้ว"
                                 onChange={(e) =>
                                    handleCheckDeliveryed(
                                       e.target.checked,
                                       "isAddressDeliveryed"
                                    )
                                 }
                              />
                           </Form.Item>
                           <Form.Item>
                              <Checkbox
                                 checked={sendedTrackNoAndPriceAddress}
                                 children="ส่งเลขแทร็กกิ้ง และ ราคา"
                                 onChange={(e) =>
                                    handleClickSendLink(
                                       e.target.checked,
                                       "sendedTrackNoAndPriceAddress"
                                    )
                                 }
                              />
                           </Form.Item>
                        </>
                     )}
                     {isAddAddressTypeIsToShip && (
                        <>
                           <Card className="mb-2">
                              <Row>
                                 <Col>ที่อยู่ 2: </Col>
                                 <Col>{contentData?.addAddress}</Col>
                              </Row>
                              <Row>
                                 <Col>
                                    {JSON.stringify(
                                       contentData?.groupTrackingListOther
                                    )}
                                 </Col>
                              </Row>
                           </Card>
                           <Form.Item label="เลขแทร็คกิ้ง">
                              <Input
                                 value={addAddressTrackNo}
                                 onChange={(e) =>
                                    onChangeTracking(
                                       e.target.value,
                                       "addAddressTrackNo"
                                    )
                                 }
                                 placeholder="xxx-xxx-xxx"
                              />
                           </Form.Item>
                           <Form.Item label="ราคา">
                              <InputNumber
                                 value={addAddressPrice}
                                 addonAfter="บาท"
                                 onChange={(e) =>
                                    onChangePrice(e, "addAddressPrice")
                                 }
                                 placeholder="x,xxx.xx"
                                 style={{ width: "100%" }}
                              />
                           </Form.Item>
                           <Form.Item>
                              <Button onClick={() => onAddTrackingList(2)}>
                                 เพิ่ม
                              </Button>
                           </Form.Item>
                           <List
                              bordered
                              dataSource={trackingPriceList2}
                              renderItem={(item) => (
                                 <List.Item>
                                    <Typography.Text mark>
                                       [{item.trackingNo}]
                                    </Typography.Text>{" "}
                                    {item.price}
                                 </List.Item>
                              )}
                           />
                           <Form.Item>
                              <Checkbox
                                 children="จัดส่งแล้ว"
                                 checked={isAddAddressDeliveryed}
                                 onChange={(e) =>
                                    handleCheckDeliveryed(
                                       e.target.checked,
                                       "isAddAddressDeliveryed"
                                    )
                                 }
                              />
                           </Form.Item>
                           <Form.Item>
                              <Checkbox
                                 checked={sendedTrackNoAndPriceAddAddress}
                                 children="ส่งเลขแทร็กกิ้ง และ ราคา"
                                 onChange={(e) =>
                                    handleClickSendLink(
                                       e.target.checked,
                                       "sendedTrackNoAndPriceAddAddress"
                                    )
                                 }
                              />
                           </Form.Item>
                        </>
                     )}
                  </>
               )}
               {router.query?.tabSelect?.includes("pickup") && (
                  <>
                     {isAddressTypeIsPickup && (
                        <>
                           <Card className="mb-2">
                              <Row>
                                 <Col>ที่อยู่ 1: </Col>
                                 <Col>{contentData?.address}</Col>
                              </Row>
                              <Row>
                                 <Col>
                                    {JSON.stringify(
                                       contentData?.groupTrackingList
                                    )}
                                 </Col>
                              </Row>
                           </Card>
                        </>
                     )}
                     {isAddAddressTypeIsPickup && (
                        <>
                           <Card className="mb-2">
                              <Row>
                                 <Col>ที่อยู่ 2: </Col>
                                 <Col>{contentData?.addAddress}</Col>
                              </Row>
                              <Row>
                                 <Col>
                                    {JSON.stringify(
                                       contentData?.groupTrackingListOther
                                    )}
                                 </Col>
                              </Row>
                           </Card>
                        </>
                     )}
                  </>
               )}
            </Form>
            <Divider />
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
            defaultActiveKey="unpaid"
            activeKey={
               searchParams.has("tabSelect")
                  ? searchParams.get("tabSelect")
                  : "unpaid"
            }
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
         <Collapse accordion className="mt-3">
            <Collapse.Panel header="ดูสรุปข้อมูล(PDF)">
               <ReportInvoice data={dataSource} />
            </Collapse.Panel>
         </Collapse>
      </Fragment>
   )
}
