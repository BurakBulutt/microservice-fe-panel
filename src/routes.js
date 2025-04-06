import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import RTLDefault from "views/rtl/default";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";

import Users from "./views/admin/users";
import Content from "./views/admin/content";
import ContentCard from "./views/admin/content/components/contentcard";
import Comment from "./views/admin/comment";
import Category from "./views/admin/category";
import {SiContentful} from "react-icons/si";
import {BiCategory, BiComment, BiUser} from "react-icons/bi";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "NFT Marketplace",
    layout: "/admin",
    path: "nft-marketplace",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <NFTMarketplace />,
  },
  {
    name: "Data Tables",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "RTL Admin",
    layout: "/rtl",
    path: "rtl",
    icon: <MdHome className="h-6 w-6" />,
    component: <RTLDefault />,
  },
  {
    name: "User",
    layout: "/admin",
    path: "users",
    icon: <BiUser className="h-6 w-6" />,
    component: <Users />,
  },
  {
    name: "Content",
    layout: "/admin",
    path: "contents",
    icon: <SiContentful className="h-6 w-6" />,
    component: <Content />,
    childRoutes: [
      {
        name: "Create Content",
        layout: "/admin",
        parentPath: "contents",
        path: "create",
        component: <ContentCard />
      },
      {
        name: "Update Content",
        layout: "/admin",
        parentPath: "contents",
        path: "update/:id",
        component: <ContentCard />
      }
    ]
  },
  {
    name: "Comment",
    layout: "/admin",
    path: "comments",
    icon: <BiComment className="h-6 w-6" />,
    component: <Comment />,
  },
  {
    name: "Category",
    layout: "/admin",
    path: "categories",
    icon: <BiCategory className="h-6 w-6" />,
    component: <Category />,
  },
];
export default routes;
