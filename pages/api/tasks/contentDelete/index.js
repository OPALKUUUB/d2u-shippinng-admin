import getDeleteTask from "../../../../dbs/query/tasks/getDeleteTask"

async function handlers(req, res) {
    const { method, body } = req
    if (method === "GET") {
        console.log("GET::/api/tasks/contentDelete")
        try {
            const tasks = await getDeleteTask()
            res.status(200).json({
                code: 200,
                message: "OK",
                tasks,
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ code: 500, message: "SERVER ERROR" })
        }
    }
}

export default handlers
