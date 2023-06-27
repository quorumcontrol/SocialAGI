import { ConversationProcessor } from "../conversationProcessor";
import { ChatMessage, ChatMessageRoleEnum } from "../languageModels";
import {
  StreamOfConsciousness,
  outputToLinguisticPartial,
} from "../linguisticProgramBuilder";
import { MentalModel } from "./index";

export class Rememberance implements MentalModel {
  async process(
    stream: StreamOfConsciousness,
    conversation: ConversationProcessor
  ) {
    const rememberance: ChatMessage = {
      role: ChatMessageRoleEnum.System,
      content: `
${stream.rememberances.join("\n")}

Now, think through ${
        conversation.soul.blueprint.name
      }'s response to the last message using the following output format.
${outputToLinguisticPartial(stream.output)}
<END />`.trim(),
      name: conversation.soul.blueprint.name,
    };

    return {
      ...stream,
      messages: stream.messages.concat([rememberance]),
    };
  }

  update() {
    return;
  }
}
