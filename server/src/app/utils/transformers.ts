import dayjs from "dayjs";
import { ValueTransformer } from "typeorm";

export const dateTransformer: ValueTransformer = {
  from(value: string): Date {
    return dayjs(value, "YYYY-MM-DD").toDate();
  },
  to(value: Date): string {
    return dayjs(value).format("YYYY-MM-DD");
  },
};

export const moneyTransformer: ValueTransformer = {
  from(value: string): number {
    return parseFloat(value.slice(1));
  },
  to(value: number): string {
    return value.toFixed(2);
  },
};
