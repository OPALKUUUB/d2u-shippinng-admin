import { getSession } from "next-auth/react"
import Layout from "../../../components/layout/layout"
import TrackingContentDelete from "../../../components/report/tracking-content-delete"
import CardHead from "../../../components/CardHead"

function ContentDeleteTracking() {
    return (
        <div className="w-full">
            <CardHead name="ประวัติการลบรายการ" description="แสดงรายการที่ถูกลบใน mercari, fril, shimizu, web123 (ตอนนี้ยังไม่สามารถเก็บประวัติของ yahoo ได้)" />
            <div className="bg-white px-4 py-3 m-2">
                <TrackingContentDelete />
            </div>
        </div>
    )
}

ContentDeleteTracking.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req })

    if (!session) {
        return {
            redirect: {
                destination: "/auth/signin",
                permanent: false,
            },
        }
    }
    return {
        props: { session },
    }
}
export default ContentDeleteTracking;