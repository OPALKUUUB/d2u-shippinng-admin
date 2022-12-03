import axios from "axios"
import { getSession } from "next-auth/react"
import { useRouter } from "next/router"
import React, { Fragment, useRef, useState } from "react"
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"

function YahooAddPage(props) {
   const router = useRouter()
   const { users } = props
   const [detail, setDetail] = useState()
   const [images, setImages] = useState()
   const [name, setName] = useState()
   const [price, setPrice] = useState()
   const [nameUserInput, setNameUserInput] = useState("")
   const [showUsersOption, setshowUsersOption] = useState(false)
   const linkRef = useRef()
   const maxbidRef = useRef()
   const remarkUserRef = useRef()
   const searchLink = async () => {
      // test link
      // const link = "https://page.auctions.yahoo.co.jp/jp/auction/q1073037683";
      const link = linkRef.current.value
      if (!link.includes("https://page.auctions.yahoo.co.jp/jp/auction/")) {
         alert("Link doesn't match")
         return
      }
      try {
         const response = await fetch(
            "/api/yahoo/clawing",
            {
               method: "POST",
               headers: {
                  "Content-type": "application/json",
               },
               body: JSON.stringify({ link }),
            }
         ).then((res) => res.json())
         setDetail(response.detail)
         setImages(response.image)
         setName(response.title)
         const num = parseFloat(response.price.replace(/,/g, ""))
         setPrice(num)
      } catch (err) {
         console.log(err)
         alert("Error")
      }
   }
   const handleSubmit = async (e) => {
      e.preventDefault()
      const link = linkRef.current.value
      const maxbid = maxbidRef.current.value
      const remarkUser = remarkUserRef.current.value
      if (maxbid < price) {
         alert("ราคาประมูลต่ำเกินไป")
         return
      }
      console.log(nameUserInput)
      // eslint-disable-next-line prefer-const
      let userFilter = users.filter((ft) => ft.username.includes(nameUserInput))
      if (userFilter.length === 0) {
         alert("เลือกผู้ประมูล")
      }
      const user_id = userFilter[0].id
      const body = {
         user_id,
         image: images[0],
         link,
         name,
         price,
         detail: JSON.stringify(detail),
         maxbid,
         remark_user: remarkUser,
      }
      try {
         await axios.post("/api/yahoo/order", body)
         alert("เพิ่มข้อมูลสำร็จ!")
         router.replace("/yahoo/bidding")
         // alert(response.data.message)
      } catch (err) {
         alert("เพิ่มข้อมูลล้มเหลว!")
         // alert(err.response.data.message)
      }
   }
   return (
      <Fragment>
         <CardHead
            name="Add Yahoo Auction"
            description="* หน้าเพิ่มข้อมูลประมูลสินค้า Yahoo ของแอดมิน"
         />
         <div className="container">
            <div className="box-form">
               <div>
                  <label>เลือกผู้ประมูล: </label>
                  <input
                     type="text"
                     value={nameUserInput}
                     onChange={(e) => setNameUserInput(e.target.value)}
                     onFocus={() => setshowUsersOption(true)}
                     onBlur={() => {
                        setTimeout(() => {
                           setshowUsersOption(false)
                        }, 1500)
                     }}
                     onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                           setNameUserInput(() => {
                              const findUser = users.filter(
                                 (ft) =>
                                    ft.username.includes(nameUserInput) ||
                                    ft.name
                                       .toLowerCase()
                                       .includes(nameUserInput)
                              )
                              if (findUser.length === 0) {
                                 alert(
                                    // eslint-disable-next-line prefer-template
                                    "not found user that include " +
                                       e.target.value
                                 )
                                 return e.target.value
                              }
                              return findUser[0].username
                           })
                        }
                     }}
                  />
                  {showUsersOption && (
                     <ul>
                        {users
                           .filter(
                              (ft) =>
                                 ft.username.includes(nameUserInput) ||
                                 ft.name.toLowerCase().includes(nameUserInput)
                           )
                           .map((user) => (
                              <li
                                 key={`UserOption-${user.id}`}
                                 onClick={() => setNameUserInput(user.username)}
                              >
                                 {user.username}
                              </li>
                           ))}
                     </ul>
                  )}
               </div>
               <form onSubmit={handleSubmit}>
                  <div className="box-input">
                     <label>ใส่ลิงค์ประมูล: </label>
                     <input type="text" name="link" ref={linkRef} />
                     <button type="button" onClick={searchLink}>
                        ค้นหาลิ้งค์ประมูล
                     </button>
                  </div>
                  {name && images && detail && price && (
                     <div>
                        <img src={images[0]} alt={name} />
                        <h3>{name}</h3>
                        <p>{price}</p>
                     </div>
                  )}

                  <div>
                     <label>ราคา: </label>
                     <input type="number" ref={maxbidRef} />
                  </div>
                  <div>
                     <label>หมายเหตุ: </label>
                     <textarea ref={remarkUserRef} />
                  </div>
                  <button type="submit">ยืนยันการประมูล</button>
               </form>
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
            `}
         </style>
      </Fragment>
   )
}

YahooAddPage.getLayout = function getLayout(page) {
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
   const response = await axios
      // eslint-disable-next-line prefer-template
      .get(process.env.BACKEND_URL + "/api/user")
      .then((res) => res.data)
   return {
      props: {
         users: response.users,
         session,
      },
   }
}

export default YahooAddPage
