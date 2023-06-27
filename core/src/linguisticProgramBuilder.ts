import { ChatMessage, ChatMessageRoleEnum } from "./languageModels";
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

const groupedTagsToSingleTag = <T extends ContextTag>(
  tagName: string,
  tags: T[]
): string => {
  return `<${tagName.toUpperCase()}>${tags
    .map((t) => {
      return t.content;
    })
    .join("\n")}</${tagName.toUpperCase()}>`;
};

const contextToLinguistPartial = (context: ContextTag[]): string => {
  const groupedContextTags = groupedTags(context);
  return Object.keys(groupedContextTags)
    .map((tagName) => {
      const tags = groupedContextTags[tagName];
      return groupedTagsToSingleTag(tagName, tags);
    })
    .join("\n");
};

export const outputToLinguisticPartial = (output: OutputTag[]): string => {
  const groupedOutputTags = groupedTags(output);
  return Object.keys(groupedOutputTags)
    .map((tagName) => {
      const tags = groupedOutputTags[tagName];
      const optionalText = tags[0].optional ? "optional: " : "";
      return `${optionalText}${groupedTagsToSingleTag(tagName, tags)}}`;
    })
    .join("\n");
};

const actionsToLinguisticPartial = (
  soul: Soul,
  actions: ActionTag[]
): string => {
  return `
  <Actions>
    ${soul.blueprint.name} can (optionally) take any of the following actions:
   ${actions
     .map((a) => {
       return `${a.name}: ${a.description}`;
     })
     .join("\n  ")}
  </Actions>
    `.trim();
};

// This takes the output of a linguisticprogram pipeline (currently called MentalModel) and compiles it into a chat prompt for the LLM to process.
export const streamOfConsciousnessToProgram = (
  soul: Soul,
  stream: StreamOfConsciousness
): ChatMessage[] => {
  const messages = stream.messages;

  const systemContextMessage = contextToLinguistPartial(stream.context);
  const systemActionText = actionsToLinguisticPartial(soul, stream.actions);
  const outputSystemMessage = `
After receiving a new message, you will perform an introspection sequence that models ${soul.blueprint.name}'s cognition. You respond in the following form:

${outputToLinguisticPartial(stream.output)}

`.trim();

  const system: ChatMessage = {
    role: ChatMessageRoleEnum.System,
    content: `
${systemContextMessage}

${systemActionText}

${outputSystemMessage}
<END />,
      `.trim(),
    name: soul.blueprint.name,
  };

  return [system].concat(messages);
};
