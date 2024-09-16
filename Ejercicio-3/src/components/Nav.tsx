import { useAuth } from "@/services/providers/AuthProvider";
import { Button } from "./ui/button";

export default function Nav() {
  const { setToken, isLoggedIn } = useAuth();
  const handleLogout = () => {
    setToken(null);
  };

  return (
    <nav
      className={`h-12 flex items-center p-2 border-b justify-end ${
        isLoggedIn ? "visible" : "hidden"
      }`}
    >
      <Button onClick={handleLogout}>Cerrar Sesión</Button>
    </nav>
  );
}
