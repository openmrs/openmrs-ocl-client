export interface NotificationItemRow {
  expression: string;
  added: boolean;
  message: string | string[];
}

export interface NotificationItem {
  meta?: any[];
  result: NotificationItemRow[];
  progress: string;
}
