import { ReactComponent as DragHandleIcon } from "./drag_handle-icon.svg";
import React from "react";

export function DragHandle(props) {
  return (
    <div style={{display: "inline-block"}} {...props}>
      <DragHandleIcon />
    </div>
  );
}
