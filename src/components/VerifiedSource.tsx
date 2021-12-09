import React from "react";
import { VerifiedUser } from "@mui/icons-material";

export const VerifiedSource: React.FC<React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>> = () => {
  return (
    <div>
      <VerifiedUser className="verifiedIcon" style={{ fill: "#3F51B5" }} />
    </div>
  );
};
