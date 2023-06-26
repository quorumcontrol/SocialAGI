import { ConversationProcessor } from "../conversationProcessor";
import { StreamOfConsciousness } from "../linguisticProgramBuilder";
import { MentalModel } from "./index";

export class ConversationCompressor implements MentalModel {
  async process(
    stream: StreamOfConsciousness,
    _conversation: ConversationProcessor
  ) {
    const initialMessages = stream.messages;

    let truncatedMessages = initialMessages;
    if (initialMessages.length > 10) {
      if (initialMessages.length === 11) {
        truncatedMessages = initialMessages
          .slice(0, 1)
          .concat(initialMessages.slice(2));
      } else if (initialMessages.length === 12) {
        truncatedMessages = initialMessages
          .slice(0, 2)
          .concat(initialMessages.slice(3));
      } else if (initialMessages.length === 13) {
        truncatedMessages = initialMessages
          .slice(0, 3)
          .concat(initialMessages.slice(4));
      } else {
        truncatedMessages = initialMessages
          .slice(0, 3)
          .concat(initialMessages.slice(-10));
      }
    }

    return {
      ...stream,
      messages: truncatedMessages,
    };
  }

  update() {
    return;
  }
}
