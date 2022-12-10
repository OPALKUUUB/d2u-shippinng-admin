import React from "react"
import Layout from "../../../components/layout/layout"

function PackerPage() {
   return <div>PackerPage</div>
}

PackerPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}
export default PackerPage
