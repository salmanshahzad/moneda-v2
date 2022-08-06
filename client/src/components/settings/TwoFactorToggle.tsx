import { Center, Image, Modal, Switch, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

import Block from "../ui/Block";
import SubmitButton from "../ui/SubmitButton";

export interface TwoFactorToggleProps {
  errors: Partial<Record<keyof TwoFactorToggleFields, string>>;
  isEnabled: boolean;
  qrCode: string;
  onEnable: (values: TwoFactorToggleFields) => Promise<boolean>;
  onDisable: () => Promise<unknown>;
}

export interface TwoFactorToggleFields {
  token: string;
}

function TwoFactorToggle(props: TwoFactorToggleProps): JSX.Element {
  const [isModalOpen, modalHandlers] = useDisclosure(false);
  const form = useForm<TwoFactorToggleFields>({
    initialValues: {
      token: "",
    },
  });
  const [isEnabled, setIsEnabled] = useState(props.isEnabled);

  useEffect(() => {
    form.setErrors(props.errors);
  }, [isModalOpen, props.errors]);

  async function toggle(): Promise<void> {
    if (props.isEnabled) {
      await props.onDisable();
      setIsEnabled(false);
    } else {
      form.reset();
      modalHandlers.open();
    }
  }

  async function onSubmit(): Promise<void> {
    const success = await props.onEnable({ token: form.values.token });
    if (success) {
      setIsEnabled(true);
      modalHandlers.close();
    }
  }

  return (
    <>
      <Block singleRow title="Two Factor Authentication">
        <Switch checked={isEnabled} onChange={toggle} />
      </Block>
      <Modal
        opened={isModalOpen}
        onClose={modalHandlers.close}
        title="Enable Two Factor Authentication"
      >
        <Text>
          Scan the QR code below into an authenticator app and enter the token
          to verify.
        </Text>
        <Center my="md">
          <Image src={props.qrCode} height={150} width={150} />
        </Center>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput label="Token" required {...form.getInputProps("token")} />
          <SubmitButton text="Verify" />
        </form>
      </Modal>
    </>
  );
}

export default TwoFactorToggle;
