import React, { useState } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";

import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";

import avatar from "assets/img/avatars/avatar4.png";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

const Navbar = (props) => {
  const { onOpenSidenav, currentRoute, keycloak, breadCrumb } = props;
  const [darkmode, setDarkmode] = React.useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [locale, setLocale] = useState("tr");
  const { t } = useTranslation();

  React.useEffect(() => {
    if (keycloak.authenticated === true) {
      keycloak
        .loadUserProfile()
        .then((profile) => {
          setUserProfile(profile);
        })
        .catch((err) => console.log(err));
    }
  }, [keycloak.authenticated]);

  React.useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  const localeOptions = [
    { code: "en", label: t("english"), icon: <span className="text-lg">🇺🇸</span> },
    { code: "tr", label: t("turkish"), icon: <span className="text-lg">🇹🇷</span> },
  ];

  const getPath = (route, routes) => {
    if (route.parentPath) {
      const parentRoute = routes.find((r) => r.path === route.parentPath);

      if (!parentRoute) throw new Error("Route Error");

      return `${getPath(parentRoute, routes)}/${route.path}`;
    }
    return route.path;
  };

  const profileImageUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile?.firstName?.charAt(0) + userProfile?.lastName?.charAt(0)}&&padding=20&fontSize=40`;

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-full pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href="/"
          >
            {t("pages")}
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "}
              /{" "}
            </span>
          </a>
          {breadCrumb?.map((bc, index) => {
            const isLast = index + 1 === breadCrumb.length;
            return (
              <Link
                key={index}
                className={`text-sm font-normal capitalize ${
                  isLast
                    ? "pointer-events-none cursor-default text-navy-700 dark:text-white"
                    : "text-navy-700 hover:underline dark:text-white dark:hover:text-white"
                }`}
                to={isLast ? "#" : getPath(bc, breadCrumb)}
              >
                {t(`${bc?.name}`)}
                {!isLast && (
                  <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
                    {" "}
                    /{" "}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {t(`${currentRoute?.name}`)}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
        </div>
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        {/* 🌍 Locale Dropdown */}
        <Dropdown
          button={
            <div className="flex cursor-pointer items-center gap-1 px-2 py-1 text-lg text-gray-600 dark:text-white">
              {localeOptions.find((opt) => opt.code === locale)?.icon}
            </div>
          }
          children={
            <div className="flex w-40 flex-col justify-start rounded-[20px] bg-white p-2 shadow-lg dark:bg-navy-700">
              {localeOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => setLocale(option.code)}
                  className="flex items-center gap-2 rounded-md p-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-navy-600"
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          }
          classNames={"py-2 top-12 -left-[120px]"}
        />
        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full"
              src={profileImageUrl}
              alt={userProfile.firstName + " " + userProfile.lastName}
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="flex flex-col items-center p-4">
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  👋 {" "}
                  {userProfile.firstName + " " + userProfile.lastName}
                </p>
              </div>

              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="cursor-pointer flex flex-col items-center p-4"
                   onClick={() => keycloak.logout()}>
                <a
                  href="#"
                  className="text-sm font-medium text-red-500 transition duration-150 ease-out hover:text-red-500 hover:ease-in"
                >
                  {t("logout")}
                </a>
              </div>
            </div>
          }
          classNames={"py-2 top-12 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
