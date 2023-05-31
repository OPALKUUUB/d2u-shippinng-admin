import query from "../../mysql/connection"

async function getAllTask() {
   const results = await query(`
        SELECT
        t.task_id as id,
        t.title,
        t.price,
        t.start_date,
        t.end_date
        FROM tasks t
   `)
   return results
}

export default getAllTask
