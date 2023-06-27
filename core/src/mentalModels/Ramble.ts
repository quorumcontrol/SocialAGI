import { rambleAction } from "../actions/ramble";
import { MentalModel } from "./index";

export class RambleProgram implements MentalModel {
  async toLinguisticProgram() {
    return {
      actions: [rambleAction],
    };
  }

  update() {
    return;
  }
}
