export type SmartFieldValue =
  | true
  | string
  | SmartGroup
  | Record<string, any>;

export interface SmartGroup {
  source: string;
  fields?: Record<string, SmartFieldValue>;
  __union?: Record<string, Record<string, SmartFieldValue>>;
}

export interface SmartQueryDSL {
  route: Record<string, any>;
}
