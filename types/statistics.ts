export type TypeInfo = "year" | "month";

export type DataStatType = Array<{
  label?: string;
  value: number;
  frontColor?: string;
  spacing?: number;
  labelWidth?: number;
}>;

export type DataPercentageType = Array<{
  color: string;
  label: string;
  percentage: number;
}>
