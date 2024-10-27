import { useState } from "react";
import Cookies from "js-cookie";

export const useCookie = () => {
  const [cookieValue, setCookieValue] = useState<string | undefined>(undefined);

  const setCookie = (name: string, value: string, days: number) => {
    Cookies.set(name, value, { expires: days });
    setCookieValue(Cookies.get(name));
  };

  const getCookie = (name: string) => {
    const value = Cookies.get(name);
    setCookieValue(value);
    return value;
  };

  return { cookieValue, setCookie, getCookie };
};
