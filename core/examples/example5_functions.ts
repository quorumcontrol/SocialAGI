import * as readline from "readline";
import { Blueprints, ChatMessage } from "../src";
import dotenv from "dotenv";
import { Action, CortexStep } from "../src/cortexStep";
import { ChatMessageRoleEnum } from "../src";
import { FunctionRunner } from "../src/languageModels/functions";
import { Memory } from "../src/languageModels/memory";

dotenv.config();

// this example demonstrates generalized reasoning about thought process against a goal

const blueprint = Blueprints.SAMANTHA;

const goal = `Adding two cool numbers`;
const initialMemory = [
  {
    role: ChatMessageRoleEnum.System,
    content: `<CONTEXT>You are modeling the mind of ${blueprint.name}

${blueprint.personality}

${blueprint.name} has the following goal of: ${goal}

</CONTEXT>`,
  },
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const additionFunction:FunctionRunner = {
  specification: {
    name: "add",
    description: "Use this function to add two numbers",
    parameters: {
      type: "object",
      properties: {
        a: {
          type: "number",
        },
        b: {
          type: "number",
        },
      }
    },
  },
  run: ({ a, b }: {a: number, b: number}): Promise<ChatMessage[]> => {
    return Promise.resolve([
      {
        role: ChatMessageRoleEnum.System,
        content: `The sum of ${a} and ${b} is ${a + b}`,
      },
    ]);
  }
}

let dialog = new CortexStep(blueprint.name)
  .withMemory(initialMemory)
  .withFunctions([additionFunction]);

async function addDialogLine(text: string) {
  const response = await dialog.withMemory([{
    role: ChatMessageRoleEnum.User,
    content: text,
  }]).next(Action.EXTERNAL_DIALOG, {
    action: "says",
    description: `what ${blueprint.name} says out loud next`,
  })
  console.log("value: ", response.value)
}

console.log(
  '- Type a message to send to Soul\n- Type "reset" to reset\n- Type "exit" to quit\n'
);

rl.on("line", async (line) => {
  if (line.toLowerCase() === "exit") {
    rl.close();
  } else {
    const text: string = line;
    addDialogLine(text);
  }
});
