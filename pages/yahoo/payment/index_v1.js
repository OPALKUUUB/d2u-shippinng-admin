import { getSession } from "next-auth/react"
import { Fragment, useEffect, useState } from "react"
import { useRouter } from "next/router"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import CardHead from "../../../components/CardHead"
import SortIcon from "../../../components/icon/SortIcon"
import Layout from "../../../components/layout/layout"
import DownIcon from "../../../components/icon/DownIcon"
import Modal from "../../../components/Modal"

function YahooPaymentPage(props) {
   const router = useRouter()
   const [payments, setPayments] = useState(props.payments)
   const [searchInput, setSearchInput] = useState("")
   useEffect(() => {
      router.push({
         query: {
            search: searchInput,
         },
      })
   }, [searchInput])
   return (
      <Fragment>
         <CardHead
            name="Yahoo Payment Auction"
            description="* แสดงรายการสถานะการประมูลสินค้าที่ลูกค้าสั่งประมูล"
         />
         <div className="container">
            <div className="box-search">
               <input
                  type="text"
                  placeholder="ค้นหาในตาราง..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
               />
            </div>
            <div className="box-table">
               <table>
                  <TableHead />
                  <tbody>
                     {payments?.map((item, index) => (
                        <TbodyRow
                           key={`TbodyRow-${item.id}`}
                           index={index + 1}
                           data={item}
                           setData={setPayments}
                        />
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
         <style jsx>
            {`
               .container {
                  background: white;
                  width: 98%;
                  margin-left: 1%;
                  margin-right: 1%;
                  margin-top: 10px;
                  padding: 10px 15px;
                  border-radius: 2px;
                  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
               }
               .box-search {
                  width: 250px;
                  margin-bottom: 1rem;
               }
               .box-search input {
                  width: 100%;
                  padding: 5px 10px;
                  border-radius: 4px;
               }
               .box-table {
                  max-width: 100%;
                  overflow: auto;
               }
               table {
                  width: 100%;
                  border-collapse: collapse;
               }
            `}
         </style>
      </Fragment>
   )
}

const head_table = [
   { id: 0, name: "#" },
   { id: 1, name: "วันที่", sort: true },
   { id: 2, name: "รูปภาพ" },
   { id: 3, name: "ชื่อลูกค้า", sort: true },
   { id: 4, name: "ลิ้งค์", sort: true },
   { id: 5, name: "ราคาประมูล" },
   { id: 6, name: "ค่าโอน" },
   { id: 7, name: "ค่าส่ง" },
   { id: 9, name: "รวม" },
   { id: 8, name: "สถานะ" },
   { id: 10, name: "แจ้งชำระ" },
   { id: 11, name: "หมายเหตุลูกค้า" },
   { id: 12, name: "หมายเหตุแอดมิน" },
   { id: 13, name: "จัดการ" },
]

function TableHead() {
   return (
      <thead>
         <tr>
            {head_table.map((head) => (
               <th key={`HeadTable-${head.id}`}>
                  <div className="box-th">
                     <div className="name">{head.name}</div>
                     {head.sort && <SortIcon />}
                  </div>
               </th>
            ))}
         </tr>
         <style jsx>
            {`
               thead {
                  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
               }
               thead th {
                  color: rgba(0, 0, 0, 0.85);
                  font-weight: 600;
                  position: relative;
                  padding: 7px 8px;
                  background: #f1f1f1;
                  text-align: left;
               }
               .box-th {
                  cursor: pointer;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
               }
               th:not(:last-child) .box-th::after {
                  content: "";
                  background: rgba(0, 0, 0, 0.06);
                  width: 1px;
                  height: 1.6em;
                  position: absolute;
                  top: 50%;
                  right: 0;
                  transform: translateY(-50%);
                  transition: background 0.3s;
               }
               th .box-th:hover::after {
                  background: white;
               }
               .name {
                  display: inline-block;
                  white-space: pre;
                  height: fit-content;
                  width: fit-content;
               }
               .icon {
                  display: inline-block;
               }
            `}
         </style>
      </thead>
   )
}

function TbodyRow({ data, setData, index }) {
   const [showDropdown, setShowDropdown] = useState(false)
   const [showEditModal, setShowEditModal] = useState(false)
   return (
      <tr>
         <th>{index}</th>
         <td>{data.date || "-"}</td>
         <td>
            {data.image ? (
               <img src={data.image} alt="" width={100} />
            ) : (
               "no image!"
            )}
         </td>
         <td>{data.username}</td>
         <td>
            <a href={data.link}>
               {
                  data.link.split(
                     "https://page.auctions.yahoo.co.jp/jp/auction/"
                  )[1]
               }
            </a>
         </td>
         <td>
            {new Intl.NumberFormat("ja-JP", {
               style: "currency",
               currency: "JPY",
               minimumFractionDigits: 2,
            }).format(data.bid)}
         </td>
         <td>
            {new Intl.NumberFormat("ja-JP", {
               style: "currency",
               currency: "JPY",
               minimumFractionDigits: 2,
            }).format(data.tranfer_fee)}
         </td>
         <td>
            {new Intl.NumberFormat("th-TH", {
               style: "currency",
               currency: "THB",
            }).format(data.delivery_fee)}
         </td>
         <td>
            <CalSum
               bid={data.bid}
               tranferFee={data.tranfer_fee}
               deliveryFee={data.delivery_fee}
               rateYen={data.rate_yen}
            />
         </td>
         <td>{data.payment_status}</td>
         <td>
            {data.notificated === 0 ? (
               <span style={{ color: "green" }}>แจ้งชำระแล้ว</span>
            ) : (
               <span style={{ color: "red" }}>รอการแจ้ง</span>
            )}
         </td>
         <td>{data.remark_user || "-"}</td>
         <td>{data.remark_admin || "-"}</td>
         <td>
            <button
               className="btn-dropdown"
               onClick={() => setShowDropdown(!showDropdown)}
            >
               <span className="text">จัดการ</span>
               <span className="icon">
                  <DownIcon fill="white" width="14" height="14" />
               </span>
            </button>
            <div className="dropdown-container">
               <div className={`dropdown-box ${showDropdown && "show"}`}>
                  <ul>
                     <li onClick={() => setShowEditModal(true)}>
                        <span>แก้ไข</span>
                     </li>
                     <li>
                        <span>ลบ</span>
                     </li>
                  </ul>
               </div>
            </div>
            {showEditModal && (
               <EditModal
                  setShow={setShowEditModal}
                  data={data}
                  setData={setData}
               />
            )}
         </td>
         <style jsx>
            {`
               tr {
                  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
               }
               tr td {
                  padding: 12px 8px;
                  color: rgba(0, 0, 0, 0.85);
                  position: relative;
               }
               .box-checkbox {
                  white-space: pre;
               }
               .btn-dropdown {
                  border: none;
                  background: #2e8bc0;
                  color: white;
                  border-radius: 5px;
                  padding: 3px 8px;
                  cursor: pointer;
               }
               .btn-dropdown .icon {
                  margin-left: 5px;
                  vertical-align: -0.2em;
               }
               .dropdown-container {
                  position: relative;
               }
               .dropdown-box {
                  overflow: hidden;
                  min-width: 100px;
                  max-height: 0px;
                  border-radius: 3px;
                  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1),
                     -1px -1px 1px rgba(0, 0, 0, 0.1);
                  transition: max-height 0.2s ease-in;
               }
               .dropdown-box ul {
                  padding: 0;
                  margin: 0;
               }
               .dropdown-box li {
                  list-style: none;
                  text-align: center;
                  padding: 5px 5px;
                  cursor: pointer;
                  background: white;
               }
               .dropdown-box li:hover {
                  background: rgba(0, 0, 0, 0.1);
                  color: #fff;
               }
               .dropdown-box li:not(:last-child) {
                  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
               }
               .dropdown-box.show {
                  height: fit-content;
                  max-height: 1000px;
               }
            `}
         </style>
      </tr>
   )
}

const CalSum = ({ bid, tranferFee, deliveryFee, rateYen }) => {
   if (!bid || !tranferFee || !deliveryFee) {
      return "-"
   }
   const sum = (bid + tranferFee) * rateYen + tranferFee
   const sum_format = new Intl.NumberFormat("th-TH", {
      currency: "THB",
      style: "currency",
   }).format(sum)
   return <span>{sum_format}</span>
}

const EditModal = ({ data, setShow, setData }) => {
   const [startDate, setStartDate] = useState("")
   const [payment, setPayment] = useState({
      date: "",
      delivery_fee: "",
      tranfer_fee: "",
      rate_yen: "",
      payment_status: "",
      notificated: "",
   })
   const handleChangeData = (e) => {
      setPayment((prev) => ({ ...prev, [e.target.name]: e.target.value }))
   }
   const handleSubmit = async (e) => {
      e.preventDefault()
      const body = {
         date: `${startDate.getDate()}/${
            startDate.getMonth() + 1
         }/${startDate.getFullYear()}`,
         delivery_fee: payment.delivery_fee === "" ? 0 : payment.delivery_fee,
         tranfer_fee: payment.tranfer_fee === "" ? 0 : payment.tranfer_fee,
         rate_yen: payment.rate_yen === "" ? 0 : payment.rate_yen,
         payment_status: payment.payment_status,
         notificated: payment.notificated === "0" ? 0 : 1,
      }
      try {
         const response = await fetch(`/api/yahoo/payment?id=${ payment.id}`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
         })
         const responseJson = await response.json()
         console.log(responseJson)
      } catch (err) {
         console.log(err)
      }
   }
   useEffect(() => {
      const dateSplit = data.date.split("/")
      const date = `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`
      setStartDate(new Date(date))
      setPayment(data)
      return () => {}
   }, [data])
   return (
      <form onSubmit={handleSubmit}>
         <Modal
            title="แก้ไขข้อมูล"
            onClose={() => setShow(false)}
            btnSubmitName="ยืนยันการแก้ไข"
            isBtnSubmit
         >
            <div className="container">
               <label>วันที่</label>
               <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
               />
               <label>ค่าโอน</label>
               <input
                  name="delivery_fee"
                  type="number"
                  value={payment.delivery_fee}
                  onChange={handleChangeData}
               />
               <label>ค่าส่ง</label>
               <input
                  name="tranfer_fee"
                  type="number"
                  value={payment.tranfer_fee}
                  onChange={handleChangeData}
               />
               <label>อัตราแลกเปลี่ยนจากเยนเป็นเงินบาท</label>
               <input
                  name="rate_yen"
                  type="number"
                  value={payment.rate_yen}
                  onChange={handleChangeData}
               />
               <label>สถานะ</label>
               <select
                  name="payment_status"
                  value={payment.payment_status}
                  onChange={handleChangeData}
               >
                  <option value="รอค่าโอนและค่าส่ง">รอค่าโอนและค่าส่ง</option>
                  <option value="รอการชำระเงิน">รอการชำระเงิน</option>
                  <option value="รอการตรวจสอบ">รอการตรวจสอบ</option>
                  <option value="ชำระเงินเสร็จสิ้น">ชำระเงินเสร็จสิ้น</option>
               </select>
               <label>สถานะการแจ้งชำระ</label>
               <select
                  name="notificated"
                  value={payment.notificated}
                  onChange={handleChangeData}
               >
                  <option value={0}>รอการแจ้ง</option>
                  <option value={1}>แจ้งชำระแล้ว</option>
               </select>
            </div>
         </Modal>
         <style jsx global>
            {`
               .react-datepicker-wrapper,
               .react-datepicker__input-container,
               .react-datepicker__input-container input {
                  display: block;
                  width: 100%;
                  margin-bottom: 10px;
               }
            `}
         </style>
         <style jsx>
            {`
               .container {
                  margin-top: 10px;
               }
               .input-date,
               input,
               select {
                  width: 100%;
                  margin-bottom: 10px;
               }
            `}
         </style>
      </form>
   )
}

YahooPaymentPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })
   // eslint-disable-next-line prefer-template
   const api = process.env.BACKEND_URL + "/api/yahoo/payment"

   const response = await fetch(api).then((res) => res.json())
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
         payments: response.payments,
      },
   }
}

export default YahooPaymentPage
