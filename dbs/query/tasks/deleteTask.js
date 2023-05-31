import query from "../../mysql/connection"

// ... your existing code ...

async function deleteTask(taskId) {
   const result = await query(
      `
    DELETE FROM tasks
    WHERE task_id = ?
  `,
      [taskId]
   )

   return result.affectedRows
}

export default deleteTask
