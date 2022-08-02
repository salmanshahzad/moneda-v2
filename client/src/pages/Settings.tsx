import { Grid } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Check } from "tabler-icons-react";

import api from "../api";
import ChangePassword, {
  ChangePasswordFields,
} from "../components/settings/ChangePassword";
import ChangeUsername, {
  ChangeUsernameFields,
} from "../components/settings/ChangeUsername";
import DeleteUser, {
  DeleteUserFields,
} from "../components/settings/DeleteUser";
import useStore from "../store";

function Settings(): JSX.Element {
  const span = useMediaQuery("(min-width: 900px)") ? 6 : 12;
  const user = useStore((state) => state.user)!;
  const setUser = useStore((state) => state.setUser);

  const [changeUsernameErrors, setChangeUsernameErrors] = useState<
    Partial<Record<keyof ChangeUsernameFields, string>>
  >({});
  const [changePasswordErrors, setChangePasswordErrors] = useState<
    Partial<Record<keyof ChangePasswordFields, string>>
  >({});
  const [deleteUserErrors, setDeleteUserErrors] = useState<
    Partial<Record<keyof DeleteUserFields, string>>
  >({});

  async function changeUsername(
    values: ChangeUsernameFields
  ): Promise<boolean> {
    setChangeUsernameErrors({});
    const { data, status } = await api.put("user/username", values);
    if (status === 204) {
      setUser({ ...user, username: values.username });
      showNotification({
        color: "green",
        icon: <Check />,
        message: "Changed username",
      });
      return true;
    } else if (status === 401 || status === 422) {
      setChangeUsernameErrors(api.extractErrorMessages(data));
    }
    return false;
  }

  async function changePassword(
    values: ChangePasswordFields
  ): Promise<boolean> {
    setChangePasswordErrors({});
    const { data, status } = await api.put("user/password", values);
    if (status === 204) {
      showNotification({
        color: "green",
        icon: <Check />,
        message: "Changed password",
      });
      return true;
    } else if (status === 401 || status === 422) {
      setChangePasswordErrors(api.extractErrorMessages(data));
    }
    return false;
  }

  async function deleteUser(values: DeleteUserFields): Promise<void> {
    setDeleteUserErrors({});
    const { data, status } = await api.delete("user", values);
    if (status === 204) {
      setUser(null);
    } else {
      setDeleteUserErrors(api.extractErrorMessages(data));
    }
  }

  return (
    <>
      <Grid.Col span={span}>
        <ChangeUsername
          errors={changeUsernameErrors}
          onChange={changeUsername}
        />
      </Grid.Col>
      <Grid.Col span={span}>
        <ChangePassword
          errors={changePasswordErrors}
          onChange={changePassword}
        />
      </Grid.Col>
      <Grid.Col span={span}>
        <DeleteUser errors={deleteUserErrors} onDelete={deleteUser} />
      </Grid.Col>
    </>
  );
}

export default Settings;
