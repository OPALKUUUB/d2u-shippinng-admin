import editPaidChannel from "../../../dbs/query/paid_channel/editPaidChannel"

async function handlers(req, res) {
   const trackingId = parseInt(req.query.tracking_id, 10)
   if (req.method === "PUT") {
      console.log(`PUT::/api/paid-channel/${trackingId}`)
      const paidChannel = req.body.paid_channel
      try {
         await editPaidChannel(trackingId, paidChannel)
         res.status(200).json({
            code: 200,
            message: "Updated!",
            paid_channel: paidChannel,
         })
      } catch (err) {
         console.log(err)
         res.status(500).json({ code: 500, message: "Server Error!" })
      }
   }
}

export default handlers
