import React from "react";

import { CheckOutlined as CheckedIcon } from "@material-ui/icons";
import { Tooltip } from "@material-ui/core";

export const AlreadyAddedIcon: React.FC = () => {
  return (
      <Tooltip title="Already Added">
          <CheckedIcon />
      </Tooltip>
  );
};
