import { DingdingOutlined, PieChartOutlined, ProfileOutlined } from "@ant-design/icons"
import BillingIcon from "../icon/BillingIcon"
import DashboardIcon from "../icon/DashboardIcon"
import StoreIcon from "../icon/StoreIcon"
import TrackingPackageIcon from "../icon/TrackingPackageIcon"
import YahooIcon from "../icon/YahooIcon"


// eslint-disable-next-line import/prefer-default-export
const sidebarMenuData = [
   { id: 6, name: "Dasboard", icon: <DashboardIcon />, to: "/" },
   { id: 1, name: "Customer", icon: <ProfileOutlined />, to: "/customer" },
   {
      id: 2,
      name: "Auction Yahoo",
      icon: <YahooIcon />,
      childs: [
         { id: 1, name: "Add Auction", to: "/yahoo/add" },
         { id: 2, name: "Bidding", to: "/yahoo/bidding" },
         { id: 3, name: "Payment", to: "/yahoo/payment" },
         { id: 4, name: "History", to: "/yahoo/history" },
      ],
   },
   {
      id: 3,
      name: "Tracking",
      icon: <TrackingPackageIcon />,
      childs: [
         { id: 1, name: "All Tracking", to: "/tracking" },
         { id: 2, name: "Shimizu", to: "/tracking/shimizu" },
         { id: 3, name: "Mercari", to: "/tracking/mercari" },
         { id: 4, name: "Web123", to: "/tracking/web123" },
         { id: 5, name: "Frill", to: "/tracking/frill" },
         { id: 6, name: "Yahoo", to: "/tracking/yahoo" },
         // { id: 7, name: "Mart", to: "/tracking/mart" },
      ],
   },
   // {
   //    id: 4,
   //    name: "Mart",
   //    icon: <StoreIcon />,
   //    childs: [
   //       { id: 1, name: "Order", to: "/" },
   //       { id: 2, name: "Buy List", to: "/" },
   //       { id: 3, name: "Promotion", to: "/mart/promotion" },
   //       { id: 4, name: "Gachapong", to: "/mart/ewelcia" },
   //       { id: 5, name: "7-Eleven", to: "/mart/omni7" },
   //       { id: 6, name: "Donki", to: "/mart/donki" },
   //       { id: 7, name: "Disney", to: "/mart/disney" },
   //       { id: 8, name: "Disnayland", to: "/mart/disneyland" },
   //    ],
   // },
   { id: 5, name: "Ship Billing", icon: <BillingIcon />, to: "/shipbilling" },
   { id: 6, name: "ขนส่งเอกชน", icon: <BillingIcon />, to: "/private-transport" },
   { id: 7, name: "ฝากไว้ก่อน", icon: <BillingIcon />, to: "/deposite-first" },
   { id: 8, name: "Cargo", icon: <DingdingOutlined />, to: "/cargo" },
   { id: 9, name: "Data Analysis", icon:<PieChartOutlined />, to: "/data-analysis" },

]

export default sidebarMenuData
