import React from "react";
import { VerifiedUser } from "@material-ui/icons";

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
