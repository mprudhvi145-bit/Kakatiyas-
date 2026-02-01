
import { useSession } from "next-auth/react";
import { Role } from "../../types";

export function useAuth() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const user = session?.user;
  const role = session?.user?.role;

  const isAdmin = role === Role.ADMIN;
  const isArtisan = role === Role.ARTISAN;
  const isManager = role === Role.MANAGER;

  return {
    session,
    user,
    role,
    isLoading,
    isAuthenticated,
    isAdmin,
    isArtisan,
    isManager
  };
}
