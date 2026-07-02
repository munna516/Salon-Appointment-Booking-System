import { cookies } from "next/headers";
import { verifyJwtToken } from "./jwt";

export async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  
  if (!token) {
    return null;
  }
  
  const payload = await verifyJwtToken(token);
  return payload;
}
