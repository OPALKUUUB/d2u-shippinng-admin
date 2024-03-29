import genDate from "../utils/genDate"

export const addForm_model = {
   id: "",
   username: "",
   user_id: "",
   rate_yen: 0.29,
   date: genDate(),
   link: "",
   price: 0,
   weight: 0,
   track_no: "",
   box_no: "",
   voyage: "",
   channel: "",
   remark_user: "",
   remark_admin: "",
   created_at: "",
   updated_at: "",
}
export const trackingForm_model = {
   id: "",
   username: "",
   user_id: "",
   rate_yen: "",
   date: "",
   link: "",
   price: "",
   weight: "",
   track_no: "",
   box_no: "",
   voyage: "",
   channel: "",
   remark_user: "",
   remark_admin: "",
   received: "",
   finished: "",
   created_at: "",
   updated_at: "",
}

export const payment_model = {
   key: "",
   id: "",
   slip_id: null,
   user_id: "",
   tracking_id: null,
   admin_id: null,
   date: "",
   bid: "",
   tranfer_fee: "",
   delivery_fee: "",
   rate_yen: 0.29,
   notificated: 0,
   payment_status: "รอค่าโอนและค่าส่ง",
   remark_user: null,
   remark_admin: null,
   created_at: "",
   updated_at: "",
   username: "",
   image: "",
   link: "",
}
