import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import qs from "qs";

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function useQuery() {
  return qs.parse(useLocation().search, { ignoreQueryPrefix: true });
}

function useAnchor(): [
  null | HTMLElement,
  (event: React.MouseEvent<HTMLElement>) => void,
  () => void
] {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return [anchorEl, handleClick, handleClose];
}

export { usePrevious, useQuery, useAnchor };
