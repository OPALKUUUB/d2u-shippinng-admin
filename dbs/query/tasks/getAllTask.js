import query from "../../mysql/connection"

async function getAllTask() {
   const results = await query(`
        SELECT
        t.task_id as id,
        t.title,
        t.desc,
        t.team,
        t.start_date,
        t.end_date,
        t.created_at,
        t.updated_at
        FROM tasks t
        ORDER BY t.created_at desc
   `)
   return results
}

export default getAllTask
