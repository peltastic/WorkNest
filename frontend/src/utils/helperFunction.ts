import { getCookie } from "./storage";

export function hastoken(value: string): boolean {
  const token = getCookie(value);
  return token ? true : false;
}
