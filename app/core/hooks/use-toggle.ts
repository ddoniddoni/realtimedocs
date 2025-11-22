"use client";
import { useState } from "react";

type useToggleProps = {
  on?: boolean;
};

export const useToggle = (props: useToggleProps = {}) => {
  const { on = false } = props;
  const [isOn, setOn] = useState<boolean>(on);

  const toggle = () => {
    setOn(!isOn);
  };

  const open = () => {
    setOn(true);
  };

  const close = () => {
    setOn(false);
  };

  const setToggle = (value: boolean) => {
    setOn(value);
  };

  return {
    isOn,
    toggle,
    close,
    open,
    setToggle,
  };
};
