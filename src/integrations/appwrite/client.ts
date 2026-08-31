import { Client, Account, TablesDB, Storage, Realtime } from "appwrite";

export const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
export const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
export const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const APPWRITE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

// Tables (collections) inside the TablesDB database
export const TBL_CARDS = "cards";
export const TBL_SETTINGS = "site_settings";
export const TBL_PHONES = "contact_phones";
export const TBL_EMAILS = "contact_emails";

const client = new Client();
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new TablesDB(client);
export const storage = new Storage(client);
export const realtime = new Realtime(client);

export { client };
