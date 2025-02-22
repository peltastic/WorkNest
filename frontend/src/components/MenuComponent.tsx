import { FloatingAxesOffsets, FloatingPosition, Menu } from "@mantine/core";
import React from "react";

interface Props extends React.PropsWithChildren {
  target: React.ReactNode;
  position?: FloatingPosition | undefined;
  offset?: number | FloatingAxesOffsets | undefined;
}

const MenuComponent = (props: Props) => {
  return (
    <Menu
      shadow="md"
      position={props.position || "bottom-end"}
      offset={props.offset}
    >
      <Menu.Target>{props.target}</Menu.Target>
      <Menu.Dropdown>{props.children}</Menu.Dropdown>
    </Menu>
  );
};

export default MenuComponent;
