import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AddTransaction from "./AddTransaction";

describe("AddTransaction", () => {
  it("displays errors", () => {
    const errors = {
      amount: "Amount is invalid",
      categoryId: "Category is invalid",
      date: "Date is invalid",
      label: "Label is invalid",
      note: "Note is invalid",
    };

    render(<AddTransaction categories={[]} errors={errors} onAdd={() => {}} />);

    for (const error of Object.values(errors)) {
      expect(screen.getByText(error)).toBeInTheDocument();
    }
  });

  it("submits form values", async () => {
    const amount = 1.23;
    const label = "Label";
    const note = "Note";

    const categories = [
      {
        id: 1,
        name: "Expense",
        type: "expense" as const,
        colour: "",
        target: 0,
      },
    ];
    const onAdd = jest.fn();

    render(
      <AddTransaction categories={categories} errors={{}} onAdd={onAdd} />
    );

    const amountInputId = screen.getByText("Amount").getAttribute("for");
    const amountInput = document.getElementById(amountInputId!);
    await userEvent.clear(amountInput!);
    await userEvent.type(amountInput!, amount.toString());

    const labelInputId = screen.getByText("Label").getAttribute("for");
    const labelInput = document.getElementById(labelInputId!);
    await userEvent.type(labelInput!, label);

    const noteInputId = screen.getByText("Note").getAttribute("for");
    const noteInput = document.getElementById(noteInputId!);
    await userEvent.type(noteInput!, note);

    const addButton = screen.getByRole("button", { name: "Add" });
    await userEvent.click(addButton);

    expect(onAdd).toHaveBeenCalledWith(
      {
        amount,
        categoryId: categories[0]!.id.toString(),
        date: expect.any(Date),
        label,
        note,
      },
      expect.anything()
    );
  });
});
