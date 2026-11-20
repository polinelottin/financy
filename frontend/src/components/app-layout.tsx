import { NavLink, Outlet } from "react-router";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { Logo } from "./logo";

const ME = gql`
  query Me {
    me {
      id
      name
    }
  }
`;

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/transacoes", label: "Transações" },
  { to: "/categorias", label: "Categorias" },
];

export function AppLayout() {
  const { data } = useQuery<{ me: { id: string; name: string } }>(ME);

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-17 max-w-296 items-center justify-between px-6">
          <Logo />
          <nav className="flex gap-5 text-sm">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  cn(isActive ? "font-semibold text-brand-base" : "text-gray-600 hover:text-gray-800")
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <NavLink to="/perfil" aria-label="Perfil">
            <Avatar name={data?.me.name} />
          </NavLink>
        </div>
      </header>
      <main className="mx-auto max-w-296 px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}