export interface Option {
  label: string;
  value: string;
}

export interface OptionResponse{
  options: Option[],
  hasMore: boolean,
  additional: {},
}

export {};
