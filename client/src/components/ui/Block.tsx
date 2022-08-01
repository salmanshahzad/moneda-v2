import { Paper, Text } from "@mantine/core";

export interface BlockProps {
  children: JSX.Element;
  title: string;
}

function Block(props: BlockProps): JSX.Element {
  return (
    <Paper p="md" shadow="md">
      <Text weight="bold">{props.title}</Text>
      {props.children}
    </Paper>
  );
}

export default Block;
