import { atom } from "recoil"

export const notificationState = atom({
   key: "notification_State",
   default: [],
   dangerouslyAllowMutability: true,
})

export const isLoadingState = atom({
   key: "is_Loading_State",
   default: false,
})
