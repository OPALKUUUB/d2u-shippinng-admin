import query from "../../mysql/connection"

async function getAllTrackings() {
    try {
        const trackings = await query(`
        SELECT
            CONCAT('Tracking_key_', t.id) AS \`key\`,
            t.id,
            u.username,
            SUBSTRING_INDEX(t.date, ' ', 1) AS date,
            t.channel,
            CASE
                WHEN t.channel = 'yahoo' THEN
                    yao.link
                ELSE t.link
            END AS link,
            CASE
                WHEN t.channel = 'yahoo' THEN
                    CEIL(
                        COALESCE(yap.bid, 0) * COALESCE(yap.rate_yen, 0)
                        + COALESCE(yap.delivery_fee, 0)
                        + COALESCE(yap.tranfer_fee, 0)
                    )
                ELSE t.price
            END AS price,
            t.weight,
            t.airbilling,
            t.box_no,
            t.track_no,
            t.paid_channel,
            t.voyage,
            t.remark_admin
        FROM
            trackings t
        JOIN
            users u ON u.id = t.user_id
        LEFT JOIN
            \`yahoo-auction-payment\` yap ON t.id = yap.tracking_id AND t.channel = 'yahoo'
        LEFT JOIN
            \`yahoo-auction-order\` yao ON yao.payment_id = yap.id AND t.channel = 'yahoo'
        WHERE
            t.cont_status != 99
        ORDER BY
            STR_TO_DATE(SUBSTRING_INDEX(t.date, ' ', 1), '%d/%m/%Y') DESC;
    `)

        return trackings
    } catch (error) {
        // Properly handle errors here
        console.error("Error while fetching trackings:", error)
        throw error
    }
}

export default getAllTrackings
