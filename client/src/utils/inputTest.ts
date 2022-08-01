import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export async function typeInput(label: string, text: string): Promise<void> {
  const input = getInput(label);
  await userEvent.type(input, text);
}

export async function clearInput(label: string): Promise<void> {
  const input = getInput(label);
  await userEvent.clear(input);
}

function getInput(label: string): HTMLElement {
  const inputId = screen.getByText(label).getAttribute("for")!;
  return document.getElementById(inputId)!;
}
