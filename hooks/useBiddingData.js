import { useState, useEffect } from "react"
import { message } from "antd"
import sortDateTime from "../utils/sortDateTime"

const statusFormModel = {
   status: "ชนะ",
   bid: "",
   tranfer_fee: "",
   delivery_fee: "",
   payment_status: "รอค่าโอนและค่าส่ง",
}

const useBiddingData = (session) => {
   const [data, setData] = useState([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)
   const [selectedRow, setSelectedRow] = useState(null)
   const [statusForm, setStatusForm] = useState(statusFormModel)
   const [formTouched, setFormTouched] = useState({
      bid: false,
      tranfer_fee: false,
      delivery_fee: false,
      payment_status: false,
      status: false,
   })

   // Loading states for different operations
   const [editLoading, setEditLoading] = useState(false)
   const [statusLoading, setStatusLoading] = useState(false)
   const [deleteLoading, setDeleteLoading] = useState(false)

   // Modal states
   const [showEditModal, setShowEditModal] = useState(false)
   const [showEditStatusModal, setShowEditStatusModal] = useState(false)
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
   const [itemToDelete, setItemToDelete] = useState(null)

   // Fetch orders data
   const fetchOrders = async () => {
      try {
         setLoading(true)
         setError(null)

         const response = await fetch("/api/yahoo/order")

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
         }

         const responseJson = await response.json()
         const orders = responseJson.orders || []

         setData(orders)
      } catch (error) {
         console.error("Error fetching orders:", error)
         setError(error.message)
         setData([])
      } finally {
         setLoading(false)
      }
   }

   // Handle checkbox toggle for bidding
   const handleCheck = async (name, check, id) => {
      try {
         const response = await fetch(`/api/yahoo/order/addbid/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               name,
               check,
               session,
            }),
         })
         const responseJson = await response.json()
         setData(
            responseJson.orders
               .sort((a, b) => sortDateTime(a.created_at, b.created_at))
               .reduce((a, c, i) => [...a, { ...c, key: i }], [])
         )
      } catch (err) {
         console.log(err)
         message.error("เกิดข้อผิดพลาด!")
      }
   }

   // Modal handlers
   const handleShowEditModal = (id) => {
      const row = data.find((element) => element.id === id)
      setSelectedRow(row)
      setShowEditModal(true)
   }

   const handleShowEditStatusModal = (id) => {
      const row = data.find((element) => element.id === id)
      setSelectedRow(row)
      setStatusForm(statusFormModel)
      setFormTouched({
         bid: false,
         tranfer_fee: false,
         delivery_fee: false,
         payment_status: false,
         status: false,
      })
      setShowEditStatusModal(true)
   }

   const handleDeleteRow = (id) => {
      const item = data.find((item) => item.id === id)
      setItemToDelete(item)
      setShowDeleteConfirm(true)
   }

   // Edit remark handler
   const handleOkEditModal = async () => {
      const { id } = selectedRow
      const remark = selectedRow.remark_admin

      if (!remark || remark.trim() === "") {
         message.error("กรุณากรอกหมายเหตุแอดมิน!")
         return
      }

      if (remark.length > 500) {
         message.error("หมายเหตุต้องไม่เกิน 500 ตัวอักษร!")
         return
      }

      try {
         setEditLoading(true)
         const response = await fetch(`/api/yahoo/order/remark-admin/${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               remark: remark.trim(),
               session,
            }),
         })

         if (!response.ok) {
            const errorData = await response.json()
            throw new Error(
               errorData.message || `HTTP error! status: ${response.status}`
            )
         }

         const responseJson = await response.json()
         setData(responseJson.orders)
         message.success("บันทึกหมายเหตุสำเร็จ!")
         setShowEditModal(false)
      } catch (err) {
         console.error("Edit error:", err)
         message.error(err.message || "บันทึกไม่สำเร็จ! กรุณาลองใหม่อีกครั้ง")
      } finally {
         setEditLoading(false)
      }
   }

   // Status update handler
   const handleOkEditStatusModal = async () => {
      const { id, user_id } = selectedRow
      const order_id = id
      const { status, bid, tranfer_fee, delivery_fee, payment_status } =
         statusForm

      // Client-side validation
      if (!status) {
         setFormTouched({ ...formTouched, status: true })
         message.error("กรุณาเลือกสถานะการประมูล!")
         return
      }

      if (status === "ชนะ") {
         if (!bid || bid <= 0) {
            setFormTouched({ ...formTouched, bid: true })
            message.error("กรุณากรอกราคาที่ประมูลได้!")
            return
         }

         if (!payment_status) {
            setFormTouched({ ...formTouched, payment_status: true })
            message.error("กรุณาเลือกสถานะการชำระเงิน!")
            return
         }

         if (tranfer_fee < 0) {
            setFormTouched({ ...formTouched, tranfer_fee: true })
            message.error("ค่าธรรมเนียมการโอนไม่สามารถติดลบได้!")
            return
         }

         if (delivery_fee < 0) {
            setFormTouched({ ...formTouched, delivery_fee: true })
            message.error("ค่าขนส่งไม่สามารถติดลบได้!")
            return
         }

         if (!["รอค่าโอนและค่าส่ง", "รอการชำระเงิน"].includes(payment_status)) {
            setFormTouched({ ...formTouched, payment_status: true })
            message.error("สถานะการชำระเงินไม่ถูกต้อง!")
            return
         }
      }

      try {
         setStatusLoading(true)
         const response = await fetch("/api/yahoo/payment", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               order_id,
               user_id,
               bid,
               delivery_fee,
               tranfer_fee,
               payment_status,
               status,
               session,
            }),
         })

         if (!response.ok) {
            const errorData = await response.json()
            throw new Error(
               errorData.message || `HTTP error! status: ${response.status}`
            )
         }

         const responseJson = await response.json()
         setData(responseJson.orders)
         message.success("ปรับปรุงสถานะสำเร็จ!")
         setShowEditStatusModal(false)
         setStatusForm(statusFormModel)
      } catch (err) {
         console.error("Status update error:", err)
         message.error(
            err.message || "ปรับปรุงสถานะไม่สำเร็จ! กรุณาลองใหม่อีกครั้ง"
         )
      } finally {
         setStatusLoading(false)
      }
   }

   // Delete handler
   const confirmDelete = async () => {
      if (!itemToDelete) return

      try {
         setDeleteLoading(true)
         const response = await fetch("/api/yahoo/order", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: itemToDelete.id }),
         })

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
         }

         const responseJson = await response.json()
         setData(
            responseJson.orders
               .sort((a, b) => sortDateTime(a.created_at, b.created_at))
               .reduce((a, c, i) => [...a, { ...c, key: i }], [])
         )
         message.success("ลบรายการสำเร็จ!")
         setShowDeleteConfirm(false)
         setItemToDelete(null)
      } catch (err) {
         console.error("Delete error:", err)
         message.error("ลบไม่สำเร็จ! กรุณาลองใหม่อีกครั้ง")
      } finally {
         setDeleteLoading(false)
      }
   }

   // Cancel handlers
   const handleCancelEditModal = () => {
      setSelectedRow({
         ...selectedRow,
         remark_admin: selectedRow.remark_admin || "",
      })
      setShowEditModal(false)
   }

   const handleCancelEditStatusModal = () => {
      setStatusForm(statusFormModel)
      setFormTouched({
         bid: false,
         tranfer_fee: false,
         delivery_fee: false,
         payment_status: false,
         status: false,
      })
      setShowEditStatusModal(false)
   }

   const handleCancelDelete = () => {
      setShowDeleteConfirm(false)
      setItemToDelete(null)
      setDeleteLoading(false)
   }

   // Form handlers
   const updateSelectedRow = (field, value) => {
      setSelectedRow({
         ...selectedRow,
         [field]: value,
      })
   }

   const updateStatusForm = (field, value) => {
      setStatusForm({
         ...statusForm,
         [field]: value,
      })
   }

   const updateFormTouched = (field, touched = true) => {
      setFormTouched({
         ...formTouched,
         [field]: touched,
      })
   }

   // Initialize data
   useEffect(() => {
      fetchOrders()
   }, [])

   return {
      // Data
      data,
      loading,
      error,
      selectedRow,
      statusForm,
      formTouched,

      // Loading states
      editLoading,
      statusLoading,
      deleteLoading,

      // Modal states
      showEditModal,
      showEditStatusModal,
      showDeleteConfirm,
      itemToDelete,

      // Handlers
      handleCheck,
      handleShowEditModal,
      handleShowEditStatusModal,
      handleDeleteRow,
      handleOkEditModal,
      handleOkEditStatusModal,
      confirmDelete,
      handleCancelEditModal,
      handleCancelEditStatusModal,
      handleCancelDelete,

      // Form updates
      updateSelectedRow,
      updateStatusForm,
      updateFormTouched,

      // Utilities
      fetchOrders,
   }
}

export default useBiddingData
