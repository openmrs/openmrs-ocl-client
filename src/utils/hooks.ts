import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import qs from "qs";

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useQueryParams<QueryParamsType>(): QueryParamsType {
  return (qs.parse(useLocation().search, {
    ignoreQueryPrefix: true
  }) as unknown) as QueryParamsType;
}

export function useAnchor(): [
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
