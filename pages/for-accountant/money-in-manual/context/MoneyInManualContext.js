import { Form } from "antd"
import React, { useState } from "react"
import LoadingPage from "../../../../components/LoadingPage"

export const MoneyInManualContext = React.createContext(null)

export const MoneyInManualProvider = ({ children }) => {
   const [form] = Form.useForm()
   const [dataSource, setDataSource] = useState([])
   const [user, setUser] = useState({
      userId: "",
      username: "",
   })
   const [loading, setLoading] = useState(false)

   const handleResetDataSource = () => {
      setDataSource([])
   }

   return (
      <MoneyInManualContext.Provider
         value={{
            form,
            dataSource,
            setDataSource,
            resetDataSource: handleResetDataSource,
            setLoading,
            user,
            setUser,
         }}
      >
         <LoadingPage loading={loading} />
         {children}
      </MoneyInManualContext.Provider>
   )
}