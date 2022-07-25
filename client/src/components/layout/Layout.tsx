import { Outlet } from "react-router-dom";

import Nav from "./Nav";

function Layout(): JSX.Element {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

export default Layout;
