import createTask from "../../../dbs/query/tasks/createTask"
import deleteTask from "../../../dbs/query/tasks/deleteTask"
import getAllTask from "../../../dbs/query/tasks/getAllTask"
import updateTask from "../../../dbs/query/tasks/updateTask"

async function handlers(req, res) {
   const { method, body } = req
   if (method === "GET") {
      console.log("GET::/api/tasks")
      try {
         const tasks = await getAllTask()
         res.status(200).json({
            code: 200,
            message: "OK",
            tasks,
         })
      } catch (err) {
         console.log(err)
         res.status(500).json({ code: 500, message: "SERVER ERROR" })
      }
   } else if (method === "POST") {
      console.log("POST::/api/tasks")
      try {
         const taskId = await createTask(body)
         res.status(201).json({
            code: 201,
            message: "Task created successfully",
            taskId,
         })
      } catch (err) {
         console.log(err)
         res.status(500).json({ code: 500, message: "SERVER ERROR" })
      }
   } else if (method === "PUT") {
      console.log("PUT::/api/tasks")
      const { taskId } = req.query
      try {
         const rowsAffected = await updateTask(taskId, body)
         if (rowsAffected > 0) {
            res.status(200).json({
               code: 200,
               message: "Task updated successfully",
               taskId,
            })
         } else {
            res.status(404).json({ code: 404, message: "Task not found" })
         }
      } catch (err) {
         console.log(err)
         res.status(500).json({ code: 500, message: "SERVER ERROR" })
      }
   } else if (method === "DELETE") {
      console.log("DELETE::/api/tasks")
      const { taskId } = req.query
      try {
         const rowsAffected = await deleteTask(taskId)
         if (rowsAffected > 0) {
            res.status(200).json({
               code: 200,
               message: "Task deleted successfully",
               taskId,
            })
         } else {
            res.status(404).json({ code: 404, message: "Task not found" })
         }
      } catch (err) {
         console.log(err)
         res.status(500).json({ code: 500, message: "SERVER ERROR" })
      }
   }
}

export default handlers
