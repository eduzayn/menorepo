import { ReactNode } from 'react';
interface LayoutProps {
    children: ReactNode;
}
/**
 * Layout padrão da aplicação com Header e Footer
 * Pode ser usado de duas formas:
 * 1. Com children: <Layout><SeuComponente /></Layout>
 * 2. Como wrapper de rotas com Outlet: <Route element={<Layout />}>...</Route>
 */
export default function Layout({ children }: LayoutProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Layout.d.ts.map