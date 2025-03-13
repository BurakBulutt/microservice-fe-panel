import React from "react";
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
    if (initialized) {
      if (!keycloak.authenticated) {
        keycloak.login({locale:"tr"});
      }
    }
  }, [initialized]);
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      if (keycloak.authenticated) {
        keycloak
          .updateToken(300)
          .then((refreshed) => {
            if (refreshed) {
              console.log("Token successfully refreshed");
            } else {
              console.log("Token is still valid");
            }
          })
          .catch(() => {
            console.error("Failed to refresh token");
            keycloak.login({locale:"tr"});
          });
      }
    }, 4 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [keycloak.authenticated]);

  const matchPath = (routePath, currentPath) => {
    const regexPattern = new RegExp("^" + routePath.replace(/:[^/]+/g, "([^/]+)") + "$");
    return regexPattern.test(currentPath);
  };

  const getActiveRoute = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      const fullPath = `${routes[i].layout}/${routes[i].path}`.replace(/\/+/g, '/'); // Gereksiz '/' temizlendi

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
    return routes.map((route, key) => {
      if (route.layout === "/admin") {
        return (
          <>
            <Route
              key={key}
              path={`/${route.path}`}
              element={route.component}
            />
            {route.childRoutes && getRoutes(route.childRoutes)}
          </>
        );
      } else {
        return null;
      }
    });
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
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Horizon UI Tailwind React"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              keycloak={keycloak}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}
                <Route
                  path="/"
                  element={<Navigate to="/admin/default" replace />}
                />
                <Route path="*" element={<div>404 NOT FOUND</div>} />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
