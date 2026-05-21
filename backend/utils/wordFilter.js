import { Filter } from "bad-words";
import { all as germanWords } from "../variables/badWords.js";

export const filter = new Filter();
filter.addWords(...germanWords);
