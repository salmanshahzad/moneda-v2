import {
  Button,
  Group,
  Modal,
  PasswordInput,
  Space,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: Partial<SignUpFields>;
  onSignUp: (values: SignUpFields) => unknown;
}

export interface SignUpFields {
  username: string;
  password: string;
  confirmPassword: string;
}

function SignUpModal(props: SignUpModalProps): JSX.Element {
  const form = useForm<SignUpFields>({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    form.setErrors(props.errors);
  }, [form, props.errors]);

  return (
    <Modal opened={props.isOpen} onClose={props.onClose} title="Sign Up">
      <form onSubmit={form.onSubmit(props.onSignUp)}>
        <TextInput
          label="Username"
          required
          {...form.getInputProps("username")}
        />
        <PasswordInput
          label="Password"
          required
          {...form.getInputProps("password")}
        />
        <PasswordInput
          label="Confirm Password"
          required
          {...form.getInputProps("confirmPassword")}
        />
        <Space h="md" />
        <Group position="right">
          <Button type="submit">Sign Up</Button>
        </Group>
      </form>
    </Modal>
  );
}

export default SignUpModal;
