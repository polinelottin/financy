import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { useAuth } from "@/auth/auth-context";
import { AppLayout } from "@/components/app-layout";
import { CategoriesPage } from "@/pages/categories-page";
import { DashboardPage } from "@/pages/dashboard-page";
import { LoginPage } from "@/pages/login-page";
import { ProfilePage } from "@/pages/profile-page";
import { RegisterPage } from "@/pages/register-page";
import { TransactionsPage } from "@/pages/transactions-page";

export function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated ? (
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="transacoes" element={<TransactionsPage />} />
            <Route path="categorias" element={<CategoriesPage />} />
            <Route path="perfil" element={<ProfilePage />} />
          </Route>
        ) : (
          <>
            <Route index element={<LoginPage />} />
            <Route path="cadastro" element={<RegisterPage />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
