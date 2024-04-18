import React from "react"
import Layout from "../../../components/layout/layout"
import MoneyInManualForm from "./components/MoneyInManualForm"
import { MoneyInManualProvider } from "./context/MoneyInManualContext"

const title = "เลือกรายการเงินเข้า manual"

function MoneyInManualPage() {
   const renderTitle = () => <div className="font-bold text-[1.2rem] mb-4">{title}</div>

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
