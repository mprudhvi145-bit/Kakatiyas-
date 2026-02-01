
import { redirect } from "next/navigation";
import { getServerSessionSafe } from "./auth";
import { Role } from "../types";

export async function requireAuth() {
  const session = await getServerSessionSafe();
  if (!session) {
    redirect("/auth/login");
  }
  return session;
}

export async function requireAdmin() {
  const session = await getServerSessionSafe();
  
  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== Role.ADMIN) {
    // Redirect to home or a forbidden page
    redirect("/");
  }

  return session;
}
