/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prefer-const */
import { Table, Input } from "antd"
import { getSession } from "next-auth/react"
import React, { Fragment, useState } from "react"
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"
import ConfirmDeleteDialog from "../../../components/ui/ConfirmDeleteDialog"
import EditRemarkModal from "../../../components/yahoo/EditRemarkModal"
import EditStatusModal from "../../../components/yahoo/EditStatusModal"
import createBiddingTableColumns from "../../../components/yahoo/BiddingTableColumns"
import ImagePopup from "../../../components/ImagePopup"
import useBiddingData from "../../../hooks/useBiddingData"
import useTableSearch from "../../../hooks/useTableSearch"

const { Search } = Input

function YahooBiddingPage(props) {
   // Table states
   const [filteredInfo, setFilteredInfo] = useState({})
   const [sortedInfo, setSortedInfo] = useState({})

   // Image popup state
   const [imagePopupState, setImagePopupState] = useState({
      isOpen: false,
      images: [],
      startIndex: 0,
   })

   // Use custom hooks
   const biddingData = useBiddingData(props.session)
   const tableSearch = useTableSearch()

   // Filter data based on search value
   const filteredData =
      biddingData.data?.filter((item) => {
         if (!tableSearch.searchValue) return true

         const searchLower = tableSearch.searchValue.toLowerCase()
         return (
            item.username?.toLowerCase().includes(searchLower) ||
            item.remark_user?.toLowerCase().includes(searchLower) ||
            item.remark_admin?.toLowerCase().includes(searchLower) ||
            item.link?.toLowerCase().includes(searchLower) ||
            item.status?.toLowerCase().includes(searchLower) ||
            item.created_at?.toLowerCase().includes(searchLower)
         )
      }) || []

   // Handle table changes
   const handleChange = (pagination, filters, sorter) => {
      setFilteredInfo(filters)
      setSortedInfo(sorter)
   }

   // Create table columns
   const columns = createBiddingTableColumns({
      data: filteredData,
      filteredInfo,
      sortedInfo,
      getColumnSearchProps: tableSearch.getColumnSearchProps,
      handleCheck: biddingData.handleCheck,
      handleShowEditModal: biddingData.handleShowEditModal,
      handleShowEditStatusModal: biddingData.handleShowEditStatusModal,
      handleDeleteRow: biddingData.handleDeleteRow,
      imagePopupState,
      setImagePopupState,
   })

   // Form handlers for modals
   const handleRemarkChange = (e) => {
      biddingData.updateSelectedRow("remark_admin", e.target.value)
   }

   const handleStatusChange = (value) => {
      biddingData.updateStatusForm("status", value)
      biddingData.updateFormTouched("status", true)
   }

   const handleBidChange = (value) => {
      biddingData.updateStatusForm("bid", value)
      biddingData.updateFormTouched("bid", true)
   }

   const handleTransferFeeChange = (value) => {
      biddingData.updateStatusForm("tranfer_fee", value)
      biddingData.updateFormTouched("tranfer_fee", true)
   }

   const handleDeliveryFeeChange = (value) => {
      biddingData.updateStatusForm("delivery_fee", value)
      biddingData.updateFormTouched("delivery_fee", true)
   }

   const handlePaymentStatusChange = (value) => {
      biddingData.updateStatusForm("payment_status", value)
      biddingData.updateFormTouched("payment_status", true)
   }

   const handleFieldBlur = (field) => {
      biddingData.updateFormTouched(field, true)
   }
   return (
      <Fragment>
         <CardHead
            name="Yahoo Bidding Auction"
            description="แสดงรายการประมูลสินค้าที่ลูกค้าสั่งประมูล"
         />
         <div className="container-table">
            {biddingData.error && (
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
                  <strong>เกิดข้อผิดพลาด:</strong> {biddingData.error}
               </div>
            )}

            <div style={{ marginBottom: "20px" }}>
               <h2
                  style={{
                     fontSize: "20px",
                     fontWeight: "600",
                     color: "#001529",
                     marginBottom: "16px",
                  }}
               >
                  การจัดการ Yahoo Bidding
               </h2>
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
               loading={biddingData.loading}
               onChange={handleChange}
               scroll={{
                  x: 1500,
                  y: 500,
               }}
               locale={{
                  emptyText: biddingData.loading
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
            visible={biddingData.showDeleteConfirm}
            onConfirm={biddingData.confirmDelete}
            onCancel={biddingData.handleCancelDelete}
            loading={biddingData.deleteLoading}
            itemName={biddingData.itemToDelete?.name}
         />

         {/* Edit Remark Modal */}
         <EditRemarkModal
            visible={biddingData.showEditModal}
            loading={biddingData.editLoading}
            selectedRow={biddingData.selectedRow}
            onOk={biddingData.handleOkEditModal}
            onCancel={biddingData.handleCancelEditModal}
            onRemarkChange={handleRemarkChange}
         />

         {/* Edit Status Modal */}
         <EditStatusModal
            visible={biddingData.showEditStatusModal}
            loading={biddingData.statusLoading}
            statusForm={biddingData.statusForm}
            formTouched={biddingData.formTouched}
            onOk={biddingData.handleOkEditStatusModal}
            onCancel={biddingData.handleCancelEditStatusModal}
            onStatusChange={handleStatusChange}
            onBidChange={handleBidChange}
            onTransferFeeChange={handleTransferFeeChange}
            onDeliveryFeeChange={handleDeliveryFeeChange}
            onPaymentStatusChange={handlePaymentStatusChange}
            onFieldBlur={handleFieldBlur}
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

         {/* Image Popup */}
         <ImagePopup
            images={imagePopupState.images}
            isOpen={imagePopupState.isOpen}
            startIndex={imagePopupState.startIndex}
            onClose={() =>
               setImagePopupState({ isOpen: false, images: [], startIndex: 0 })
            }
         />
      </Fragment>
   )
}

YahooBiddingPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   // console.log(context.req)
   const session = await getSession({ req: context.req })

   // eslint-disable-next-line prefer-template
   if (!session) {
      return {
         redirect: {
            destination: "/auth/signin",
            permanent: false,
         },
      }
   }
   return {
      props: {
         session,
      },
   }
}

export default YahooBiddingPage
