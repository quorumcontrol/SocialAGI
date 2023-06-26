import { ChatMessage, ChatMessageRoleEnum } from "./languageModels";
import { Memory } from "./languageModels/memory";
import { Soul } from "./soul";

export interface ContextTag {
  name: string;
  content: string;
}

export interface OutputTag extends ContextTag {
  optional?: boolean;
}

export interface ActionTag {
  name: string;
  description: string;
}

export type MarkedMessage = ChatMessage & { creator?: string };

export interface StreamOfConsciousness {
  context: ContextTag[];
  output: OutputTag[];
  rememberances: string[];
  // todo: add functions here?
  actions: ActionTag[];
  messages: MarkedMessage[];
}

export const createBlankStreamOfConsciousness = (
  messages: ChatMessage[] = []
): StreamOfConsciousness => {
  return {
    context: [],
    output: [],
    rememberances: [],
    actions: [],
    messages,
  };
};

const groupedTags = <T extends ContextTag>(tags: T[]): Record<string, T[]> => {
  return tags.reduce((acc, tag) => {
    acc[tag.name] ||= [];
    acc[tag.name].push(tag);
    return acc;
  }, {} as Record<string, T[]>);
};

export const streamOfConsciousnessToProgram = (
  soul: Soul,
  stream: StreamOfConsciousness
): ChatMessage[] => {
  const context = groupedTags(stream.context);
  const output = groupedTags(stream.output);
  const rememberances = stream.rememberances;
  const actions = stream.actions;
  const messages = stream.messages;

  const systemContextMessage = Object.keys(context)
    .map((tagName) => {
      const tags = context[tagName];
      return `<${tagName.toUpperCase()}>${tags
        .map((t) => {
          return t.content;
        })
        .join("\n")}</${tagName.toUpperCase()}>`;
    })
    .join("\n");

  const systemActionText = `
<Actions>
  ${soul.blueprint.name} can (optionally) take any of the following actions:
 ${actions
   .map((a) => {
     return `${a.name}: ${a.description}`;
   })
   .join("\n  ")}
</Actions>
  `.trim();

  const outputSystemMessage = Object.keys(output)
    .map((tagName) => {
      const tags = output[tagName];
      const optionalText = tags[0].optional ? "optional: " : "";
      return `${optionalText}<${tagName.toUpperCase()}>${tags
        .map((t) => {
          return t.content;
        })
        .join("\n")}</${tagName.toUpperCase()}>`;
    })
    .join("\n");

  const system: ChatMessage = {
    role: ChatMessageRoleEnum.System,
    content: `
${systemContextMessage}
${systemActionText}

After receiving a new message, you will perform an introspection sequence that models ${soul.blueprint.name}'s cognition. You respond in the following form:

${outputSystemMessage}
<END />,
      `.trim(),
    name: soul.blueprint.name,
  };

  const rememberance: ChatMessage = {
    role: ChatMessageRoleEnum.System,
    content:
      rememberances.join("\n") +
      `Now, think through ${soul.blueprint.name}'s response to the last message using the following output format.` +
      outputSystemMessage +
      "\n<END />",
    name: soul.blueprint.name,
  };

  return [system].concat(messages).concat([rememberance]);
};
