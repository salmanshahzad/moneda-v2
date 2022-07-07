import { Button, Group, Modal, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: Partial<SignInFields>;
  onSignIn: (values: SignInFields) => unknown;
}

export interface SignInFields {
  username: string;
  password: string;
}

function SignInModal(props: SignInModalProps): JSX.Element {
  const form = useForm<SignInFields>({
    initialValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    form.setErrors(props.errors);
  }, [form, props.errors]);

  return (
    <Modal opened={props.isOpen} onClose={props.onClose} title="Sign In">
      <form onSubmit={form.onSubmit(props.onSignIn)}>
        <TextInput
          label="Username"
          required
          error={props.errors.username}
          {...form.getInputProps("username")}
        />
        <PasswordInput
          label="Password"
          required
          error={props.errors.password}
          {...form.getInputProps("password")}
        />
        <Group mt="md" position="right">
          <Button type="submit">Sign In</Button>
        </Group>
      </form>
    </Modal>
  );
}

export default SignInModal;
