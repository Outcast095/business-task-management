///файл /MainLayout.tsx 
/// файл расположен по адресу src/client/components/layouts/MainLayout.tsx

import { Outlet } from 'react-router-dom';
import { Header } from '../header/Header';

export const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* Здесь будут рендериться TodosPage, ProfilePage и т.д. */}
      </main>
    </>
  );
};