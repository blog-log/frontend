import type { Adapter } from "next-auth/adapters";
import { TypeORMLegacyAdapter } from "@next-auth/typeorm-legacy-adapter";

export const getAdapter = (): Adapter => {
  switch (process.env.DATABASE_TYPE) {
    case "postgres":
      return getTypeormAdapter();
    default:
      throw new Error(`unsupported database type ${process.env.DATABASE_TYPE}`);
  }
};

function getTypeormAdapter(): Adapter {
  const adapter = TypeORMLegacyAdapter({
    type: "postgres",
    url: process.env.DATABASE_URI,
    synchronize: true,
  });

  return adapter;
}
