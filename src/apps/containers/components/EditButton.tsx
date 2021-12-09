import React from "react";
import { Fab, Tooltip } from "@mui/material";
import { EditOutlined as EditIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

interface Props {
  url: string;
  title: string;
}

export const EditButton: React.FC<Props> = ({ url, title }) => {
  return (
    <Link to={url}>
      <Tooltip title={title}>
        <Fab color="primary" className="fab">
          <EditIcon />
        </Fab>
      </Tooltip>
    </Link>
  );
};
