import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AddTransaction from "./AddTransaction";
import { clearInput, typeInput } from "../../utils/inputTest";

describe("AddTransaction", () => {
  it("displays errors", () => {
    const errors = {
      amount: "Amount is invalid",
      categoryId: "Category is invalid",
      date: "Date is invalid",
      label: "Label is invalid",
      note: "Note is invalid",
    };
    const onAdd = async () => true;

    render(<AddTransaction categories={[]} errors={errors} onAdd={onAdd} />);

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

    await clearInput("Amount");
    await typeInput("Amount", amount.toString());
    await typeInput("Label", label);
    await typeInput("Note", note);
    const addButton = screen.getByRole("button", { name: "Add" });
    await userEvent.click(addButton);

    expect(onAdd).toHaveBeenCalledWith({
      amount,
      categoryId: categories[0]!.id.toString(),
      date: expect.any(Date),
      label,
      note,
    });
  });
});
