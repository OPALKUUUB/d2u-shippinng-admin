import query from "../../mysql/connection"

async function updateTask(taskId, taskData) {
   const { title, price, startDate, endDate } = taskData

   const result = await query(
      `
    UPDATE tasks
    SET title = ?, price = ?, start_date = ?, end_date = ?
    WHERE task_id = ?
  `,
      [title, price, startDate, endDate, taskId]
   )

   return result.affectedRows
}

export default updateTask
