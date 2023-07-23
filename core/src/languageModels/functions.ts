import { ChatMessage, FunctionSpecification } from "./index.js";

export interface FunctionRunner {
  specification: FunctionSpecification;
  run: (args: any) => Promise<ChatMessage[] | undefined>;
}
