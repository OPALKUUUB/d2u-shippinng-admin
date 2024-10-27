import { Button, Table, message } from "antd"
import React, { useContext, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { InvoiceShipBillingContext } from "../../../context/InvoiceShipBillingContextV2"
import Helper from "../../../utils/Helper"
import InvoiceApi from "../../../services/InvoiceApi"

const InvoiceShipBillingDraftTable = () => {
   const { invoiceShipBillingData, setPagination } = useContext(
      InvoiceShipBillingContext
   )
   const [loading, setLoading] = useState(false) // To handle loading state for API calls

   // Destructure data with fallbacks for cases where data might not exist yet
   const {
      results = [],
      current = 1,
      pageSize = 10,
      total = 0,
   } = invoiceShipBillingData || {}

   // Map the data to a new array with unique keys
   const dataSource = results.map((item) => ({ ...item, key: uuidv4() }))

   // Define the table columns
   const defaultColumns = [
      {
         title: "Username",
         key: "username",
         dataIndex: "username",
      },
      {
         title: "สถานะ",
         key: "shipBillingStatus",
         dataIndex: "shipBillingStatus",
         width: 150,
         render: (status) => Helper.mapShipBillingStatusToDescription(status),
      },
      {
         title: "ค่าเรือ",
         key: "voyagePrice",
         dataIndex: "voyagePrice",
         align: "right",
         sorter: (a, b) => a.voyagePrice - b.voyagePrice, // Sorting function
         render: (value) =>
            value
               ? value.toLocaleString("en-US", {
                    style: "currency",
                    currency: "THB",
                 })
               : "-", // Format as currency
      },
      {
         title: "ประเภทค่าใช้จ่าย",
         key: "paymentType",
         dataIndex: "paymentType",
      },
      {
         // title: "Actions",
         key: "actions",
         width: 100,
         render: (_, record) => (
            <Button
               type="primary"
               onClick={() => handleAction(record)}
               loading={loading}
            >
               ใบวางบิล
            </Button>
         ),
      },
   ]

   // Function to handle action when "Create Invoice" button is clicked
   const handleAction = async (record) => {
      const { userId, shipbillingId } = record

      // Ensure the necessary fields are present
      if (!userId || !shipbillingId) {
         message.error("Missing userId or shipbillingId")
         return
      }

      setLoading(true) // Start loading state

      try {
         // Call the API to create an invoice
         const result = await InvoiceApi.postInvoiceShipBilling({
            userId,
            shipBillingId: shipbillingId,
         })

         if (result && result.link) {
            message.success("Invoice created successfully")

            // Optionally, redirect to the invoice or refresh the table
            window.open(result.link, "_blank")
         } else {
            message.warning("Invoice creation response did not include a link.")
         }
      } catch (error) {
         message.error("Failed to create invoice. Please try again.")
         console.error("Error creating invoice:", error)
      } finally {
         setLoading(false) // End loading state
      }
   }

   // Define the pagination settings
   const paginationConfig = {
      current,
      pageSize,
      total,
      showSizeChanger: true,
      onChange: (page, pageSize) => {
         // Trigger the setPagination function in the context to fetch new data
         setPagination(page, pageSize)
      },
   }

   return (
      <Table
         columns={defaultColumns}
         dataSource={dataSource}
         pagination={paginationConfig}
         bordered
         loading={loading}
         locale={{ emptyText: "ไม่มีข้อมูลการวางบิล" }} // Display message when no data is available
      />
   )
}

export default InvoiceShipBillingDraftTable
