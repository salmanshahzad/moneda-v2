import { Modal, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

import SubmitButton from "../ui/SubmitButton";

export interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: Partial<Record<keyof SignUpFields, string>>;
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
  }, [props.errors]);

  return (
    <Modal opened={props.isOpen} onClose={props.onClose} title="Sign Up">
      <form onSubmit={form.onSubmit(props.onSignUp)}>
        <TextInput
          label="Username"
          required
          data-autofocus
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
        <SubmitButton text="Sign Up" />
      </form>
    </Modal>
  );
}

export default SignUpModal;
