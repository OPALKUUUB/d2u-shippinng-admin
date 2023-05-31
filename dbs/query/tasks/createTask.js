import query from "../../mysql/connection"

// ... your existing code ...

async function createTask(taskData) {
   const { title, price, startDate, endDate } = taskData
   console.log(taskData)
   const result = await query(
      `
    INSERT INTO tasks (title, price, start_date, end_date)
    VALUES (?, ?, ?, ?)
  `,
      [title, price, startDate, endDate]
   )

   return result.insertId
}

export default createTask
