import {
   Button,
   Card,
   Col,
   Divider,
   Form,
   InputNumber,
   Row,
   message,
} from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"

const QmodePage = ({ user_id, voyage }) => {
   const [trackings, setTrackings] = useState([])
   const [billing, setBilling] = useState({})
   const [user, setUser] = useState({})
   const [sumWeight, setSumWeight] = useState(0)
   async function getQmodeInvoiceUser(userId, argVoyage) {
      try {
         const responseData = await axios.get(
            `/api/shipbilling/qmode?voyage=${argVoyage}&user_id=${userId}`
         )
         console.log(responseData.data)
         const weight =
            Math.round(
               responseData.data.trackings.reduce(
                  (acc, curr) => acc + curr.weight,
                  0
               ) * 100
            ) / 100
         setTrackings(responseData.data.trackings)
         setBilling(responseData.data.billing)
         setUser(responseData.data.user)
         setSumWeight(weight)

         return responseData.data
         // eslint-disable-next-line no-useless-catch
      } catch (error) {
         throw error
      } finally {
         console.log("get Qmode Invoice User done!")
      }
   }
   function handleChangeQ(value) {
      setBilling((prevState) => ({
         ...prevState,
         q: value,
      }))
   }

   async function handleClickConfirmQ() {
      try {
         const responseData = await axios.put(`/api/shipbilling/qmode`, {
            q: billing.q,
            id: billing.id,
         })
         message.success("บันทึกจำนวนคิวสำเร็จ!")
         return responseData.data
         // eslint-disable-next-line no-useless-catch
      } catch (error) {
         message.error("บันทึกจำนวนคิวล้มเหลว!")
         throw error
      } finally {
         console.log("confirm q done!")
      }
   }
   async function handleConfirmCod(trackingId) {
      const { cod } = trackings.filter(
         (element) => element.id === trackingId
      )[0]
      try {
         const responseData = await axios.patch(`/api/shipbilling/qmode`, {
            cod,
            trackingId,
         })
         message.success("บันทึกจำนวน cod สำเร็จ!")
         return responseData.data
         // eslint-disable-next-line no-useless-catch
      } catch (error) {
         message.error("บันทึกจำนวน cod ล้มเหลว!")
         throw error
      } finally {
         console.log("confirm q done!")
      }
   }
   useEffect(() => {
      getQmodeInvoiceUser(user_id, voyage)
   }, [user_id, voyage])
   const title = `Invoice Q-mode ${voyage}`
   const sumCod = trackings.reduce((acc, curr) => acc + curr.cod, 0)
   let total = 0
   if (sumWeight < billing.q * 200) {
      total = Math.ceil(sumWeight * 150 * 100) / 100 + sumCod
   } else {
      const restPrice = (sumWeight - billing.q * 200) * 150
      const qPrice = billing.q * 15000
      total = Math.ceil((restPrice + qPrice) * 100) / 100 + sumCod
   }
   return (
      <div className="bg-slate-200 w-screen h-screen overflow-x-hidden px-5 py-5">
         <Card title={title}>
            <Card title="ข้อมูลลูกค้า" size="small" className="mb-5">
               <div>
                  <span className="font-semibold mr-2">ชื่อ:</span>
                  {user.name}
               </div>
               <div>
                  <span className="font-semibold mr-2">เบอร์ติดต่อ:</span>
                  {user.phone}
               </div>
               <div>
                  <span className="font-semibold mr-2">ที่อยู่:</span>
                  {user.address}
               </div>
            </Card>
            <Form>
               <Row className="-mb-6">
                  <Col span={4}>
                     <Form.Item
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 20 }}
                        label="จำนวนคิว"
                     >
                        <InputNumber
                           value={billing.q}
                           // eslint-disable-next-line react/jsx-no-bind
                           onChange={handleChangeQ}
                           step={0.1}
                        />
                     </Form.Item>
                  </Col>
                  <Col span={2}>
                     <Button
                        type="primary"
                        htmlType="submit"
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={handleClickConfirmQ}
                     >
                        ยืนยัน
                     </Button>
                  </Col>
               </Row>
            </Form>
            <Divider />
            <div>
               <table>
                  <thead>
                     <tr>
                        <th className="px-4 py-2 border-solid border-[0.5px]">
                           ลำดับ
                        </th>
                        <th className="px-4 py-2 border-solid border-[0.5px]">
                           ช่องทาง
                        </th>
                        <th className="px-4 py-2 border-solid border-[0.5px]">
                           แทรคกิ้ง
                        </th>
                        <th className="px-4 py-2 border-solid border-[0.5px]">
                           เลขกล่อง
                        </th>
                        <th className="px-4 py-2 border-solid border-[0.5px]">
                           น้ำหนัก(กก.)
                        </th>
                        <th className="px-4 py-2 border-solid border-[0.5px]">
                           cod(บาท)
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {trackings.map((item, index) => (
                        <tr key={item.id}>
                           <td className="px-4 py-2 border-solid border-[0.5px]">
                              {index + 1}
                           </td>
                           <td className="px-4 py-2 border-solid border-[0.5px]">
                              {item.channel}
                           </td>
                           <td className="px-4 py-2 border-solid border-[0.5px]">
                              {item.track_no}
                           </td>
                           <td className="px-4 py-2 border-solid border-[0.5px]">
                              {item.box_no}
                           </td>
                           <td className="px-4 py-2 border-solid border-[0.5px]">
                              {item.weight}
                           </td>
                           <td className="px-4 py-2 border-solid border-[0.5px]">
                              {item.cod}
                           </td>
                           <td className="pl-4">
                              <Row>
                                 <Col className="mr-3">
                                    <InputNumber
                                       onChange={(value) =>
                                          setTrackings((prev) => [
                                             ...prev.slice(0, index),
                                             { ...prev[index], cod: value },
                                             ...prev.slice(index + 1),
                                          ])
                                       }
                                       value={item.cod}
                                       size="small"
                                       step={0.1}
                                    />
                                 </Col>
                                 <Col>
                                    <Button
                                       size="small"
                                       onClick={() => handleConfirmCod(item.id)}
                                    >
                                       ยืนยัน
                                    </Button>
                                 </Col>
                              </Row>
                           </td>
                        </tr>
                     ))}
                  </tbody>
                  <tfoot>
                     <tr>
                        <th
                           className="px-4 py-2 border-solid border-[0.5px]"
                           colSpan={4}
                        >
                           น้ำหนักรวม(กก.)
                        </th>
                        <td className="px-4 py-2 border-solid border-[0.5px]">
                           {sumWeight}
                        </td>
                     </tr>
                     <tr>
                        <th
                           className="px-4 py-2 border-solid border-[0.5px]"
                           colSpan={4}
                        >
                           ราคารวม(บาท)
                        </th>
                        <td className="px-4 py-2 border-solid border-[0.5px]">
                           {total}
                        </td>
                     </tr>
                  </tfoot>
               </table>
            </div>
         </Card>
      </div>
   )
}

QmodePage.getInitialProps = async ({ query }) => {
   const { user_id, voyage } = query

   return { user_id, voyage }
}
export default QmodePage
