import React, { useState } from "react"
import Layout from "../../../components/layout/layout"
import LoadingPage from "../../../components/LoadingPage"
import MoneyInManualForm from "./components/MoneyInManualForm"
import { Form } from "antd"

const title = "เลือกรายการเงินเข้า manual"
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
            form: form,
            dataSource: dataSource,
            setDataSource: setDataSource,
            resetDataSource: handleResetDataSource,
            setLoading: setLoading,
            user: user,
            setUser: setUser,
         }}
      >
         <LoadingPage loading={loading} />
         {children}
      </MoneyInManualContext.Provider>
   )
}

function MoneyInManualPage() {
   const renderTitle = () => {
      return <div className="font-bold text-[1.2rem] mb-4">{title}</div>
   }

   return (
      <MoneyInManualProvider>
         <div className="p-4">
            <div className="bg-white rounded-lg p-4">
               {renderTitle()}
               <MoneyInManualForm />
            </div>
         </div>
      </MoneyInManualProvider>
   )
}

MoneyInManualPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export default MoneyInManualPage
