"use client";
import { useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";

const useColorMode = () => {
  const [mounted, setMounted] = useState(false);
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const className = "dark";
    const bodyClass = window.document.body.classList;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    colorMode === "dark"
      ? bodyClass.add(className)
      : bodyClass.remove(className);
  }, [colorMode, mounted]);

  if (!mounted) return [null, () => {}]; // evitar render

  return [colorMode, setColorMode];
};

export default useColorMode;
