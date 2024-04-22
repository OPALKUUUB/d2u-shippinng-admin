import dayjs from "dayjs"
import React, { useContext, useEffect, useRef, useState } from "react"
import {
   Form,
   Button,
   Table,
   Typography,
   Input,
   Select,
   message,
   DatePicker,
   Modal,
   InputNumber,
} from "antd"
import {
   DeleteOutlined,
   ExclamationCircleFilled,
   PlusCircleOutlined,
} from "@ant-design/icons"
import css from "./MoneyInManual.module.css"
import MoneyInManualContext from "../../../context/MoneyInManualContext"
import { renderUnitFromChannel } from "../../../utils/validate"

const { Text } = Typography
const { TextArea } = Input

const keyDatasourceItem = "MoneyInManualFormTable_DATASOURCE_ITEM_"
const DATASOURCE_ITEM = {
   key: `${keyDatasourceItem}${1}`,
   index: 1,
   date: dayjs(new Date()).format("DD/MM/YYYY"),
   user: {
      username: "",
      userId: "",
   },
   channel: "",
   price: "",
   rateYenToBath: 0.24,
   remark: "",
}

const EditableRow = ({ index, ...props }) => {
   const { form } = useContext(MoneyInManualContext)
   return (
      <Form form={form} component={false}>
         <tr {...props} />
      </Form>
   )
}

const EditableCell = ({
   title,
   editable,
   children,
   dataIndex,
   record,
   handleSave,
   ...restProps
}) => {
   const [editing, setEditing] = useState(false)
   const inputRef = useRef(null)
   const { form } = useContext(MoneyInManualContext)
   useEffect(() => {
      if (editing) {
         inputRef.current?.focus()
      }
   }, [editing])
   const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({
         [dataIndex]:
            dataIndex === "date"
               ? dayjs(record[dataIndex], "DD/MM/YYYY")
               : record[dataIndex],
      })
   }
   const save = async () => {
      try {
         const values = await form.validateFields()
         if (dataIndex === "date" && values[dataIndex] !== null) {
            values[dataIndex] = values[dataIndex].format("DD/MM/YYYY")
         } else if (values[dataIndex] === null) {
            values[dataIndex] = dayjs(new Date()).format("DD/MM/YYYY")
         }
         toggleEdit()
         handleSave({
            ...record,
            ...values,
         })
      } catch (errInfo) {
         console.error("Save failed:", errInfo)
      }
   }
   const renderFormItem = () => {
      switch (title) {
         case "ช่องทาง":
            const channelOptions = [
               { label: "กรุณาเลือก", value: "" },
               { label: "Mercari", value: "mercari" },
               { label: "Fril", value: "fril" },
               { label: "Web123", value: "123" },
               { label: "Yahoo", value: "yahoo" },
               { label: "Ship Billing", value: "ship_billing" },
               { label: "ขนส่งในประเทศ", value: "ขนส่งเอกชน(ที่อยู่ ลค.)" },
               { label: "Cargo", value: "cargo" },
            ]
            return (
               <Form.Item
                  rules={[
                     {
                        required: true,
                        message: "กรุณาเลือกช่องทาง",
                     },
                  ]}
                  className="m-0"
                  name={dataIndex}
               >
                  <Select
                     options={channelOptions}
                     placeholder="เลือกช่องทาง"
                     ref={inputRef}
                     onBlur={save}
                  />
               </Form.Item>
            )
         case "ราคา":
            return (
               <Form.Item
                  rules={[
                     {
                        required: true,
                        message: "กรุณากรอกราคา",
                     },
                  ]}
                  className="m-0"
                  name={dataIndex}
               >
                  <InputNumber
                     className="w-full"
                     type="number"
                     placeholder="กรอกจำนวนเงิน"
                     ref={inputRef}
                     onPressEnter={save}
                     onBlur={save}
                  />
               </Form.Item>
            )
         case "วันที่":
            return (
               <Form.Item className="m-0" name={dataIndex}>
                  <DatePicker
                     format="DD/MM/YYYY"
                     placeholder="กรอกวันที่และเวลา"
                     ref={inputRef}
                     onBlur={save}
                  />
               </Form.Item>
            )
         case "หมายเหตุ":
            return (
               <Form.Item name="remark">
                  <TextArea
                     placeholder="กรอกหมายเหตุ..."
                     ref={inputRef}
                     onPressEnter={save}
                     onBlur={save}
                  />
               </Form.Item>
            )
      }
   }
   let childNode = children
   if (editable) {
      childNode = editing ? (
         renderFormItem()
      ) : (
         <div
            className={css.editableCellValueWrap}
            style={{
               paddingRight: 24,
            }}
            onClick={toggleEdit}
         >
            {children}
         </div>
      )
   }
   return <td {...restProps}>{childNode}</td>
}

function MoneyInManualFormTable() {
   const { form, user, dataSource, setDataSource, rateYenToBath, setRateYenToBath } =
      useContext(MoneyInManualContext)
   const userIdWatch = Form.useWatch("userId", form)

   const handleSave = (data) => {
      setDataSource((prev) => {
         const dataEditIndex = prev.findIndex((fi) => fi.key === data.key)
         if (dataEditIndex === -1) return prev
         const newDataSource = [
            ...prev.slice(0, dataEditIndex),
            { ...data },
            ...prev.slice(dataEditIndex + 1),
         ]
         return newDataSource
      })
   }

   const handleAddRow = () => {
      setDataSource((prev) => {
         const lastItemNo = prev.length
         if (lastItemNo === 0 && user?.username) {
            return [{ ...DATASOURCE_ITEM, user }]
         }
         const newItem = {
            ...prev[lastItemNo - 1],
            key: `${keyDatasourceItem}${lastItemNo + 1}`,
            index: lastItemNo + 1,
         }
         const newDataSource = [...prev, newItem]
         return newDataSource
      })
   }
   const handleConfirmDeleteRow = (keyDelete, index) => {
      Modal.confirm({
         title: "ยืนยันการลบรายการ",
         content: `รายการเงินเข้าลำดับที่ ${index}`,
         icon: <ExclamationCircleFilled />,
         okText: "ตกลง",
         cancelText: "ยกเลิก",
         onOk() {
            handleDeleteRow(keyDelete)
         },
      })
   }

   const handleDeleteRow = (keyDelete) => {
      setDataSource((prev) => {
         const dataDeleteIndex = prev.findIndex((fi) => fi.key === keyDelete)
         if (dataDeleteIndex === -1) {
            message.warning("กรุณาทำรายการใหม่อีกครั้ง เนื่องจากระบบขัดข้อง")
            return prev
         }
         const newDataSource = [
            ...prev.slice(0, dataDeleteIndex),
            ...prev.slice(dataDeleteIndex + 1),
         ].map((item, index) => ({ ...item, index: index + 1 }))
         return newDataSource
      })
   }

   const components = {
      body: {
         row: EditableRow,
         cell: EditableCell,
      },
   }

   const defaultColumns = [
      {
         title: "ลำดับที่",
         dataIndex: "index",
         width: 75,
         align: "center",
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
         render: (text) =>
            text !== "" ? (
               text
            ) : (
               <div className="text-blue-600 text-center w-full">
                  Click to edit
               </div>
            ),
      },
      {
         title: "ราคา",
         dataIndex: "price",
         align: "right",
         editable: true,
         width: 160,
         render: (price, _record) =>
            price !== "" ? (
               parseFloat(price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
               })
            ) : (
               <div className="text-blue-600 text-center w-full">
                  Click to edit
               </div>
            ),
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
         render: (text) =>
            text !== "" ? (
               text
            ) : (
               <div className="text-blue-600 text-center w-full">
                  Click to edit
               </div>
            ),
      },
      {
         dataIndex: "operation",
         width: 100,
         align: "center",
         render: (_, record) => {
            const keyRecord = record?.key
            return (
               <Button
                  title="ลบรายการ"
                  icon={<DeleteOutlined />}
                  size="sm"
                  type="primary"
                  danger
                  onClick={() =>
                     handleConfirmDeleteRow(keyRecord, record.index)
                  }
               />
            )
         },
      },
   ]

   const columns = defaultColumns.map((col) => {
      if (!col.editable) {
         return col
      }
      return {
         ...col,
         onCell: (record) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave,
         }),
      }
   })

   const renderSummaryTable = (pageData) => {
      if (pageData.length === 0) return
      const summaryPrice = pageData.reduce((acc, curr) => {
         if (
            ["mercari", "123", "fril"].some((channelItem) =>
               channelItem.includes(curr.channel)
            )
         )
            return curr.price !== ""
               ? acc + parseFloat(curr.price * rateYenToBath)
               : acc
         return curr.price !== "" ? acc + parseFloat(curr.price) : acc
      }, 0)
      return (
         <Table.Summary.Row>
            <Table.Summary.Cell colSpan={4} className="text-right">
               <Text className="font-black">ราคารวม</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell className="text-right">
               <Text>
                  {parseFloat(summaryPrice).toLocaleString("en-US", {
                     minimumFractionDigits: 2,
                     maximumFractionDigits: 2,
                  })}
               </Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell className="text-right">
               <Text className="font-black">บาท</Text>
            </Table.Summary.Cell>
         </Table.Summary.Row>
      )
   }

   useEffect(() => {
      if (form.getFieldValue("userId")) {
         if (dataSource.length === 0) {
            setDataSource([{ ...DATASOURCE_ITEM, user }])
         } else {
            setDataSource((prev) => [
               ...prev.map((item, index) => ({
                  ...item,
                  user,
                  index: index + 1,
                  key: `${keyDatasourceItem}${index + 1}`,
               })),
            ])
         }
      }
   }, [userIdWatch, user])

   useEffect(() => {
      form.setFieldsValue({ moneyInItems: dataSource })
   }, [dataSource])

   return (
      <div className="pb-3">
         <Button
            icon={<PlusCircleOutlined />}
            type="default"
            className="mb-2"
            onClick={handleAddRow}
            disabled={!user?.userId}
         >
            เพิ่มรายการเงินเข้า
         </Button>
         {/* <InputNumber
            className="ms-2 w-[190px]"
            addonBefore="RATE 1 ¥"
            addonAfter="฿"
            value={rateYenToBath}
            onChange={setRateYenToBath}
         /> */}
         <Table
            size="small"
            components={components}
            columns={columns}
            dataSource={dataSource}
            rowClassName={() => css.editableRow}
            scroll={{ x: 600 }}
            pagination={false}
            bordered
            // summary={renderSummaryTable}
            className="mb-3"
         />
      </div>
   )
}

export default MoneyInManualFormTable
