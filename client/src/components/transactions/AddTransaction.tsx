import {
  NumberInput,
  Select,
  type SelectItem,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { CurrencyDollar } from "tabler-icons-react";

import Block from "../ui/Block";
import SubmitButton from "../ui/SubmitButton";

import type { Category } from "../../store";

export interface AddTransactionProps {
  categories: Category[];
  errors: Partial<Record<keyof AddTransactionFields, string>>;
  onAdd: (values: AddTransactionFields) => Promise<boolean>;
}

export interface AddTransactionFields {
  amount: number;
  categoryId: string;
  date: Date;
  label: string;
  note: string;
}

function AddTransaction(props: AddTransactionProps): JSX.Element {
  const incomeCategories = props.categories
    .filter(({ type }) => type === "income")
    .sort((a, b) => a.name.localeCompare(b.name));
  const expenseCategories = props.categories
    .filter(({ type }) => type === "expense")
    .sort((a, b) => a.name.localeCompare(b.name));
  const categories: SelectItem[] = [
    ...incomeCategories,
    ...expenseCategories,
  ].map((category) => ({
    value: category.id.toString(),
    label: category.name,
    group: `${category.type[0]!.toUpperCase()}${category.type.slice(1)}`,
  }));

  const form = useForm<AddTransactionFields>({
    initialValues: {
      amount: 0,
      categoryId: (expenseCategories[0]?.id ?? 0).toString(),
      date: new Date(),
      label: "",
      note: "",
    },
  });

  useEffect(() => {
    form.setErrors(props.errors);
  }, [props.errors]);

  async function onSubmit(values: AddTransactionFields): Promise<void> {
    const success = await props.onAdd(values);
    if (success) {
      form.reset();
    }
  }

  return (
    <Block title="Add Transaction">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <NumberInput
          label="Amount"
          required
          min={0}
          precision={2}
          icon={<CurrencyDollar />}
          {...form.getInputProps("amount")}
        />
        <Select
          label="Category"
          required
          data={categories}
          searchable
          {...form.getInputProps("categoryId")}
        />
        <DatePicker
          label="Date"
          required
          clearable={false}
          {...form.getInputProps("date")}
        />
        <TextInput label="Label" {...form.getInputProps("label")} />
        <Textarea label="Note" {...form.getInputProps("note")} />
        <SubmitButton text="Add" />
      </form>
    </Block>
  );
}

export default AddTransaction;
