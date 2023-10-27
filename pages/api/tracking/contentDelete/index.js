/* eslint-disable indent */
/* eslint-disable no-use-before-define */
import getContentDeleteTrackings from "../../../../dbs/query/trackings/getContentDeleteTrackings"

async function handlers(req, res) {
    const { method, body } = req

    switch (method) {
        case "GET":
            console.log("GET::/api/for-accountant/money-in")
            handleGetRequest(res)
            break
        default:
            res.status(405).json({ code: 405, message: "Method Not Allowed" })
    }
}

async function handleGetRequest(res) {
    try {
        const trackingData = await getContentDeleteTrackings()
        res.status(200).json({ code: 200, message: "Success", data: trackingData })
    } catch (error) {
        console.error("Error fetching money in data:", error.message)
        res.status(500).json({
            code: 500,
            message: "An error occurred while fetching money in data",
        })
    }
}

export default handlers
