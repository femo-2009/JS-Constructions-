import { ID, Query, Channel } from "appwrite";
import {
  databases,
  realtime,
  APPWRITE_DATABASE_ID,
} from "@/integrations/appwrite/client";

export type Row = Record<string, any> & { $id: string };

export async function listRows(tableId: string, queries: any[] = []) {
  const { rows } = await databases.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId,
    queries,
    total: false,
  });
  return (rows ?? []) as Row[];
}

export async function getRow(tableId: string, rowId: string) {
  return (await databases.getRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId,
    rowId,
  })) as Row;
}

/**
 * Creates a content row. `adminUid` (the logged-in admin's user id) is used to
 * grant the admin write/update/delete permissions, while everyone (any) can read.
 */
export async function createRow(
  tableId: string,
  data: Record<string, any>,
  adminUid: string | null = null,
  rowId: string = ID.unique()
) {
  return databases.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId,
    rowId,
    data,
    permissions: rowPermissions(adminUid),
  });
}

export async function updateRow(
  tableId: string,
  rowId: string,
  data: Record<string, any>
) {
  return databases.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId,
    rowId,
    data,
  });
}

export async function deleteRow(tableId: string, rowId: string) {
  return databases.deleteRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId,
    rowId,
  });
}

// Standard content-row permissions:
//   - anyone can read,
//   - the admin (by uid) gets full `write` (create + update + delete) on this row.
export function rowPermissions(adminUid: string | null): string[] {
  const perms = [`read("any")`];
  if (adminUid) {
    perms.push(`write("user:${adminUid}")`);
  }
  return perms;
}

// ---- Realtime helpers ----
export type RealtimeRowEvent = "create" | "update" | "delete";
export type RowCallback = (event: RealtimeRowEvent, row: Row) => void;

export async function subscribeRows(tableId: string, callback: RowCallback) {
  const channel = Channel.tablesdb(APPWRITE_DATABASE_ID).table(tableId).row();
  return realtime.subscribe(channel, (response: any) => {
    const events = response.events ?? [];
    const payload = response.payload ?? {};
    for (const ev of events) {
      if (ev.endsWith(".create")) callback("create", payload);
      else if (ev.endsWith(".update")) callback("update", payload);
      else if (ev.endsWith(".delete")) callback("delete", payload);
    }
  });
}

export { Query };
