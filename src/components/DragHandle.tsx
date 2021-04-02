import React from "react";
import { ReactComponent as DragHandleIcon } from "./drag_handle-icon.svg";

export const DragHandle: React.FC<React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>> = props => {
  return (
    <div style={{ display: "inline-block" }} {...props}>
      <DragHandleIcon />
    </div>
  );
};
