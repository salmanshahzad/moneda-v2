import { Grid } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";

import api from "../api";
import AddTransaction, {
  type AddTransactionFields,
} from "../components/transactions/AddTransaction";
import useStore from "../store";

function Dashboard(): JSX.Element {
  const span = useMediaQuery("(min-width: 900px)") ? 6 : 12;
  const user = useStore((state) => state.user)!;
  const [addTransactionErrors, setAddTransactionErrors] = useState<Partial<Record<keyof AddTransactionFields, string>>>({});

  async function addTransaction(values: AddTransactionFields): Promise<boolean> {
    setAddTransactionErrors({});
    const { data, status } = await api.post("transaction", values);
    if (status === 201) {
      return true;
    } else if (status === 422) {
      setAddTransactionErrors(api.extractErrorMessages(data));
    }
    return false;
  }

  return (
    <Grid
      p="xl"
      sx={(theme) => ({
        backgroundColor: theme.colors.gray[0],
        margin: 0,
        minHeight: "calc(100vh - 56px)",
      })}
    >
      <Grid.Col span={span}>
      </Grid.Col>
      <Grid.Col span={span}>
        <AddTransaction
          categories={user.categories}
          errors={addTransactionErrors}
          onAdd={addTransaction}
        />
      </Grid.Col>
      <Grid.Col span={span}>
      </Grid.Col>
      <Grid.Col span={span}>
      </Grid.Col>
    </Grid>
  );
}

export default Dashboard;
