import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./layouts/AdminLayout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CategoriesPage from "./pages/CategoriesPage";
import AboutPage from "./pages/AboutPage";
import GalleryPage from "./pages/GalleryPage";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import AccountOrdersPage from "./pages/AccountOrdersPage";
import AdminProductsListPage from "./pages/admin/AdminProductsListPage";
import AdminProductFormPage from "./pages/admin/AdminProductFormPage";
import AdminCategoriesListPage from "./pages/admin/AdminCategoriesListPage";
import AdminCategoryFormPage from "./pages/admin/AdminCategoryFormPage";
import AdminDiscountsPage from "./pages/admin/AdminDiscountsPage";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:productId" element={<ProductDetailsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/account/orders" element={<AccountOrdersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/products" replace />} />
        <Route path="products" element={<AdminProductsListPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/:productId/edit" element={<AdminProductFormPage />} />
        <Route path="categories" element={<AdminCategoriesListPage />} />
        <Route path="categories/new" element={<AdminCategoryFormPage />} />
        <Route path="categories/:categoryId/edit" element={<AdminCategoryFormPage />} />
        <Route path="discounts" element={<AdminDiscountsPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
