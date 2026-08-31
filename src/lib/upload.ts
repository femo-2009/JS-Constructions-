import { ID } from "appwrite";
import { storage, APPWRITE_BUCKET_ID, APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@/integrations/appwrite/client";

export async function uploadImage(file: File, folder = "uploads"): Promise<string> {
  const fileId = ID.unique();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const name = `${folder}/${fileId}.${ext}`;
  const result = await storage.createFile(APPWRITE_BUCKET_ID, fileId, file);
  return fileViewUrl(result.$id);
}

export function fileViewUrl(fileId: string): string {
  return `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;
}

export function fileIdFromViewUrl(url: string): string | null {
  const re = new RegExp(`/storage/buckets/${APPWRITE_BUCKET_ID}/files/([^/?]+)/view`);
  const m = url.match(re);
  return m ? m[1] : null;
}

export async function deleteImage(url: string) {
  const fileId = fileIdFromViewUrl(url);
  if (!fileId) return;
  try {
    await storage.deleteFile(APPWRITE_BUCKET_ID, fileId);
  } catch (e) {
    // ignore
  }
}
