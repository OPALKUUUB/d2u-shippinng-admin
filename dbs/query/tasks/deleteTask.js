import query from "../../mysql/connection"

// ... your existing code ...

async function deleteTask(taskId) {
   //    const result = await query(
   //       `
   //     DELETE FROM tasks
   //     WHERE task_id = ?
   //   `,
   //       [taskId]
   //    )
   const result = await query(
      `
      UPDATE tasks
      SET task_status = 99
      WHERE task_id = ?
      `
      , [taskId]
   )

   return result.affectedRows
}

export default deleteTask
