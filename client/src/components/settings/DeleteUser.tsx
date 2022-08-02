import { Button, Group, Modal, PasswordInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

import Block from "../ui/Block";

export interface DeleteUserProps {
  errors: Partial<Record<keyof DeleteUserFields, string>>;
  onDelete: (values: DeleteUserFields) => unknown;
}

export interface DeleteUserFields {
  password: string;
}

function DeleteUser(props: DeleteUserProps): JSX.Element {
  const [isModalOpen, modalHandlers] = useDisclosure(false);
  const form = useForm<DeleteUserFields>({
    initialValues: {
      password: "",
    },
  });

  useEffect(() => {
    form.setErrors(props.errors);
  }, [props.errors]);

  return (
    <>
      <Block singleRow title="Delete Account">
        <Button color="red" onClick={modalHandlers.open}>
          Delete Account
        </Button>
      </Block>
      <Modal
        opened={isModalOpen}
        onClose={modalHandlers.close}
        title="Delete Account"
      >
        <Text>
          Are you sure you want to delete your account? All data will be
          permanently deleted. This action is irreversible.
        </Text>
        <form onSubmit={form.onSubmit(props.onDelete)}>
          <PasswordInput
            label="Password"
            required
            {...form.getInputProps("password")}
          />
          <Group mt="sm" position="right">
            <Button variant="subtle" onClick={modalHandlers.close}>
              Cancel
            </Button>
            <Button type="submit" color="red">
              Delete
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}

export default DeleteUser;
