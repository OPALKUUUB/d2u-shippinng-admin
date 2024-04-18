import Layout from "../../../components/layout/layout"
import ListMoneyInManualTable from "./component/ListMoneyInManualTable";
import { ListMoneyInManualProvider } from "./ListMoneyInManualContext";

const title = "รายการเงินเข้า"

function ListMoneyInManualPage() {
    

    const renderTitle = () => {
        return (
            <div className="font-bold text-[1.2rem] mb-4">
                {title}
            </div>
        );
    }
    
    return (
        <ListMoneyInManualProvider>
            <div className="p-4">
                <div className="bg-white rounded-lg p-4">
                    {renderTitle()}
                    <ListMoneyInManualTable/>
                </div>
            </div>
        </ListMoneyInManualProvider>
    );
}

ListMoneyInManualPage.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
 }

export default ListMoneyInManualPage;