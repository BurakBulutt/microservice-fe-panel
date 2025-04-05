import React, { Fragment } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";
import { useKeycloak } from "@react-keycloak/web";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");
  const { keycloak, initialized } = useKeycloak();

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);

  React.useEffect(() => {
    setCurrentRoute(getActiveRoute(routes));
  }, [location.pathname]);

  React.useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      keycloak.login({ locale: "tr" });
    }
  }, [initialized, keycloak.authenticated]);

  const matchPath = (routePath, currentPath) => {
    const regexPattern = new RegExp(
      "^" + routePath.replace(/:[^/]+/g, "([^/]+)") + "$"
    );
    return regexPattern.test(currentPath);
  };

  const getActiveRoute = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      const fullPath = `${routes[i].layout}/${routes[i].path}`.replace(
        /\/+/g,
        "/"
      );

      if (matchPath(fullPath, window.location.pathname)) {
        return routes[i].name;
      }

      if (routes[i].childRoutes) {
        const childRoute = getActiveRoute(routes[i].childRoutes);
        if (childRoute) return childRoute;
      }
    }
    return null;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes
      .filter((route) => route.layout === "/admin")
      .map((route, key) => (
        <Fragment key={key}>
          <Route path={`/${route.path}`} element={route.component} />
          {route.childRoutes && getRoutes(route.childRoutes)}
        </Fragment>
      ));
  };

  document.documentElement.dir = "ltr";

  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          {/* Navbar */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Horizon UI Tailwind React"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              keycloak={keycloak}
              {...rest}
            />
            {/* Routes */}
            {initialized && keycloak.authenticated && (
                <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
                  <Routes>
                    {getRoutes(routes)}
                    <Route
                        path="/"
                        element={<Navigate to="/admin/dashboard" replace />}
                    />
                    <Route
                        path="*"
                        element={<div className="mt-4">404 NOT FOUND</div>}
                    />
                  </Routes>
                </div>
            )}
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
