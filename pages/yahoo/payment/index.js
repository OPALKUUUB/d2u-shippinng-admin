/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prefer-const */
import { Table, Input, Switch, Button, Badge, notification } from "antd"
import { getSession } from "next-auth/react"
import React, { Fragment, useState, useEffect, useRef } from "react"
import { ReloadOutlined, SoundOutlined, SoundFilled } from "@ant-design/icons"
import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
import customParseFormat from "dayjs/plugin/customParseFormat"

import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"
import ConfirmDeleteDialog from "../../../components/ui/ConfirmDeleteDialog"
import EditPaymentModal from "../../../components/yahoo/EditPaymentModal"
import SlipModal from "../../../components/yahoo/SlipModal"
import createPaymentTableColumns from "../../../components/yahoo/PaymentTableColumns"
import usePaymentData from "../../../hooks/usePaymentData"
import useTableSearch from "../../../hooks/useTableSearch"
import genDate from "../../../utils/genDate"

dayjs.extend(customParseFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)

const { Search } = Input

function YahooPaymentPage(props) {
   // Table states
   const [filteredInfo, setFilteredInfo] = useState({})
   const [sortedInfo, setSortedInfo] = useState({})

   // Auto refresh states
   const [autoRefresh, setAutoRefresh] = useState(true)
   const [refreshInterval, setRefreshInterval] = useState(30) // seconds
   const [soundEnabled, setSoundEnabled] = useState(true)
   const [lastDataCount, setLastDataCount] = useState(0)
   const [newPaymentsCount, setNewPaymentsCount] = useState(0)
   const [isManualRefreshing, setIsManualRefreshing] = useState(false)
   const [newPaymentIds, setNewPaymentIds] = useState(new Set())

   // Refs
   const intervalRef = useRef(null)

   // Use custom hooks
   const paymentData = usePaymentData(props.session)
   const tableSearch = useTableSearch()

   // Auto refresh effect
   useEffect(() => {
      if (autoRefresh && refreshInterval > 0) {
         intervalRef.current = setInterval(() => {
            paymentData.fetchPayments()
         }, refreshInterval * 1000)
      } else if (intervalRef.current) {
         clearInterval(intervalRef.current)
         intervalRef.current = null
      }

      return () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current)
         }
      }
   }, [autoRefresh, refreshInterval, paymentData.fetchPayments])

   // Check for new payments
   useEffect(() => {
      const currentData = paymentData.data || []
      const currentDataCount = currentData.length

      if (lastDataCount > 0 && currentDataCount > lastDataCount) {
         const newCount = currentDataCount - lastDataCount

         // เก็บ ID ของ payment ใหม่
         const sortedData = [...currentData].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
         )
         const newPayments = sortedData.slice(0, newCount)
         const newIds = newPayments.map(
            (payment) =>
               `${payment.date}_${payment.username}_${
                  payment.id || Math.random()
               }`
         )

         setNewPaymentsCount((prev) => prev + newCount)
         setNewPaymentIds((prev) => {
            const updatedSet = new Set([...prev, ...newIds])
            return updatedSet
         })

         // Show notification
         notification.success({
            message: "🎉 มีการชำระเงินใหม่!",
            description: `มีรายการชำระเงินใหม่ ${newCount} รายการ`,
            placement: "topRight",
            duration: 5,
         })

         // Play notification sound
         playNotificationSound()
      }

      setLastDataCount(currentDataCount)
   }, [paymentData.data, lastDataCount, soundEnabled])

   // Filter data based on search value
   const filteredData =
      paymentData.data?.filter((item) => {
         if (!tableSearch.searchValue) return true

         const searchLower = tableSearch.searchValue.toLowerCase()
         return (
            item.username?.toLowerCase().includes(searchLower) ||
            item.remark_user?.toLowerCase().includes(searchLower) ||
            item.remark_admin?.toLowerCase().includes(searchLower) ||
            item.date?.toLowerCase().includes(searchLower) ||
            item.payment_status?.toLowerCase().includes(searchLower)
         )
      }) || []

   // Handle table changes
   const handleChange = (pagination, filters, sorter) => {
      setFilteredInfo(filters)
      setSortedInfo(sorter)
   }

   // Create table columns
   const columns = createPaymentTableColumns({
      data: filteredData,
      filteredInfo,
      sortedInfo,
      getColumnSearchProps: tableSearch.getColumnSearchProps,
      handleShowEditModal: paymentData.handleShowEditModal,
      handleDeleteRow: paymentData.handleDeleteRow,
      handleShowSlip: paymentData.handleShowSlip,
      handleChangeNotification: paymentData.handleChangeNotification,
      newPaymentIds,
   })

   // Form handlers for modals
   const handleDateChange = (value) => {
      paymentData.updatePaymentForm("date", value)
      paymentData.updateFormTouched("date", true)
   }

   const handleTransferFeeChange = (value) => {
      paymentData.updatePaymentForm("tranfer_fee", value)
      paymentData.updateFormTouched("tranfer_fee", true)
   }

   const handleDeliveryFeeChange = (value) => {
      paymentData.updatePaymentForm("delivery_fee", value)
      paymentData.updateFormTouched("delivery_fee", true)
   }

   const handleRateYenChange = (value) => {
      paymentData.updatePaymentForm("rate_yen", value)
      paymentData.updateFormTouched("rate_yen", true)
   }

   const handlePaymentStatusChange = (value) => {
      paymentData.updatePaymentForm("payment_status", value)
      paymentData.updateFormTouched("payment_status", true)
   }

   const handleFieldBlur = (field) => {
      paymentData.updateFormTouched(field, true)
   }

   // Manual refresh handler
   const handleManualRefresh = async () => {
      setIsManualRefreshing(true)
      try {
         await paymentData.fetchPayments()
         notification.success({
            message: "✅ รีเฟรชข้อมูลสำเร็จ",
            description: "ข้อมูลได้รับการอัปเดตแล้ว",
            placement: "topRight",
            duration: 2,
         })
      } catch (error) {
         notification.error({
            message: "❌ เกิดข้อผิดพลาด",
            description: "ไม่สามารถรีเฟรชข้อมูลได้",
            placement: "topRight",
            duration: 3,
         })
      } finally {
         setIsManualRefreshing(false)
      }
   }

   // Clear new payments notification
   const handleClearNewPayments = () => {
      setNewPaymentsCount(0)
      setNewPaymentIds(new Set())
   }

   // Play notification sound
   const playNotificationSound = () => {
      if (soundEnabled) {
         try {
            // Create simple notification sound with Web Audio API
            const audioContext = new (window.AudioContext ||
               window.webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
            oscillator.frequency.setValueAtTime(
               600,
               audioContext.currentTime + 0.1
            )
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(
               0.01,
               audioContext.currentTime + 0.5
            )

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.5)
         } catch (error) {
            console.warn("ไม่สามารถเล่นเสียงแจ้งเตือนได้:", error)
         }
      }
   }
   return (
      <Fragment>
         <CardHead
            name="Yahoo Payment Auction"
            description="แสดงรายการประมูลสินค้าที่ลูกค้าต้องชำระ"
         />
         <div className="container-table">
            {paymentData.error && (
               <div
                  style={{
                     padding: "20px",
                     background: "#fff2f0",
                     border: "1px solid #ffccc7",
                     borderRadius: "4px",
                     marginBottom: "16px",
                     color: "#ff4d4f",
                  }}
               >
                  <strong>เกิดข้อผิดพลาด:</strong> {paymentData.error}
               </div>
            )}

            <div style={{ marginBottom: "20px" }}>
               <div
                  style={{
                     display: "flex",
                     justifyContent: "space-between",
                     alignItems: "center",
                     marginBottom: "16px",
                  }}
               >
                  <h2
                     style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#001529",
                        margin: 0,
                     }}
                  >
                     การจัดการ Yahoo Payment
                     {newPaymentsCount > 0 && (
                        <Badge
                           count={newPaymentsCount}
                           onClick={handleClearNewPayments}
                           style={{
                              marginLeft: "10px",
                              backgroundColor: "#52c41a",
                              cursor: "pointer",
                           }}
                        />
                     )}
                  </h2>

                  {/* Control Panel */}
                  <div
                     style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        padding: "8px 12px",
                        background: "#f0f2f5",
                        borderRadius: "6px",
                        border: "1px solid #d9d9d9",
                     }}
                  >
                     {/* Status Info */}
                     <div style={{ fontSize: "11px", color: "#666" }}>
                        {autoRefresh && "🔄 อัปเดตอัตโนมัติทุก 30 วิ | "}
                        {soundEnabled && "🔊 เสียงแจ้งเตือน | "}
                        {newPaymentIds.size > 0 &&
                           `🆕 Payment ใหม่: ${newPaymentIds.size} รายการ | `}
                        📊 ข้อมูล: {paymentData.data?.length || 0} รายการ
                     </div>

                     {/* Auto Refresh Toggle */}
                     <div
                        style={{
                           display: "flex",
                           alignItems: "center",
                           gap: "8px",
                        }}
                     >
                        <span style={{ fontSize: "12px", color: "#666" }}>
                           Auto Refresh:
                        </span>
                        <Switch
                           checked={autoRefresh}
                           onChange={setAutoRefresh}
                           size="small"
                        />
                        <span
                           style={{
                              fontSize: "11px",
                              color: autoRefresh ? "#52c41a" : "#999",
                           }}
                        >
                           {autoRefresh ? `${refreshInterval}s` : "Off"}
                        </span>
                     </div>

                     {/* Sound Toggle */}
                     <div
                        style={{
                           display: "flex",
                           alignItems: "center",
                           gap: "5px",
                        }}
                     >
                        <Button
                           type={soundEnabled ? "primary" : "default"}
                           size="small"
                           icon={
                              soundEnabled ? <SoundFilled /> : <SoundOutlined />
                           }
                           onClick={() => setSoundEnabled(!soundEnabled)}
                           style={{ fontSize: "12px" }}
                        />
                        {soundEnabled && (
                           <Button
                              size="small"
                              onClick={playNotificationSound}
                              style={{ fontSize: "11px", padding: "2px 6px" }}
                              title="ทดสอบเสียง"
                           >
                              ทดสอบ
                           </Button>
                        )}
                     </div>

                     {/* Manual Refresh */}
                     <Button
                        type="default"
                        size="small"
                        icon={<ReloadOutlined />}
                        loading={isManualRefreshing}
                        onClick={handleManualRefresh}
                        style={{ fontSize: "12px" }}
                     >
                        Refresh
                     </Button>

                     {/* Clear NEW Markers */}
                     {newPaymentIds.size > 0 && (
                        <Button
                           type="default"
                           size="small"
                           onClick={handleClearNewPayments}
                           style={{
                              fontSize: "11px",
                              padding: "2px 8px",
                              background: "#fff1f0",
                              border: "1px solid #ffa39e",
                              color: "#ff4d4f",
                           }}
                           title="เคลียร์เครื่องหมาย NEW ทั้งหมด"
                        >
                           Clear NEW ({newPaymentIds.size})
                        </Button>
                     )}

                     {/* Data Count */}
                     <div
                        style={{
                           fontSize: "11px",
                           color: "#666",
                           padding: "2px 6px",
                           background: "white",
                           borderRadius: "3px",
                           border: "1px solid #e8e8e8",
                        }}
                     >
                        {filteredData.length} รายการ
                     </div>
                  </div>
               </div>

               <Search
                  placeholder="ค้นหาข้อมูล..."
                  allowClear
                  value={tableSearch.searchValue}
                  onChange={(e) => tableSearch.handleSearch(e.target.value)}
                  onSearch={tableSearch.handleSearch}
                  style={{
                     width: 300,
                     marginBottom: "16px",
                  }}
               />
            </div>

            <Table
               columns={columns}
               dataSource={filteredData}
               loading={paymentData.loading}
               onChange={handleChange}
               scroll={{
                  x: 1500,
                  y: 500,
               }}
               locale={{
                  emptyText: paymentData.loading
                     ? "กำลังโหลดข้อมูล..."
                     : "ไม่มีข้อมูล",
               }}
               pagination={{
                  pageSize: 20,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                     `แสดง ${range[0]}-${range[1]} จาก ${total} รายการ`,
                  pageSizeOptions: ["10", "20", "50", "100"],
               }}
               size="middle"
               bordered
               rowClassName={(record, index) =>
                  index % 2 === 0 ? "table-row-even" : "table-row-odd"
               }
            />
         </div>

         {/* Delete Confirmation Dialog */}
         <ConfirmDeleteDialog
            visible={paymentData.showDeleteConfirm}
            onConfirm={paymentData.confirmDelete}
            onCancel={paymentData.handleCancelDelete}
            loading={paymentData.deleteLoading}
            itemName={paymentData.itemToDelete?.username}
         />

         {/* Edit Payment Modal */}
         <EditPaymentModal
            visible={paymentData.showEditModal}
            loading={paymentData.editLoading}
            paymentForm={paymentData.paymentForm}
            formTouched={paymentData.formTouched}
            onOk={paymentData.handleOkEditModal}
            onCancel={paymentData.handleCancelEditModal}
            onDateChange={handleDateChange}
            onTransferFeeChange={handleTransferFeeChange}
            onDeliveryFeeChange={handleDeliveryFeeChange}
            onRateYenChange={handleRateYenChange}
            onPaymentStatusChange={handlePaymentStatusChange}
            onFieldBlur={handleFieldBlur}
         />

         {/* Slip Modal */}
         <SlipModal
            visible={paymentData.showSlipModal}
            slip={paymentData.slip}
            onCancel={() => paymentData.setShowSlipModal(false)}
         />

         <style jsx>
            {`
               .container-table {
                  margin: 10px;
                  background: white;
                  padding: 20px;
                  border-radius: 4px;
                  border: 1px solid #d9d9d9;
               }

               :global(.table-row-even) {
                  background-color: #fafafa !important;
               }

               :global(.table-row-odd) {
                  background-color: #ffffff !important;
               }

               :global(.table-row-even:hover),
               :global(.table-row-odd:hover) {
                  background-color: #f0f0f0 !important;
               }

               :global(.ant-table-thead > tr > th) {
                  background: #001529 !important;
                  color: white !important;
                  font-weight: 600 !important;
                  text-align: center !important;
                  border: none !important;
                  font-size: 13px !important;
               }

               :global(.ant-table-thead > tr > th .ant-table-column-sorter) {
                  color: white !important;
               }

               :global(
                     .ant-table-thead
                        > tr
                        > th
                        .ant-table-column-sorter
                        .ant-table-column-sorter-up.active
                  ) {
                  color: #1890ff !important;
               }

               :global(
                     .ant-table-thead
                        > tr
                        > th
                        .ant-table-column-sorter
                        .ant-table-column-sorter-down.active
                  ) {
                  color: #1890ff !important;
               }

               :global(.ant-table-thead > tr > th .ant-table-filter-trigger) {
                  color: white !important;
               }

               :global(
                     .ant-table-thead > tr > th .ant-table-filter-trigger:hover
                  ) {
                  color: #1890ff !important;
               }

               :global(.ant-table-thead > tr > th .ant-input) {
                  background: white !important;
                  color: #001529 !important;
               }

               :global(.ant-table-tbody > tr > td) {
                  border-bottom: 1px solid #f0f0f0 !important;
                  padding: 12px 8px !important;
                  vertical-align: middle !important;
               }

               :global(.ant-table-bordered .ant-table-thead > tr > th) {
                  border-right: 1px solid rgba(255, 255, 255, 0.3) !important;
               }

               :global(.ant-table-bordered .ant-table-tbody > tr > td) {
                  border-right: 1px solid #f0f0f0 !important;
               }

               :global(.ant-pagination) {
                  margin-top: 20px !important;
                  text-align: center !important;
               }

               :global(.ant-table-wrapper) {
                  border-radius: 4px !important;
                  overflow: hidden !important;
                  border: 1px solid #d9d9d9 !important;
               }
            `}
         </style>
      </Fragment>
   )
}

YahooPaymentPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })

   if (!session) {
      return {
         redirect: {
            destination: "/auth/signin",
            permanent: false,
         },
      }
   }
   return {
      props: { session },
   }
}
export default YahooPaymentPage
