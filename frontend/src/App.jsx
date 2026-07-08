import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Import components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Import auth
import LoginAdmin from "./auth/LoginAdmin";
import LoginCustomer from "./auth/LoginCustomer";
import RegisterCustomer from "./auth/RegisterCustomer";

// Import pages (User)
import Home from "./pages/user/Home";
import About from "./pages/user/About";
import Contact from "./pages/user/Contact";
import Gallery from "./pages/user/Gallery";
import Shop from "./pages/user/Shop";
import Stores from "./pages/user/Stores";
import Issues from "./pages/user/Issues";
import Journal from "./pages/user/Journal";
import Collaborations from "./pages/user/Collaborations";
import Videos from "./pages/user/Videos";
import Cart from "./pages/user/Cart";
import Orders from "./pages/user/Orders";
import ProposeCollaboration from "./pages/user/ProposeCollaboration";
import Profile from "./pages/user/Profile";
import EditeProfile from "./pages/user/EditeProfile";

// Import components (User)
import DetailJournal from "./components/user/DetailJournal";
import DetailCollaborations from "./components/user/DetailCollaborations";
import DetailIssues from "./components/user/DetailIssues";
import DetailStores from "./components/user/DetailStores";
import Faq from "./components/user/Faq";
import HowToOrders from "./components/user/HowToOrders";
import PaymentConfirmation from "./components/user/PaymentConfirmation";
import RefundPolicy from "./components/user/RefundPolicy";
import DetailProductsUser from "./components/user/DetailProductsUser";

// Import pages (Admin)
import Dashboard from "./pages/admin/Dashboard";
import ManageCustomers from "./pages/admin/ManageCustomers";
import CustomerStats from "./pages/admin/CustomerStats";
import CustomerProfile from "./pages/admin/CustomerProfile";
import ManageJournal from "./pages/admin/ManageJournal";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageStores from "./pages/admin/ManageStores";
import ManageCategory from "./pages/admin/ManageCategory";
import ManageCollaborations from "./pages/admin/ManageCollaborations";
import ManageVideos from "./pages/admin/ManageVideos";
import ManageIssues from "./pages/admin/ManageIssues";
import ManageProposals from "./pages/admin/ManageProposals";
import ManageContact from "./pages/admin/ManageContact";
import DetailProposals from "./pages/admin/DetailProposals"; // PASTIKAN FILE INI ADA

// Import components (Admin)
import AddNewProducts from "./components/admin/AddNewProducts";
import EditeProducts from "./components/admin/EditeProducts";
import DetailProducts from "./components/admin/DetailProducts";
import AddNewJournal from "./components/admin/AddNewJournal";
import EditeJournal from "./components/admin/EditeJournal";
import DetailMessage from "./components/admin/DetailMessage";
import EditeIssues from "./components/admin/EditeIssues";
import AddNewIssues from "./components/admin/AddNewIssues";
import AddNewCollaborations from "./components/admin/AddNewCollaborations";
import EditeCollaborations from "./components/admin/EditeCollaborations";
import AddNewStore from "./components/admin/AddNewStore";
import EditeStore from "./components/admin/EditeStore";
import DetailOrders from "./components/admin/DetailOrders";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const shouldHideLayout = location.pathname.startsWith("/login") || location.pathname.startsWith("/admin") || location.pathname.startsWith("/login-customer") || location.pathname.startsWith("/register-customer");

  return (
    <div>
      {!shouldHideLayout && <Navbar />}

      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<LoginAdmin />} />
        <Route path="/login-customer" element={<LoginCustomer />} />
        <Route path="/register-customer" element={<RegisterCustomer />} />

        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/gallery/issues" element={<Issues />} />
        <Route path="/gallery/collaboration" element={<Collaborations />} />
        <Route path="/gallery/videos" element={<Videos />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/collaborations/propose" element={<ProposeCollaboration />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile/edit/:id" element={<EditeProfile />} />
        <Route path="/shop/detail-products/:id" element={<DetailProductsUser />} />
        <Route path="/journal/detail/:id" element={<DetailJournal />} />
        <Route path="/collaborations/detail/:id" element={<DetailCollaborations />} />
        <Route path="/issues/detail/:id" element={<DetailIssues />} />
        <Route path="/stores/detail/:id" element={<DetailStores />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/how-to-orders" element={<HowToOrders />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/manage-products" element={<ManageProducts />} />
        <Route path="/admin/manage-orders" element={<ManageOrders />} />
        <Route path="/admin/manage-customers" element={<ManageCustomers />} />
        <Route path="/admin/customer-stats" element={<CustomerStats />} />
        <Route path="/admin/customer-profile/:email" element={<CustomerProfile />} />
        <Route path="/admin/manage-journal" element={<ManageJournal />} />
        <Route path="/admin/manage-stores" element={<ManageStores />} />
        <Route path="/admin/manage-category" element={<ManageCategory />} />
        <Route path="/admin/manage-collaborations" element={<ManageCollaborations />} />
        <Route path="/admin/manage-videos" element={<ManageVideos />} />
        <Route path="/admin/manage-issues" element={<ManageIssues />} />
        <Route path="/admin/manage-contact" element={<ManageContact />} />
        <Route path="/admin/manage-proposals" element={<ManageProposals />} />
        <Route path="/admin/add-new-products" element={<AddNewProducts />} />
        <Route path="/admin/edit-products/:id" element={<EditeProducts />} />
        <Route path="/admin/detail-products/:id" element={<DetailProducts />} />
        <Route path="/admin/add-new-journal" element={<AddNewJournal />} />
        <Route path="/admin/edit-journal/:id" element={<EditeJournal />} />
        <Route path="/admin/detail-message/:id" element={<DetailMessage />} />
        <Route path="/admin/edit-issues/:id" element={<EditeIssues />} />
        <Route path="/admin/add-new-issues" element={<AddNewIssues />} />
        <Route path="/admin/add-new-collaborations" element={<AddNewCollaborations />} />
        <Route path="/admin/edite-collaborations/:id" element={<EditeCollaborations />} />
        <Route path="/admin/add-new-store" element={<AddNewStore />} />
        <Route path="/admin/edite-store/:id" element={<EditeStore />} />
        <Route path="/admin/detail-proposals/:id" element={<DetailProposals />} />
        <Route path="/admin/detail-orders/:id" element={<DetailOrders />} />
      </Routes>

      {!shouldHideLayout && <Footer />}
    </div>
  );
}

export default App;
