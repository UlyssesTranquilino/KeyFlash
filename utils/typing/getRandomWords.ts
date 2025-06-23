import { generate, count } from "random-words";

export function getRandomWords(length: number) {
  return generate({ exactly: length, join: " " });
}
