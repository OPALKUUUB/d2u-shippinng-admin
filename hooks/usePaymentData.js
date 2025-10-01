import { useState, useEffect } from "react"
import { message } from "antd"
import sortDate from "../utils/sortDate"

const paymentFormModel = {
   date: null,
   tranfer_fee: 0,
   delivery_fee: 0,
   rate_yen: 0,
   payment_status: "รอค่าโอนและค่าส่ง",
}

const usePaymentData = (session) => {
   const [data, setData] = useState([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)
   const [selectedRow, setSelectedRow] = useState(null)
   const [paymentForm, setPaymentForm] = useState(paymentFormModel)
   const [formTouched, setFormTouched] = useState({
      date: false,
      tranfer_fee: false,
      delivery_fee: false,
      rate_yen: false,
      payment_status: false,
   })

   // Loading states for different operations
   const [editLoading, setEditLoading] = useState(false)
   const [deleteLoading, setDeleteLoading] = useState(false)

   // Modal states
   const [showEditModal, setShowEditModal] = useState(false)
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
   const [showSlipModal, setShowSlipModal] = useState(false)
   const [itemToDelete, setItemToDelete] = useState(null)
   const [slip, setSlip] = useState({ id: "", image: "" })

   // Fetch payments data
   const fetchPayments = async () => {
      try {
         setLoading(true)
         setError(null)

         const response = await fetch("/api/yahoo/payment")

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
         }

         const responseJson = await response.json()

         if (responseJson.payments) {
            setData(responseJson.payments)
         } else {
            setError("ไม่พบข้อมูลการชำระเงิน")
         }
      } catch (err) {
         console.error("Error fetching payments:", err)
         setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล")
         setData([])
      } finally {
         setLoading(false)
      }
   }

   // Show edit modal
   const handleShowEditModal = (id) => {
      const payment = data.find((item) => item.id === id)
      if (payment) {
         setSelectedRow(payment)
         setPaymentForm({
            date: payment.date,
            tranfer_fee: payment.tranfer_fee || 0,
            delivery_fee: payment.delivery_fee || 0,
            rate_yen: payment.rate_yen || 0,
            payment_status: payment.payment_status || "รอค่าโอนและค่าส่ง",
         })
         setFormTouched({
            date: false,
            tranfer_fee: false,
            delivery_fee: false,
            rate_yen: false,
            payment_status: false,
         })
         setShowEditModal(true)
      }
   }

   // Handle edit modal OK
   const handleOkEditModal = async () => {
      if (!selectedRow) return

      setEditLoading(true)
      try {
         const { user_id, id } = selectedRow
         const { date, tranfer_fee, delivery_fee, rate_yen, payment_status } =
            paymentForm

         const body = {
            date,
            tranfer_fee: tranfer_fee || 0,
            delivery_fee: delivery_fee || 0,
            rate_yen: rate_yen || 0,
            payment_status,
            user_id,
         }

         const response = await fetch(`/api/yahoo/payment?id=${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
         })

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
         }

         const responseJson = await response.json()

         if (responseJson.payments) {
            setData(responseJson.payments)
            message.success("แก้ไขข้อมูลสำเร็จ!")
         }

         handleCancelEditModal()
      } catch (err) {
         console.error("Error updating payment:", err)
         message.error("เกิดข้อผิดพลาดในการแก้ไขข้อมูล")
      } finally {
         setEditLoading(false)
      }
   }

   // Handle cancel edit modal
   const handleCancelEditModal = () => {
      setSelectedRow(null)
      setPaymentForm(paymentFormModel)
      setFormTouched({
         date: false,
         tranfer_fee: false,
         delivery_fee: false,
         rate_yen: false,
         payment_status: false,
      })
      setShowEditModal(false)
   }

   // Show delete confirmation
   const handleDeleteRow = (id) => {
      const payment = data.find((item) => item.id === id)
      if (payment) {
         setItemToDelete(payment)
         setShowDeleteConfirm(true)
      }
   }

   // Confirm delete
   const confirmDelete = async () => {
      if (!itemToDelete) return

      setDeleteLoading(true)
      try {
         const response = await fetch("/api/yahoo/payment", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ payment_id: itemToDelete.id }),
         })

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
         }

         const responseJson = await response.json()

         if (responseJson.payments) {
            setData(responseJson.payments)
            message.success("ลบรายการสำเร็จ!")
         }

         handleCancelDelete()
      } catch (err) {
         console.error("Error deleting payment:", err)
         message.error("เกิดข้อผิดพลาดในการลบข้อมูล")
      } finally {
         setDeleteLoading(false)
      }
   }

   // Cancel delete
   const handleCancelDelete = () => {
      setItemToDelete(null)
      setShowDeleteConfirm(false)
   }

   // Show slip modal
   const handleShowSlip = async (id) => {
      try {
         const response = await fetch(`/api/yahoo/slip/${id}`)

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
         }

         const responseJson = await response.json()

         if (responseJson.slip) {
            setSlip(responseJson.slip)
            setShowSlipModal(true)
         }
      } catch (err) {
         console.error("Error fetching slip:", err)
         message.error("เกิดข้อผิดพลาดในการโหลดสลิป")
      }
   }

   // Handle notification change
   const handleChangeNotification = async (status, id) => {
      try {
         const response = await fetch(`/api/yahoo/payment?id=${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ notificated: status ? 0 : 1 }),
         })

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
         }

         const responseJson = await response.json()

         if (responseJson.payments) {
            setData(responseJson.payments)
            message.success("อัปเดตสถานะการแจ้งเตือนสำเร็จ!")
         }
      } catch (err) {
         console.error("Error updating notification:", err)
         message.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ")
      }
   }

   // Form update functions
   const updatePaymentForm = (field, value) => {
      setPaymentForm((prev) => ({ ...prev, [field]: value }))
   }

   const updateFormTouched = (field, touched) => {
      setFormTouched((prev) => ({ ...prev, [field]: touched }))
   }

   // Initial data fetch
   useEffect(() => {
      fetchPayments()
   }, [])

   return {
      // Data
      data,
      loading,
      error,
      selectedRow,
      paymentForm,
      formTouched,
      slip,

      // Loading states
      editLoading,
      deleteLoading,

      // Modal states
      showEditModal,
      showDeleteConfirm,
      showSlipModal,
      setShowSlipModal,
      itemToDelete,

      // Handlers
      handleShowEditModal,
      handleOkEditModal,
      handleCancelEditModal,
      handleDeleteRow,
      confirmDelete,
      handleCancelDelete,
      handleShowSlip,
      handleChangeNotification,

      // Form updates
      updatePaymentForm,
      updateFormTouched,

      // Utilities
      fetchPayments,
   }
}

export default usePaymentData
