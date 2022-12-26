import { Fragment, useEffect, useRef, useState } from "react"
import { getSession } from "next-auth/react"
import { useRouter } from "next/router"
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"
import SortIcon from "../../../components/icon/SortIcon"
import DownIcon from "../../../components/icon/DownIcon"
import Modal from "../../../components/Modal"

function YahooBiddingPage(props) {
   const router = useRouter()
   const [orders, setOrders] = useState(props.orders)
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
            name="Yahoo Bidding Auction"
            description="* แสดงรายการประมูลสินค้าที่ลูกค้าสั่งประมูล"
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
                     {orders?.map((item, index) => (
                        <TbodyRow
                           key={`TbodyRow-${item.id}`}
                           index={index + 1}
                           data={item}
                           setData={setOrders}
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
   { id: 9, name: "#" },
   { id: 1, name: "วันที่", sort: true },
   { id: 2, name: "รูปภาพ" },
   { id: 3, name: "ชื่อลูกค้า", sort: true },
   { id: 4, name: "ลิ้งค์", sort: true },
   { id: 5, name: "ราคาประมูล" },
   { id: 6, name: "หมายเหตุลูกค้า" },
   { id: 7, name: "หมายเหตุแอดมิน" },
   { id: 8, name: "จัดการ" },
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
   const [showWinModal, setShowWinModal] = useState(false)
   const handleDelete = async () => {
      const order_id = data.id
      if (window.confirm(`คุณต้องการที่จะลบรายการประมูลที่ ${index} ?`)) {
         try {
            const response = await fetch("/api/yahoo/order", {
               method: "DELETE",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ order_id }),
            }).then((res) => res.json())
            setData(response.orders)
         } catch (err) {
            console.log(err)
            alert("Error!")
         }
      }
   }
   const handleLose = async () => {
      const order_id = data.id
      if (
         window.confirm(
            `คุณแน่ใจที่จะเเปลี่ยนสถานะของรายการประมูลที่ ${index} เป็นแพ้ ?`
         )
      ) {
         try {
            const response = await fetch(`/api/yahoo/order/lose/${order_id}`, {
               method: "PUT",
               headers: {
                  "Content-Type": "application/json",
               },
            }).then((res) => res.json())
            // console.log(response)
            setData(response.orders)
            alert("Change status to lose success!")
         } catch (err) {
            console.log(err)
            alert("Error!")
         }
      }
   }
   return (
      <tr>
         <th>{index}</th>
         <td>
            {data.created_at.split(" ")[0]}
            <br />
            {data.created_at.split(" ")[1]}
         </td>
         <td>
            {data.image ? (
               <img src={data.image} alt={data.name} width={100} />
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
            <div className="box-checkbox">
               <span>#1: </span>
               <BiddingCheckBox
                  setData={setData}
                  bidding={data.maxbid}
                  id={data.id}
                  bidby={data.admin_maxbid_username}
                  name="maxbid"
               />
            </div>
            <div className="box-checkbox">
               <span>#2: </span>
               <BiddingCheckBox
                  setData={setData}
                  bidding={data.addbid1}
                  id={data.id}
                  bidby={data.admin_addbid1_username}
                  name="addbid1"
               />
            </div>
            <div className="box-checkbox">
               <span>#3: </span>
               <BiddingCheckBox
                  setData={setData}
                  bidding={data.addbid2}
                  id={data.id}
                  bidby={data.admin_addbid2_username}
                  name="addbid2"
               />
            </div>
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
                        <span>หมายเหตุ</span>
                     </li>
                     <li onClick={() => setShowWinModal(true)}>
                        <span>ชนะ</span>
                     </li>
                     <li onClick={handleLose}>
                        <span>แพ้</span>
                     </li>
                     <li onClick={handleDelete}>
                        <span>ลบ</span>
                     </li>
                  </ul>
               </div>
            </div>
            {showEditModal && (
               <EditModal
                  setShow={setShowEditModal}
                  remark_admin={data.remark_admin}
                  id={data.id}
                  setData={setData}
               />
            )}
            {showWinModal && (
               <WinModal
                  setShow={setShowWinModal}
                  order_id={data.id}
                  user_id={data.user_id}
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

const EditModal = ({ id, remark_admin, setShow, setData }) => {
   const [remark, setRemark] = useState()
   const handleSubmit = async (e) => {
      e.preventDefault()
      try {
         // eslint-disable-next-line prefer-template
         const response = await fetch("/api/yahoo/order/remark-admin/" + id, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ remark }),
         }).then((res) => res.json())
         // console.log(response.orders)
         setData(response.orders)
      } catch (err) {
         console.log(err)
         alert("Error!")
      }
   }
   useEffect(() => {
      setRemark(remark_admin || "")
   }, [remark_admin])
   return (
      <form onSubmit={handleSubmit}>
         <Modal
            onClose={() => setShow(false)}
            title="เพิ่มหมายเหตุแอดมิน"
            height="200px"
            btnSubmitName="ยืนยันการแก้ไขหมายเหตุ"
            isBtnSubmit
         >
            <div className="Modal-container">
               <label>* หมายเหตุ:</label>
               <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
               />
            </div>
         </Modal>
         <style jsx>
            {`
               .Modal-container {
                  margin-top: 10px;
               }
               .Modal-container label {
                  margin-bottom: 10px;
               }
               .Modal-container textarea {
                  width: 100%;
                  display: block;
                  border-radius: 4px;
                  padding: 8px;
               }
            `}
         </style>
      </form>
   )
}

function WinModal({ setShow, order_id, user_id, setData }) {
   const bidRef = useRef()
   const tranferFeeRef = useRef()
   const deliveryFeeRef = useRef()
   const paymentStatusRef = useRef()
   const handleSubmit = async (e) => {
      e.preventDefault()
      // console.log(order_id, user_id)
      const bid = bidRef.current.value
      const tranfer_fee = tranferFeeRef.current.value
      const delivery_fee = deliveryFeeRef.current.value
      const payment_status = paymentStatusRef.current.value
      try {
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
            }),
         }).then((res) => res.json())
         alert("Add Payment Success!")
         setData(response.orders)
      } catch (err) {
         console.log(err)
         alert("Error!")
      }
   }
   return (
      <form onSubmit={handleSubmit}>
         <Modal
            onClose={() => setShow(false)}
            title="เพิ่มรายการประมูลที่ชนะ"
            btnSubmitName="ยืนยันการเปลี่ยนสถานะ"
            isBtnSubmit
         >
            <div className="container">
               <label>* ราคาที่ประมูลได้:</label>
               <input type="number" ref={bidRef} />
               <label>ค่าธรรมเนียมการโอน(฿):</label>
               <input type="number" ref={tranferFeeRef} />
               <label>ค่าขนส่ง(￥):</label>
               <input type="number" ref={deliveryFeeRef} />
               <label>* สถานะการชำระเงิน:</label>
               <select ref={paymentStatusRef}>
                  <option value="รอค่าโอนและค่าส่ง">รอค่าโอนและค่าส่ง</option>
                  <option value="รอการชำระเงิน">รอการชำระเงิน</option>
               </select>
            </div>
         </Modal>
         <style jsx>
            {`
               .container {
                  margin-top: 10px;
               }
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

function BiddingCheckBox({ bidding, id, bidby, name, setData }) {
   const [check, setCheck] = useState(false)
   const handleCheck = async () => {
      // eslint-disable-next-line prefer-template
      // setCheck(!check)
      try {
         const response = await fetch(`/api/yahoo/order/addbid/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               name,
               check,
            }),
         }).then((res) => res.json())
         // setCheck(!check)
         setData(response.orders)
      } catch (err) {
         console.log(err)
         alert("Error!")
      }
   }
   useEffect(() => {
      if (bidby) {
         setCheck(true)
      }
   }, [bidby])
   if (bidding) {
      return (
         <span className="bidding">
            <input type="checkbox" checked={check} onChange={handleCheck} />
            <span>
               {new Intl.NumberFormat("ja-JP", {
                  style: "currency",
                  currency: "JPY",
               }).format(bidding)}
            </span>
            {bidby && <span>({bidby})</span>}
            <style jsx>
               {`
                  .bidding {
                     display: inline-block;
                  }
                  input {
                     vertical-align: -0.125em;
                     width: 15px;
                     height: 15px;
                     cursor: pointer;
                  }
               `}
            </style>
         </span>
      )
   }
   return "-"
}

YahooBiddingPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })
   // eslint-disable-next-line prefer-template
   const api =  "/api/yahoo/order"
   const response = await fetch(api).then((res) => res.json())
   // console.log(response)
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
         orders: response.orders,
      },
   }
}

// const datas = [
//    {
//       id: 1,
//       date: "01/12/2022",
//       image: null,
//       username: "opal",
//       link: "https://opalnakuuub.com/skuid",
//       maxbid: 2000,
//       addbid1: 2001,
//       addbid2: 2004,
//       remark_user: "this data use for test",
//       remark_admin: "this data use for test data of admin",
//    },
//    {
//       id: 2,
//       date: "01/12/2022",
//       image: null,
//       username: "opal",
//       link: "https://opalnakuuub.com/skuid",
//       maxbid: 2000,
//       addbid1: 2001,
//       addbid2: 2004,
//       remark_user: "this data use for test",
//       remark_admin: "this data use for test data of admin",
//    },
//    {
//       id: 3,
//       date: "01/12/2022",
//       image: null,
//       username: "opal",
//       link: "https://opalnakuuub.com/skuid",
//       maxbid: 2000,
//       addbid1: 2001,
//       addbid2: 2004,
//       remark_user: "this data use for test",
//       remark_admin: "this data use for test data of admin",
//    },
//    {
//       id: 4,
//       date: "01/12/2022",
//       image: null,
//       username: "opal",
//       link: "https://opalnakuuub.com/skuid",
//       maxbid: 2000,
//       addbid1: 2001,
//       addbid2: 2004,
//       remark_user: "this data use for test",
//       remark_admin: "this data use for test data of admin",
//    },
//    {
//       id: 5,
//       date: "01/12/2022",
//       image: null,
//       username: "opal",
//       link: "https://opalnakuuub.com/skuid",
//       maxbid: 2000,
//       addbid1: 2001,
//       addbid2: 2004,
//       remark_user: "this data use for test",
//       remark_admin: "this data use for test data of admin",
//    },
// ]

export default YahooBiddingPage
