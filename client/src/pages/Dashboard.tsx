import { Grid } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import AddTransaction, {
  type AddTransactionFields,
} from "../components/transactions/AddTransaction";
import useStore from "../store";

function Dashboard(): JSX.Element {
  const span = useMediaQuery("(min-width: 900px)") ? 6 : 12;
  const user = useStore((state) => state.user)!;

  async function addTransaction(values: AddTransactionFields): Promise<void> {
    console.log(values);
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
          errors={{}}
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
