import { PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

import Block from "../ui/Block";
import SubmitButton from "../ui/SubmitButton";

export interface ChangeUsernameProps {
  errors: Partial<Record<keyof ChangeUsernameFields, string>>;
  onChange: (values: ChangeUsernameFields) => Promise<boolean>;
}

export interface ChangeUsernameFields {
  username: string;
  password: string;
}

function ChangeUsername(props: ChangeUsernameProps): JSX.Element {
  const form = useForm<ChangeUsernameFields>({
    initialValues: { username: "", password: "" },
  });

  useEffect(() => {
    form.setErrors(props.errors);
  }, [props.errors]);

  async function onSubmit(values: ChangeUsernameFields): Promise<void> {
    const success = await props.onChange(values);
    if (success) {
      form.reset();
    }
  }

  return (
    <Block title="Change Username">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          label="New Username"
          required
          {...form.getInputProps("username")}
        />
        <PasswordInput
          label="Password"
          required
          {...form.getInputProps("password")}
        />
        <SubmitButton text="Change" />
      </form>
    </Block>
  );
}

export default ChangeUsername;
