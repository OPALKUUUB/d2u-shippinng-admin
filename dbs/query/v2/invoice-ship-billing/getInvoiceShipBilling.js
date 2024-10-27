import query from "../../../mysql/connection"

/**
 * Utility function to handle optional conditions in SQL queries
 * @param {string} condition - SQL condition template
 * @param {any} value - Condition value, will include condition only if truthy
 * @returns {string} - Constructed SQL condition or empty string
 */
const optionalCondition = (condition, value) => (value ? condition : "")

/**
 * Utility function for calculating pagination offset
 * @param {number} pageSize - Size of the page
 * @param {number} current - Current page number
 * @returns {number} - Offset for SQL query
 */
const calculateOffset = (pageSize, current) =>
   Math.max((current - 1) * pageSize, 0)

async function getInvoiceShipBilling(queryData) {
   try {
      const {
         pageSize = 10,
         current = 1,
         voyage,
         shipBillingStatus,
      } = queryData

      // Validate required parameters
      if (!voyage) {
         throw new Error("Voyage parameter is required.")
      }

      const validatedPageSize = Math.max(Number(pageSize), 1)
      const validatedCurrentPage = Math.max(Number(current), 1)
      const offset = calculateOffset(validatedPageSize, validatedCurrentPage)

      // Reusable base query (common to data and count queries)
      const baseQuery = `
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
      `

      // Dynamically construct condition for shipBillingStatus
      const statusCondition = optionalCondition(
         shipBillingStatus === "D"
            ? " AND (t2.ship_billing_status = 'D' OR t2.ship_billing_status IS NULL)"
            : " AND t2.ship_billing_status = ? ",
         shipBillingStatus
      )

      // Query to fetch data
      const dataQuery = `
        ${baseQuery}
        SELECT 
            t2.id AS shipbillingId,
            t2.voyage AS voyage,
            t2.user_id AS userId,
            t1.username,
            t2.voyage_price AS voyagePrice,
            t2.payment_type AS paymentType,
            t3.content_data AS contentData,
            t2.delivery_type AS deliveryType,
            CASE
              WHEN t2.ship_billing_status IS NULL THEN 'D'
              ELSE t2.ship_billing_status
            END AS shipBillingStatus,
            t4.money_in_status AS slipStatus,
            t2.remark
        FROM DATASOURCE t1
        LEFT JOIN ship_billing t2 ON t2.voyage = t1.voyage AND t2.user_id = t1.user_id
        LEFT JOIN invoice t3 ON t3.ship_billing_id = t2.id
        LEFT JOIN mny_in t4 ON t4.content_data -> '$.shipBillingId' = t2.id
        WHERE 1=1
        ${statusCondition}
        ORDER BY t1.username ASC 
        LIMIT ? OFFSET ?
      `

      // Parameters for data query
      const dataParams = [
         voyage,
         ...(shipBillingStatus && shipBillingStatus !== "D"
            ? [shipBillingStatus]
            : []),
         validatedPageSize,
         offset,
      ]

      // Execute data query
      const shipBillingData = await query(dataQuery, dataParams)

      // Query to count total rows
      const countQuery = `
        ${baseQuery}
        SELECT COUNT(*) AS totalRows
        FROM DATASOURCE t1
        LEFT JOIN ship_billing t2 ON t2.voyage = t1.voyage AND t2.user_id = t1.user_id
        LEFT JOIN invoice t3 ON t3.ship_billing_id = t2.id
        WHERE 1=1
        ${statusCondition}
      `

      // Parameters for count query
      const countParams = [
         voyage,
         ...(shipBillingStatus && shipBillingStatus !== "D"
            ? [shipBillingStatus]
            : []),
      ]

      // Execute count query
      const totalResults = await query(countQuery, countParams)
      const total = totalResults?.[0]?.totalRows || 0

      // Return formatted response
      return {
         results: shipBillingData,
         total,
         pageSize: validatedPageSize,
         current: validatedCurrentPage,
      }
   } catch (error) {
      console.error("Error fetching invoice ship billing data:", error.message)
      throw new Error(
         "An error occurred while fetching invoice ship billing data."
      )
   }
}

export default getInvoiceShipBilling
