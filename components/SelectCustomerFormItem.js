import { useEffect, useState } from "react"
import axios from "axios"
import { Form, Select, message } from "antd"

function SelectCustomerFormItem(props) {
   const { form, setuser, setisloadcustomer } = props
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
      setuser({ userId: value, username: option.label })
   }

   useEffect(() => {
      ;(async () => {
         try {
            setisloadcustomer(true)
            setCustomerOptions(await getCustomerOptions())
         } catch (err) {
            console.error(err)
            message.error("ดึงข้อมูลลูกค้าไม่สำเร็จ!")
            setCustomerOptions([])
         } finally {
            setisloadcustomer(false)
         }
      })()
   }, [])

   return (
      <Form.Item
         {...props}
         label="ชื่อลูกค้า"
         name="userId"
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
