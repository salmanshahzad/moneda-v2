import { PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

import Block from "../ui/Block";
import SubmitButton from "../ui/SubmitButton";

export interface ChangePasswordProps {
  errors: Partial<Record<keyof ChangePasswordFields, string>>;
  onChange: (values: ChangePasswordFields) => Promise<boolean>;
}

export interface ChangePasswordFields {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

function ChangePassword(props: ChangePasswordProps): JSX.Element {
  const form = useForm<ChangePasswordFields>({
    initialValues: { oldPassword: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    form.setErrors(props.errors);
  }, [props.errors]);

  async function onSubmit(values: ChangePasswordFields): Promise<void> {
    const success = await props.onChange(values);
    if (success) {
      form.reset();
    }
  }

  return (
    <Block title="Change Password">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <PasswordInput
          label="Current Password"
          required
          {...form.getInputProps("oldPassword")}
        />
        <PasswordInput
          label="New Password"
          required
          {...form.getInputProps("password")}
        />
        <PasswordInput
          label="Confirm New Password"
          required
          {...form.getInputProps("confirmPassword")}
        />
        <SubmitButton text="Change" />
      </form>
    </Block>
  );
}

export default ChangePassword;
