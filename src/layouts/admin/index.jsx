import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routeList from "routes.js";
import { useKeycloak } from "@react-keycloak/web";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState(routeList[0]);
  const { keycloak, initialized } = useKeycloak();
  const [breadCrumb, setBreadCrumb] = React.useState([]);

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);

  React.useEffect(() => {
    setCurrentRoute(getActiveRoute(routeList));
    //setBreadCrumb(getBreadCrumb2(routeList));
  }, [location.pathname]);

  React.useEffect(() => {
    setBreadCrumb(getBreadCrumb(currentRoute, []).reverse());
  }, [currentRoute]);

  React.useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      keycloak.login({ locale: "tr" });
    }
  }, [initialized, keycloak.authenticated]);

  const getRoutes = (routes) => {
    return routes
      .filter((route) => route.layout === "/admin")
      .map((route, key) => (
          <Route key={key} path={getPath(route)} element={route.component} />
      ));
  };

  const getActiveRoute = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      const fullPath = `${routes[i].layout}/${getPath(routes[i])}`.replace(
          /\/+/g,
          "/"
      );

      if (matchPath(fullPath,location.pathname)) {
        return routes[i];
      }
    }
    return null;
  };

  const matchPath = (routePath, currentPath) => {
    const regexPattern = new RegExp(
        "^" + routePath.replace(/:[^/]+/g, "([^/]+)") + "$"
    );
    return regexPattern.test(currentPath);
  };

  const getPath = (route) => {
    if (route.parentPath) {
      const parentRoute = routeList.find((r) => r.path === route.parentPath);

      if (!parentRoute) throw new Error("Route Error");

      return `${getPath(parentRoute)}/${route.path}`;
    }
    return route.path;
  };

  const getBreadCrumb = (route, breadCrumb) => {
    if (!route) {
      return breadCrumb;
    }

    breadCrumb.push(route);

    if (route.parentPath) {
      const parentRoute = routeList.find((r) => r.path === route.parentPath);

      if (!parentRoute) throw new Error("Route Error");

      return getBreadCrumb(parentRoute, breadCrumb);
    }

    return breadCrumb;
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
              currentRoute={currentRoute}
              breadCrumb={breadCrumb}
              keycloak={keycloak}
              {...rest}
            />
            {/* Routes */}
            {initialized && keycloak.authenticated && (
              <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
                <Routes>
                  {getRoutes(routeList)}
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
