import query from "../../mysql/connection"

// ... your existing code ...

async function createTask(taskData) {
   const { title, desc, startDate, endDate } = taskData
   console.log(taskData)
   const date = new Date()
   const nowDateString = date.toLocaleString()
   const result = await query(
      `
    INSERT INTO tasks (title, \`desc\`, start_date, end_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
      [title, desc, startDate, endDate, nowDateString, nowDateString]
   )

   return result.insertId
}

export default createTask
