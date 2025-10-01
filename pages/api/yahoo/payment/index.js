import mysql from "../../../../lib/db"
import genDate from "../../../../utils/genDate"

async function handler(req, res) {
   if (req.method === "GET") {
      try {
         await mysql.connect()
         const yahoo_payments = await mysql.query(
            `SELECT 
               \`yahoo-auction-payment\`.*,
               users.username, 
               \`yahoo-auction-order\`.image, 
               \`yahoo-auction-order\`.link
            FROM 
               \`yahoo-auction-payment\` 
            JOIN 
               \`yahoo-auction-order\` 
            ON 
               \`yahoo-auction-order\`.payment_id = \`yahoo-auction-payment\`.id 
            JOIN 
               users 
            ON 
               users.id = \`yahoo-auction-payment\`.user_id
            WHERE
               \`yahoo-auction-payment\`.payment_status != ?`,
            ["ชำระเงินเสร็จสิ้น"]
         )
         await mysql.end()
         return res.status(200).json({
            message: "get order from table success!",
            payments: yahoo_payments,
         })
      } catch (error) {
         console.error("Database error:", error)
         await mysql.end()
         return res.status(500).json({
            message: "Database operation failed",
            error: error.message,
         })
      }
   } else if (req.method === "POST") {
      const {
         user_id,
         order_id,
         bid,
         tranfer_fee,
         delivery_fee,
         payment_status,
         status,
      } = req.body

      // Input validation
      if (!user_id || !order_id || !status) {
         return res.status(400).json({
            message: "Missing required fields",
            error: "user_id, order_id, and status are required",
         })
      }

      if (!["ชนะ", "แพ้"].includes(status)) {
         return res.status(400).json({
            message: "Invalid status value",
            error: "status must be either 'ชนะ' or 'แพ้'",
         })
      }

      // Sanitize numeric values - convert empty strings to null or 0
      const sanitizedBid =
         bid === "" || bid === null || bid === undefined
            ? null
            : parseFloat(bid)
      const sanitizedTransferFee =
         tranfer_fee === "" || tranfer_fee === null || tranfer_fee === undefined
            ? 0
            : parseFloat(tranfer_fee)
      const sanitizedDeliveryFee =
         delivery_fee === "" ||
         delivery_fee === null ||
         delivery_fee === undefined
            ? 0
            : parseFloat(delivery_fee)

      // Validation for required fields when status is "ชนะ"
      if (status === "ชนะ") {
         if (
            sanitizedBid === null ||
            Number.isNaN(sanitizedBid) ||
            sanitizedBid <= 0
         ) {
            return res.status(400).json({
               message: "Bid amount is required when status is 'ชนะ'",
               error: "Bid must be a positive number",
            })
         }

         if (
            !payment_status ||
            !["รอค่าโอนและค่าส่ง", "รอการชำระเงิน"].includes(payment_status)
         ) {
            return res.status(400).json({
               message: "Invalid payment status",
               error: "payment_status must be 'รอค่าโอนและค่าส่ง' or 'รอการชำระเงิน'",
            })
         }

         // Validate numeric fields are not negative
         if (sanitizedTransferFee < 0 || sanitizedDeliveryFee < 0) {
            return res.status(400).json({
               message: "Invalid fee values",
               error: "Transfer fee and delivery fee cannot be negative",
            })
         }
      }

      const date = genDate()

      try {
         await mysql.connect()

         if (status === "แพ้") {
            await mysql.query(
               "UPDATE `yahoo-auction-order` SET status = ?, updated_at = ? WHERE id = ?",
               ["แพ้", date, order_id]
            )

            // Use optimized query similar to order endpoint
            const yahoo_orders_of_lose = await mysql.query(`
               SELECT 
                  yo.*,
                  u.username,
                  a1.username as admin_maxbid_username,
                  a2.username as admin_addbid1_username,
                  a3.username as admin_addbid2_username
               FROM \`yahoo-auction-order\` yo
               LEFT JOIN users u ON yo.user_id = u.id
               LEFT JOIN admins a1 ON yo.admin_maxbid_id = a1.id
               LEFT JOIN admins a2 ON yo.admin_addbid1_id = a2.id
               LEFT JOIN admins a3 ON yo.admin_addbid2_id = a3.id
               WHERE yo.status IS NULL
               ORDER BY 
                  STR_TO_DATE(yo.created_at, '%d/%m/%Y %H:%i:%s') DESC,
                  yo.id DESC
            `)

            await mysql.end()
            return res.status(200).json({
               message: "update status (แพ้) success!",
               orders: yahoo_orders_of_lose,
            })
         }

         // Handle "ชนะ" status
         const preferences = await mysql.query("SELECT * FROM preference")
         if (preferences.length === 0) {
            await mysql.end()
            return res.status(400).json({
               message: "Cannot get preference settings!",
               error: "Preference configuration is missing",
            })
         }

         const preference = preferences[0]
         const { rate_yen } = preference

         const result_add = await mysql.query(
            "INSERT INTO `yahoo-auction-payment` (date, user_id, bid, tranfer_fee, delivery_fee, payment_status,rate_yen, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
               date.split(" ")[0],
               user_id,
               sanitizedBid,
               sanitizedTransferFee,
               sanitizedDeliveryFee,
               payment_status,
               rate_yen,
               date,
               date,
            ]
         )

         const payment_id = result_add.insertId
         await mysql.query(
            "UPDATE `yahoo-auction-order` SET payment_id = ?, status = ?, updated_at = ? WHERE id = ?",
            [payment_id, "ชนะ", date, order_id]
         )

         const payments = await mysql.query(
            "SELECT * FROM `yahoo-auction-payment` WHERE id = ?",
            [payment_id]
         )

         if (payments.length === 0) {
            await mysql.end()
            return res.status(400).json({
               message: "Failed to add payment!",
               error: "Payment record could not be created",
            })
         }

         // Use optimized query for orders
         const yahoo_orders = await mysql
            .query(
               `
            SELECT 
               yo.*,
               u.username,
               a1.username as admin_maxbid_username,
               a2.username as admin_addbid1_username,
               a3.username as admin_addbid2_username
            FROM \`yahoo-auction-order\` yo
            LEFT JOIN users u ON yo.user_id = u.id
            LEFT JOIN admins a1 ON yo.admin_maxbid_id = a1.id
            LEFT JOIN admins a2 ON yo.admin_addbid1_id = a2.id
            LEFT JOIN admins a3 ON yo.admin_addbid2_id = a3.id
            WHERE yo.status IS NULL
            ORDER BY 
               STR_TO_DATE(yo.created_at, '%d/%m/%Y %H:%i:%s') DESC,
               yo.id DESC
         `
            )
            .map((order, index) => ({
               ...order,
               key: `${index + 1}`,
            }))

         await mysql.end()
         res.status(201).json({
            message: "Add payment success!",
            orders: yahoo_orders,
            payment: payments[0],
         })
      } catch (error) {
         console.error("Database error:", error)
         await mysql.end()
         return res.status(500).json({
            message: "Database operation failed",
            error: error.message,
         })
      }
   } else if (req.method === "PUT") {
      const {
         user_id,
         date,
         delivery_fee,
         tranfer_fee,
         payment_status,
         rate_yen,
         notificated,
      } = req.body
      const { id } = req.query

      // Validation
      if (!id) {
         return res.status(400).json({
            message: "Missing payment ID",
            error: "Payment ID is required in query parameters",
         })
      }

      // Validate numeric fields if provided
      if (
         delivery_fee !== undefined &&
         delivery_fee !== "" &&
         (Number.isNaN(parseFloat(delivery_fee)) ||
            parseFloat(delivery_fee) < 0)
      ) {
         return res.status(400).json({
            message: "Invalid delivery fee",
            error: "Delivery fee must be a non-negative number",
         })
      }

      if (
         tranfer_fee !== undefined &&
         tranfer_fee !== "" &&
         (Number.isNaN(parseFloat(tranfer_fee)) || parseFloat(tranfer_fee) < 0)
      ) {
         return res.status(400).json({
            message: "Invalid transfer fee",
            error: "Transfer fee must be a non-negative number",
         })
      }

      if (
         rate_yen !== undefined &&
         rate_yen !== "" &&
         (Number.isNaN(parseFloat(rate_yen)) || parseFloat(rate_yen) <= 0)
      ) {
         return res.status(400).json({
            message: "Invalid exchange rate",
            error: "Exchange rate must be a positive number",
         })
      }

      const date_created = genDate()

      try {
         await mysql.connect()

         if (notificated !== undefined) {
            await mysql.query(
               "UPDATE `yahoo-auction-payment` SET notificated = ? WHERE id = ?",
               [notificated, id]
            )
         } else if (payment_status === "ชำระเงินเสร็จสิ้น") {
            await mysql
               .transaction()
               .query(
                  "INSERT INTO `trackings` (user_id, channel, date, rate_yen, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
                  [user_id, "yahoo", date, rate_yen, date_created, date_created]
               )
               .query((response) => [
                  "UPDATE `yahoo-auction-payment` SET tracking_id = ?, date = ?, tranfer_fee = ?, delivery_fee = ?, payment_status = ?, rate_yen = ? WHERE id = ?",
                  [
                     response.insertId,
                     date,
                     tranfer_fee,
                     delivery_fee,
                     payment_status,
                     rate_yen,
                     id,
                  ],
               ])
               .rollback((error) => console.log(error))
               .commit()
         } else {
            await mysql.query(
               "UPDATE `yahoo-auction-payment` SET date = ?, tranfer_fee = ?, delivery_fee = ?, payment_status = ?, rate_yen = ? WHERE id = ?",
               [date, tranfer_fee, delivery_fee, payment_status, rate_yen, id]
            )
         }

         const yahoo_payments = await mysql.query(
            `SELECT 
               \`yahoo-auction-payment\`.*,
               users.username, 
               \`yahoo-auction-order\`.image, 
               \`yahoo-auction-order\`.link 
            FROM 
               \`yahoo-auction-payment\` 
            JOIN 
               \`yahoo-auction-order\` 
            ON 
               \`yahoo-auction-order\`.payment_id = \`yahoo-auction-payment\`.id 
            JOIN 
               users 
            ON 
               users.id = \`yahoo-auction-payment\`.user_id 
            WHERE
               \`yahoo-auction-payment\`.payment_status != ?`,
            ["ชำระเงินเสร็จสิ้น"]
         )

         await mysql.end()
         return res.status(200).json({
            message: "update payment success!",
            payments: yahoo_payments,
         })
      } catch (error) {
         console.error("Database error:", error)
         await mysql.end()
         return res.status(500).json({
            message: "Database operation failed",
            error: error.message,
         })
      }
   } else if (req.method === "DELETE") {
      const { payment_id } = req.body

      // Validation
      if (!payment_id) {
         return res.status(400).json({
            message: "Missing payment ID",
            error: "payment_id is required",
         })
      }

      try {
         await mysql.connect()
         await mysql.query(
            "DELETE FROM `yahoo-auction-order` WHERE payment_id = ?",
            [payment_id]
         )
         await mysql.query("DELETE FROM `yahoo-auction-payment` WHERE id = ?", [
            payment_id,
         ])

         const yahoo_payments = await mysql.query(
            `SELECT 
               \`yahoo-auction-payment\`.*,
               users.username, 
               \`yahoo-auction-order\`.image, 
               \`yahoo-auction-order\`.link 
            FROM 
               \`yahoo-auction-payment\` 
            JOIN 
               \`yahoo-auction-order\` 
            ON 
               \`yahoo-auction-order\`.payment_id = \`yahoo-auction-payment\`.id 
            JOIN 
               users 
            ON 
               users.id = \`yahoo-auction-payment\`.user_id 
            WHERE
               \`yahoo-auction-payment\`.payment_status != ?`,
            ["ชำระเงินเสร็จสิ้น"]
         )

         await mysql.end()
         return res.status(200).json({
            message: "Delete payment success!",
            payments: yahoo_payments,
         })
      } catch (error) {
         console.error("Database error:", error)
         await mysql.end()
         return res.status(500).json({
            message: "Database operation failed",
            error: error.message,
         })
      }
   } else {
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
   }
}

export default handler
