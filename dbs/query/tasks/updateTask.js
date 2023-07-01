import query from "../../mysql/connection"

async function updateTask(taskId, taskData) {
   const { title, desc, start_date, end_date, team } = taskData
   console.log(taskData, taskId)
   const date = new Date()
   const nowDateString = date.toLocaleString()
   const result = await query(
      `
    UPDATE tasks
    SET title = ?, \`desc\` = ?, start_date = ?, end_date = ?, updated_at = ?, team = ?
    WHERE task_id = ?
  `,
      [title, desc, start_date, end_date, nowDateString, team, taskId]
   )
   console.log(result)

   return result.affectedRows
}

export default updateTask
