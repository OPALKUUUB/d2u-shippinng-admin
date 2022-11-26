import css from "styled-jsx/css"

export default css.global`
   aside {
      width: 200px;
      max-width: 200px;
      min-width: 200px;
      height: 100vh;
      max-height: 100vh;
      padding-bottom: 100px;
      padding-top: 60px;
      background: white;
      color: rgba(0, 0, 0, 0.75);
      transition: all 0.3s ease;
      overflow-y: auto;
   }
   aside.close {
      max-width: 0px;
      min-width: 0px;
   }
   aside::-webkit-scrollbar {
      width: 0.5px;
      height: 0.5px;
   }
   aside::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.12);
      border-radius: 3px;
      box-shadow: inset 0 0 5px rgb(0 21 41 / 5%);
   }
   aside::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.06);
      border-radius: 3px;
      box-shadow: inset 0 0 5px rgb(0 21 41 / 5%);
   }
   aside ul {
      margin: 0;
      padding: 0;
   }
   aside li {
      list-style: none;
      cursor: pointer;
   }
   aside .box,
   aside .box-dropdown {
      min-width: 200px;
      position: relative;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 15px;
   }
   aside .box:hover,
   aside .box-dropdown:hover,
   aside .dropdown-list > li:hover {
      color: #1890ff;
   }
   aside .box .icon,
   aside .box-dropdown .icon {
      display: inline-block;
      width: 18px;
      height: 18px;
      vertical-align: -0.3rem;
   }
   aside .box .text,
   aside .box-dropdown .text {
      display: inline-block;
      min-width: 120px;
      margin-left: 20px;
      font-size: 0.925rem;
      font-weight: 400;
      line-height: 0;
      text-shadow: 0.1px 0.1px 0.5px rgba(0, 0, 0, 0.75),
         -0.1px -0.1px 0.5px rgba(0, 0, 0, 0.75);
   }
   aside .box-dropdown .db-icon {
      display: inline-block;
      font-size: 1.2rem;
      position: absolute;
      transform: scaleY(1);
      transition: all 0.2s ease-in-out;
   }
   aside .box-dropdown .db-icon.up {
      top: 5px;
      transform: scaleY(-1);
   }
   aside .dropdown-list {
      overflow: hidden;
      max-height: 0px;
      transition: max-height 0.2s ease-in-out;
   }
   aside .dropdown-list.show {
      height: auto;
      max-height: 1000px;
   }
   aside .box-dropdown-item {
      padding: 10px 0px 10px 35px;
      font-size: 0.875rem;
   }
   aside .box-dropdown-item:hover {
      background: #e6f7ff;
      border-right: 3px solid #40a9ff;
   }
   aside .box-dropdown-list {
      box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.15) inset;
   }
`
