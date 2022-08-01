import { Grid } from "@mantine/core";
import { Outlet } from "react-router-dom";

import Nav from "./Nav";

function Layout(): JSX.Element {
  return (
    <>
      <Nav />
      <Grid
        p="xl"
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[0],
          margin: 0,
          minHeight: "calc(100vh - 56px)",
        })}
      >
        <Outlet />
      </Grid>
    </>
  );
}

export default Layout;
