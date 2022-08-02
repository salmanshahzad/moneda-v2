import { Group, Paper, Text } from "@mantine/core";

export interface BlockProps {
  children: JSX.Element;
  singleRow?: boolean;
  title: string;
}

function Block(props: BlockProps): JSX.Element {
  return (
    <Paper p="md" shadow="md">
      {props.singleRow && (
        <Group position="apart">
          <Text weight="bold">{props.title}</Text>
          {props.children}
        </Group>
      )}
      {!props.singleRow && (
        <>
          <Text mb="xs" weight="bold">
            {props.title}
          </Text>
          {props.children}
        </>
      )}
    </Paper>
  );
}

export default Block;
