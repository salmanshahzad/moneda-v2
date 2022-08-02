import { Switch, useMantineColorScheme } from "@mantine/core";
import { useCallback } from "react";

import Block from "../ui/Block";

function DarkThemeToggle(): JSX.Element {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const toggle = useCallback(() => {
    toggleColorScheme();
  }, [toggleColorScheme]);

  return (
    <Block singleRow title="Dark Theme">
      <Switch checked={colorScheme === "dark"} onChange={toggle} />
    </Block>
  );
}

export default DarkThemeToggle;
