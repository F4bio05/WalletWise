export const monthToNumber = {
  Gennaio: 1,
  Febbraio: 2,
  Marzo: 3,
  Aprile: 4,
  Maggio: 5,
  Giugno: 6,
  Luglio: 7,
  Agosto: 8,
  Settembre: 9,
  Ottobre: 10,
  Novembre: 11,
  Dicembre: 12,
};

export const numberToMonth = {
  1: "Gennaio",
  2: "Febbraio",
  3: "Marzo",
  4: "Aprile",
  5: "Maggio",
  6: "Giugno",
  7: "Luglio",
  8: "Agosto",
  9: "Settembre",
  10: "Ottobre",
  11: "Novembre",
  12: "Dicembre",
};

export const numberToMonthShort = {
  1: "Gen",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "Mag",
  6: "Giu",
  7: "Lug",
  8: "Ago",
  9: "Set",
  10: "Ott",
  11: "Nov",
  12: "Dic",
};

export const monthToNumberShort = {
  Gen: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  Mag: 5,
  Giu: 6,
  Lug: 7,
  Ago: 8,
  Set: 9,
  Ott: 10,
  Nov: 11,
  Dic: 12,
};

export const days = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

export const dayToNumber = {
  lun: 1,
  mar: 2,
  mer: 3,
  gio: 4,
  ven: 5,
  sab: 6,
  dom: 7,
};

export type itemSupabaseType = {
  id: number;
  created_at: string;
  user_id: string;
  type: string;
  name: string;
  description: string;
  subscription: boolean;
  date: string;
  period_sub?: string;
  category: number;
  amount: number;
} ;

export type itemsSupabaseType = Array<itemSupabaseType | null>;

export type itemsCalendarType = Array<{
  item: string;
  date_string: string;
  date: Date;
  events?: itemsSupabaseType;
} | null>;


export type itemCalendarType = {
  item: string;
  date_string: string;
  date: Date;
  events?: itemsSupabaseType;
} | null;