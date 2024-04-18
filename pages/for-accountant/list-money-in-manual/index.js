import Layout from "../../../components/layout/layout"
import { ListMoneyInManualProvider } from "../../../context/ListMoneyInManualContext"
import ListMoneyInManualTable from "../../../components/list-money-in-manual/component/ListMoneyInManualTable"

const title = "รายการเงินเข้า"

function ListMoneyInManualPage() {
   const renderTitle = () => (
      <div className="font-bold text-[1.2rem] mb-4">{title}</div>
   )

   return (
      <ListMoneyInManualProvider>
         <div className="p-4">
            <div className="bg-white rounded-lg p-4">
               {renderTitle()}
               <ListMoneyInManualTable />
            </div>
         </div>
      </ListMoneyInManualProvider>
   )
}

ListMoneyInManualPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export default ListMoneyInManualPage
