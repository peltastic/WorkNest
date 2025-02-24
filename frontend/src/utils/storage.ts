import Cookies, { CookieSetOptions } from "universal-cookie";
const cookies = new Cookies();
export function setTokenCookie(token: string) {
  cookies.set("token", token, {
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}
export function setAdminTokenCookie(token: string) {
  cookies.set("ad_token", token, {
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}
export function setArtisanTokenCookie(token: string) {
  cookies.set("ar_token", token, {
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}


export function setCookie(
  key: string,
  value: string,
  options?: CookieSetOptions
) {
  cookies.set(key, value, {
    path: "/",
    ...options,
  });
}

export function getCookie(key: string) {
  return cookies.get(key);
}

export function removeCookie(key: string) {
  return cookies.remove(key, {
    path: "/",
  });
}
