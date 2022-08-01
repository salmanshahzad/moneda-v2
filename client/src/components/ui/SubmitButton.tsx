import { Button, Group } from "@mantine/core";

export interface SubmitButtonProps {
  text: string;
}

function SubmitButton(props: SubmitButtonProps): JSX.Element {
  return (
    <Group mt="sm" position="right">
      <Button type="submit">{props.text}</Button>
    </Group>
  );
}

export default SubmitButton;
