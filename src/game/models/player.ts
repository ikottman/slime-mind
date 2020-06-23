import { AI } from "../schema";

export default class Player {
  id: number;
  ai: AI;

  constructor(id: number, ai: AI) {
      this.id = id;
      this.ai = ai;
  }
}