import { Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useRef } from "react";

import SubmitButton from "../ui/SubmitButton";

export interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: Partial<Record<keyof TwoFactorFields, string>>;
  onVerify: (values: TwoFactorFields) => unknown;
}

export interface TwoFactorFields {
  token: string;
}

function TwoFactorModal(props: TwoFactorModalProps): JSX.Element {
  const form = useForm<TwoFactorFields>({
    initialValues: {
      token: "",
    },
  });
  const ref = useRef<HTMLInputElement>();

  useEffect(() => {
    form.setErrors(props.errors);
  }, [props.errors]);

  useEffect(() => {
    if (props.isOpen) {
      setTimeout(() => {
        ref.current?.focus();
      }, 100);
    }
  }, [props.isOpen]);

  return (
    <Modal
      opened={props.isOpen}
      onClose={props.onClose}
      title="Two Factor Authentication"
    >
      <form onSubmit={form.onSubmit(props.onVerify)}>
        <TextInput
          label="Token"
          required
          ref={ref}
          {...form.getInputProps("token")}
        />
        <SubmitButton text="Verify" />
      </form>
    </Modal>
  );
}

export default TwoFactorModal;
