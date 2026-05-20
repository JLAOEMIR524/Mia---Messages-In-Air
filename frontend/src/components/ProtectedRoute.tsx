import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "../api/auth-client";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  if (isPending) return <p>Loading...</p>;
  if (!session) return <Navigate to={"/login"} />;

  //This are all the child elements of the tag which should be handed over to the next instance:
  return children;
}
