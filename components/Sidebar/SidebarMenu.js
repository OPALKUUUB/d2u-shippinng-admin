import { CheckSquareOutlined, DingdingOutlined, MoneyCollectOutlined, PieChartOutlined, ProfileOutlined } from "@ant-design/icons"
import BillingIcon from "../icon/BillingIcon"
import DashboardIcon from "../icon/DashboardIcon"
import TrackingPackageIcon from "../icon/TrackingPackageIcon"
import YahooIcon from "../icon/YahooIcon"

// eslint-disable-next-line import/prefer-default-export
const sidebarMenuData = [
   { id: 1, name: "Dasboard", icon: <DashboardIcon />, to: "/" },
   { id: 2, name: "Customer", icon: <ProfileOutlined />, to: "/customer" },
   {
      id: 3,
      name: "Auction Yahoo",
      icon: <YahooIcon />,
      childs: [
         // { id: 1, name: "Add Auction", to: "/yahoo/add" },
         { id: 2, name: "Bidding", to: "/yahoo/bidding" },
         { id: 3, name: "Payment", to: "/yahoo/payment" },
         { id: 4, name: "History", to: "/yahoo/history" },
      ],
   },
   {
      id: 4,
      name: "Tracking",
      icon: <TrackingPackageIcon />,
      childs: [
         { id: 1, name: "All Tracking", to: "/tracking/all" },
         { id: 2, name: "Shimizu", to: "/tracking/shimizu" },
         { id: 3, name: "Mercari", to: "/tracking/mercari" },
         { id: 4, name: "Web123", to: "/tracking/web123" },
         { id: 5, name: "Frill", to: "/tracking/frill" },
         { id: 6, name: "Yahoo", to: "/tracking/yahoo" },
         { id: 6, name: "ประวัติการลบรายการ", to: "/tracking/contentDelete" },
      ],
   },
   { id: 5, name: "Ship Billing", icon: <BillingIcon />, to: "/shipbilling" },
   { id: 6, name: "ขนส่งเอกชน", icon: <BillingIcon />, to: "/private-transport" },
   { id: 7, name: "ฝากไว้ก่อน", icon: <BillingIcon />, to: "/deposite-first" },
   { id: 8, name: "Cargo", icon: <DingdingOutlined />, to: "/cargo" },
   {
      id: 9,
      name: "การเงิน",
      icon: <CheckSquareOutlined  />,
      childs: [
         { id: 1, name: "เงินเข้า manual", to: "/for-accountant/money-in-manual" },
         { id: 2, name: "รายการเงินเข้า", to: "/for-accountant/list-money-in-manual" },
         { id: 3, name: "รายการเงินเข้าเก่า", to: "/for-accountant/list-money-in" },
      ],
   },
   { 
      id: 10,
      name: "วางบิล",
      icon: <MoneyCollectOutlined />,
      childs: [
         { id: 1, name: "รายการวางบิล", to: "/invoice-ship-billing" },
         { id: 2, name: "รายการฝาก", to: "/invoice-ship-billing/keep" },
      ],
   },
   { id: 11, name: "Data Analysis", icon: <PieChartOutlined />, to: "/data-analysis" },

]

export default sidebarMenuData
