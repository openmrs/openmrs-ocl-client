import { Fab, Tooltip } from "@material-ui/core";
import React from "react";
import { CopyContentIcon } from "../../../components/CopyContentIcon";

interface Props {
  title: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const CloneButton: React.FC<Props> = ({ title, onClick }) => {
  return (
    <Tooltip title={title}>
      <Fab color="primary" className="fab" onClick={onClick}>
        <CopyContentIcon />
      </Fab>
    </Tooltip>
  );
};
