import query from "../../mysql/connection"


async function getInvoiceShipBilling(queryData) {
   try {
      const { pageSize = 10, current = 0, voyage, tabSelect } = queryData

      let queryString = `
        WITH DATASOURCE AS (
            SELECT 
                trackings.user_id, 
                users.username,
                trackings.voyage
            FROM trackings
            JOIN users ON users.id = trackings.user_id 
            WHERE 1=1
               AND trackings.voyage = ?
               AND trackings.airbilling = 0
               AND trackings.cont_status != 99
            GROUP BY trackings.user_id, users.username, trackings.voyage
        )
        SELECT 
            t2.id AS shipbillingId,
            t2.voyage AS voyage,
            t2.user_id AS userId,
            t1.username,
            t2.voyage_price AS voyagePrice,
            t2.payment_type AS paymentType,
            t2.delivery_type AS deliveryType,
            CASE
               WHEN t2.ship_billing_status IS NULL THEN 'unpaid'
               ELSE t2.ship_billing_status
            END AS shipBillingStatus,
            t2.remark
        FROM DATASOURCE t1
        LEFT JOIN ship_billing t2 ON t2.voyage = t1.voyage AND t2.user_id = t1.user_id
        WHERE 1=1
        AND 1 = (
            CASE
               WHEN ? = 'all' OR (? = 'unpaid' AND ship_billing_status IS NULL) THEN 1
               WHEN ship_billing_status = ? THEN 1
               ELSE 0
            END
        )
        `
      let data = [voyage, tabSelect, tabSelect, tabSelect]
      queryString += "\nORDER BY t1.username ASC LIMIT ? OFFSET ?"
      data = [
         ...data,
         parseInt(pageSize),
         parseInt(pageSize) * parseInt(current),
      ]
      const total = await getTotal(queryData)
      const results = await query(queryString, data)

      return {
         results,
         total,
         pageSize: parseInt(pageSize),
         current: parseInt(current),
      }
   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error(
         "An error occurred while fetching data from getAllMoneyInManual."
      )
   }
}

async function getTotal(queryData) {
   const { voyage, tabSelect } = queryData
   let queryString = `
   WITH DATASOURCE AS (
        SELECT 
            trackings.user_id, 
            users.username,
            trackings.voyage,
            trackings.box_no
        FROM trackings
        JOIN users ON users.id = trackings.user_id 
        WHERE 1=1
        AND trackings.voyage = ?
        AND trackings.airbilling = 0
        AND trackings.cont_status != 99
    )
    SELECT 
        COUNT(*) AS count
    FROM DATASOURCE t1
    LEFT JOIN ship_billing t2 ON t2.voyage = t1.voyage AND t2.user_id = t1.user_id
    WHERE 1=1
    AND 1 = (
            CASE
               WHEN ? = 'all' OR (? = 'unpaid' AND ship_billing_status IS NULL) THEN 1
               WHEN ship_billing_status = ? THEN 1
               ELSE 0
            END
        )
   `
   let data = [voyage, tabSelect, tabSelect, tabSelect]
   const results = await query(queryString, data)
   return results[0].count
}

export default getInvoiceShipBilling
