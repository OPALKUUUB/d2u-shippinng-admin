import { Button, Input, Table, Tabs, message } from "antd"
import React, { useState, useContext } from "react"
import { FilterOutlined } from "@ant-design/icons"
import Helper from "../../utils/Helper"
import { InvoiceShipBillingContext } from "../../context/InvoiceShipBillingContextV2"
import InvoiceApi from "../../services/InvoiceApi"

const { TabPane } = Tabs

const InvoiceShipBillingTabs = () => {
   const { voyage, invoiceShipBillingData, setPagination, loading } =
      useContext(InvoiceShipBillingContext)
   const [activeKey, setActiveKey] = useState("all")
   const [searchText, setSearchText] = useState("")
   // Handle tab change
   const handleTabChange = (key) => {
      setActiveKey(key)
      // Reset pagination to the first page when changing the tab
      setPagination(1, invoiceShipBillingData.pageSize, key, searchText)
   }

   // Handle pagination change
   const handleTableChange = (pagination) => {
      setPagination(
         pagination.current,
         pagination.pageSize,
         activeKey,
         searchText
      )
   }

   // Filter dropdown for username search
   const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({
         setSelectedKeys,
         selectedKeys,
         confirm,
         clearFilters,
      }) => (
         <div style={{ padding: 8 }}>
            <Input
               placeholder={`Search ${dataIndex}`}
               value={selectedKeys[0]}
               onChange={(e) =>
                  setSelectedKeys(e.target.value ? [e.target.value] : [])
               }
               onPressEnter={() => handleSearch(selectedKeys, confirm)}
               style={{ marginBottom: 8, display: "block" }}
            />
            <Button
               type="primary"
               onClick={() => handleSearch(selectedKeys, confirm)}
               size="small"
               style={{ width: 90, marginRight: 8 }}
            >
               Search
            </Button>
            <Button
               onClick={() => handleReset(clearFilters)}
               size="small"
               style={{ width: 90 }}
            >
               Reset
            </Button>
         </div>
      ),
      filterIcon: (filtered) => <FilterOutlined />,
      onFilter: (value, record) =>
         record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
   })

   const handleSearch = (selectedKeys, confirm) => {
      confirm()
      setSearchText(selectedKeys[0]) // Update the state with the search value
      setPagination(
         1,
         invoiceShipBillingData.pageSize,
         activeKey,
         selectedKeys[0]
      ) // Fetch data with the search text
   }

   const handleReset = (clearFilters) => {
      clearFilters()
      setSearchText("") // Reset the search state
      setPagination(1, invoiceShipBillingData.pageSize, activeKey, "") // Reset pagination and fetch data
   }

   // Define the columns for the table
   const defaultColumns = [
      {
         title: "Username",
         key: "username",
         dataIndex: "username",
         ...getColumnSearchProps("username"), // Add search functionality to the username column
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
         sorter: (a, b) => a.voyagePrice - b.voyagePrice,
         render: (value) =>
            value
               ? value.toLocaleString("en-US", {
                    style: "currency",
                    currency: "THB",
                 })
               : "-",
      },
      {
         title: "ประเภทค่าใช้จ่าย",
         key: "paymentType",
         dataIndex: "paymentType",
      },
      {
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

   const handleAction = async (record) => {
      const { userId, shipbillingId } = record

      if (!userId || !shipbillingId) {
         message.error("Missing userId or shipbillingId")
         return
      }

      try {
         const result = await InvoiceApi.postInvoiceShipBilling({
            userId,
            shipBillingId: shipbillingId,
         })

         if (result && result.link) {
            message.success("Invoice created successfully")
            window.open(result.link, "_blank")
         } else {
            message.warning("Invoice creation response did not include a link.")
         }
      } catch (error) {
         message.error("Failed to create invoice. Please try again.")
         console.error("Error creating invoice:", error)
      }
   }

   return (
      <Tabs activeKey={activeKey} onChange={handleTabChange}>
         <TabPane tab="ทั้งหมด" key="all">
            <Table
               columns={defaultColumns}
               dataSource={invoiceShipBillingData.results}
               pagination={{
                  current: invoiceShipBillingData.current,
                  pageSize: invoiceShipBillingData.pageSize,
                  total: invoiceShipBillingData.total,
               }}
               loading={loading}
               onChange={handleTableChange}
               bordered
               locale={{ emptyText: "ไม่มีข้อมูลการวางบิล" }}
            />
         </TabPane>
         <TabPane tab="Draft (D)" key="D">
            <Table
               columns={defaultColumns}
               dataSource={invoiceShipBillingData.results}
               pagination={{
                  current: invoiceShipBillingData.current,
                  pageSize: invoiceShipBillingData.pageSize,
                  total: invoiceShipBillingData.total,
               }}
               loading={loading}
               onChange={handleTableChange}
               bordered
               locale={{ emptyText: "ไม่มีข้อมูลการวางบิล" }}
            />
         </TabPane>
         <TabPane tab="Keep (K)" key="K">
            <Table
               columns={defaultColumns}
               dataSource={invoiceShipBillingData.results}
               pagination={{
                  current: invoiceShipBillingData.current,
                  pageSize: invoiceShipBillingData.pageSize,
                  total: invoiceShipBillingData.total,
               }}
               loading={loading}
               onChange={handleTableChange}
               bordered
               locale={{ emptyText: "ไม่มีข้อมูลการวางบิล" }}
            />
         </TabPane>
         <TabPane tab="Keep Recovery Draft (KRD)" key="KRD">
            <Table
               columns={defaultColumns}
               dataSource={invoiceShipBillingData.results}
               pagination={{
                  current: invoiceShipBillingData.current,
                  pageSize: invoiceShipBillingData.pageSize,
                  total: invoiceShipBillingData.total,
               }}
               loading={loading}
               onChange={handleTableChange}
               bordered
               locale={{ emptyText: "ไม่มีข้อมูลการวางบิล" }}
            />
         </TabPane>
         <TabPane tab="Selected Address (SA)" key="SA">
            <Table
               columns={defaultColumns}
               dataSource={invoiceShipBillingData.results}
               pagination={{
                  current: invoiceShipBillingData.current,
                  pageSize: invoiceShipBillingData.pageSize,
                  total: invoiceShipBillingData.total,
               }}
               loading={loading}
               onChange={handleTableChange}
               bordered
               locale={{ emptyText: "ไม่มีข้อมูลการวางบิล" }}
            />
         </TabPane>
         <TabPane tab="Waiting Tracking (WT)" key="WT">
            <Table
               columns={defaultColumns}
               dataSource={invoiceShipBillingData.results}
               pagination={{
                  current: invoiceShipBillingData.current,
                  pageSize: invoiceShipBillingData.pageSize,
                  total: invoiceShipBillingData.total,
               }}
               loading={loading}
               onChange={handleTableChange}
               bordered
               locale={{ emptyText: "ไม่มีข้อมูลการวางบิล" }}
            />
         </TabPane>
         <TabPane tab="Waiting Slip (WS)" key="WS">
            <Table
               columns={defaultColumns}
               dataSource={invoiceShipBillingData.results}
               pagination={{
                  current: invoiceShipBillingData.current,
                  pageSize: invoiceShipBillingData.pageSize,
                  total: invoiceShipBillingData.total,
               }}
               loading={loading}
               onChange={handleTableChange}
               bordered
               locale={{ emptyText: "ไม่มีข้อมูลการวางบิล" }}
            />
         </TabPane>
         <TabPane tab="Waiting Confirm Slip (WCS)" key="WCS">
            <Table
               columns={defaultColumns}
               dataSource={invoiceShipBillingData.results}
               pagination={{
                  current: invoiceShipBillingData.current,
                  pageSize: invoiceShipBillingData.pageSize,
                  total: invoiceShipBillingData.total,
               }}
               loading={loading}
               onChange={handleTableChange}
               bordered
               locale={{ emptyText: "ไม่มีข้อมูลการวางบิล" }}
            />
         </TabPane>
         <TabPane tab="Finished (F)" key="F">
            <Table
               columns={defaultColumns}
               dataSource={invoiceShipBillingData.results}
               pagination={{
                  current: invoiceShipBillingData.current,
                  pageSize: invoiceShipBillingData.pageSize,
                  total: invoiceShipBillingData.total,
               }}
               loading={loading}
               onChange={handleTableChange}
               bordered
               locale={{ emptyText: "ไม่มีข้อมูลการวางบิล" }}
            />
         </TabPane>
      </Tabs>
   )
}

export default InvoiceShipBillingTabs
