function capitalize(input: string): string {
  if (input.length > 0) {
    return `${input[0]!.toUpperCase()}${input.slice(1)}`;
  }
  return "";
}

export default capitalize;
