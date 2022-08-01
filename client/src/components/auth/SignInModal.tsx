import { Modal, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

import SubmitButton from "../ui/SubmitButton";

export interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: Partial<Record<keyof SignInFields, string>>;
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
  }, [props.errors]);

  return (
    <Modal opened={props.isOpen} onClose={props.onClose} title="Sign In">
      <form onSubmit={form.onSubmit(props.onSignIn)}>
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
        <SubmitButton text="Sign In" />
      </form>
    </Modal>
  );
}

export default SignInModal;
