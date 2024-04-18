import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Form, Select, message } from "antd"
import { MoneyInManualContext } from "../context/MoneyInManualContext"

function SelectCustomerFormItem() {
   const { form, setUser, setLoading } = useContext(MoneyInManualContext)
   const [customerOptions, setCustomerOptions] = useState(null)

   const getCustomerOptions = async () => {
      try {
         const response = await axios.get("/api/user")
         const responseData = response.data
         const users = responseData.users.reduce(
            (acc, curr) => [
               ...acc,
               {
                  label: curr.username,
                  value: `${curr.id}`,
               },
            ],
            [{ label: "กรุณาเลือก", value: "" }]
         )
         return users
      } catch (error) {
         console.log(error)
         throw error
      }
   }

   const onSelectCustomerChange = (value, option) => {
      form.setFieldsValue({ userId: value })
      setUser({ userId: value, username: option.label })
   }

   useEffect(() => {
      ;(async () => {
         try {
            setLoading(true)
            setCustomerOptions(await getCustomerOptions())
         } catch (err) {
            console.error(err)
            message.error("ดึงข้อมูลลูกค้าไม่สำเร็จ!")
            setCustomerOptions([])
         } finally {
            setLoading(false)
         }
      })()
   }, [])

   return (
      <Form.Item
         className="w-[300px] mb-0"
         label="ชื่อลูกค้า"
         name="userId"
         rules={[
            {
               required: true,
               message: "กรุณาเลือกชื่อลูกค้า",
            },
         ]}
      >
         <Select
            showSearch
            placeholder="เลือกชื่อลูกค้า"
            options={customerOptions || []}
            optionFilterProp="children"
            filterOption={(input, option) =>
               (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={onSelectCustomerChange}
         />
      </Form.Item>
   )
}

export default SelectCustomerFormItem
