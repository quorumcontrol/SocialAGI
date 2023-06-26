import { ConversationProcessor } from "../conversationProcessor";
import { Thought } from "../languageModels/memory";
import { StreamOfConsciousness } from "../linguisticProgramBuilder";

export interface MentalModel {
  update: (thoughts: Thought[], conversation: ConversationProcessor) => void;
  process: (
    stream: StreamOfConsciousness,
    conversation: ConversationProcessor
  ) => Promise<StreamOfConsciousness>;
}
