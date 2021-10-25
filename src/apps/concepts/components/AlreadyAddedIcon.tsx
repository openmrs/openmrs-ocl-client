import React from "react";

import { CheckOutlined as CheckedIcon } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export const AlreadyAddedIcon: React.FC = () => {
  return (
    <Tooltip title="Already Added">
      <CheckedIcon style={{ marginLeft: "0.75rem" }} />
    </Tooltip>
  );
};
