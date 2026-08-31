export const TBL = {
  CARDS: "cards",
  SETTINGS: "site_settings",
  PHONES: "contact_phones",
  EMAILS: "contact_emails",
};

export type Row = Record<string, any> & { $id: string };

export { listRows, getRow, createRow, updateRow, deleteRow, subscribeRows, Query } from "@/lib/db";
