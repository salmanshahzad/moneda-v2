import { Grid, useMantineColorScheme } from "@mantine/core";
import { Outlet } from "react-router-dom";

import Nav from "./Nav";

function Layout(): JSX.Element {
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <Nav />
      <Grid
        p="xl"
        sx={(theme) => ({
          backgroundColor:
            colorScheme === "light"
              ? theme.colors.gray[0]
              : theme.colors.dark[4],
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
