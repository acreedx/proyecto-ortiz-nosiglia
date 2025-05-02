"use client";
import { Icon, Switch } from "@chakra-ui/react";
import useColorMode from "../../hooks/useColorMode";
import { FaMoon, FaSun } from "react-icons/fa";

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <li>
      <Switch.Root
        colorPalette="orange"
        size="lg"
        checked={colorMode === "dark"}
        onCheckedChange={() => {
          if (typeof setColorMode === "function") {
            setColorMode(colorMode === "light" ? "dark" : "light");
          }
        }}
      >
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb />
          <Switch.Indicator fallback={<Icon as={FaMoon} color="gray.400" />}>
            <Icon as={FaSun} color="yellow.400" />
          </Switch.Indicator>
        </Switch.Control>
      </Switch.Root>
    </li>
  );
};

export default DarkModeSwitcher;
