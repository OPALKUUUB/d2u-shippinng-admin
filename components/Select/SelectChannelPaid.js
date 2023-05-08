import { Select, Space } from "antd"

export default function SelectPaidChannel({ id, defaultValue, onOk }) {
   return (
      <Space>
         <Select
            defaultValue={defaultValue}
            value={defaultValue}
            onChange={(value) => onOk(id, value)}
            options={[
               { label: "Select", value: "" },
               { label: "9980", value: "9980" },
               { label: "3493", value: "3493" },
               { label: "บัตรญี่ปุ่น", value: "บัตรญี่ปุ่น" },
               { label: "MERPAY", value: "MERPAY" },
               { label: "PAYPAY", value: "PAYPAY" },
               { label: "COMBINI", value: "COMBINI" },
               { label: "โอนเงิน", value: "โอนเงิน" },
            ]}
         />
      </Space>
   )
}
