import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Page/Home/Home";
import ProductsDetails from "./Page/ProductDetails/ProductsDetails";
import Cart from "./Page/Cart/Cart";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import CategoryPage from "./Page/CategoryPages/CategoryPage";
import TopHeaders from "./Components/Headers/TopHeaders";
import ButtonHeaders from "./Components/Headers/ButtonHeaders";
import SearchPage from "./Page/SearchPage/SearchPage";
import Contact from "./Page/Contact/Contact";
import SuccesContent from "./Page/Contact/SuccesContent";
import Blog from "./Page/Blog/Blog";
import About from "./Page/About/About";
import Setting from "./Page/Setting/Setting";
import Login from "./Page/Auth/Login";
import Register from "./Page/Auth/Register";
import SettingRight from "./Page/Setting/SettingRight";
import Account_info from "./Page/Setting/Account_info/Account_Info";
import SecurityPassword from "./Page/Setting/Security_Password/Security_Password";
import AddressesShipping from "./Page/Setting/Addresses_Shipping/Addresses_Shipping";
import OrderHistory from "./Page/Setting/Order_History/Order_History";
import ReportProblem from "./Page/Setting/Report_problem/Report_problem";
import TermsConditions from "./Page/Setting/Terms_Conditions/Terms_Conditions";
import ProtectedRoute from "./Components/Helper/ProtectedRoute";
import ForgotPassword from "./Page/Auth/ForgotPassword";
import CheckCodeToResetPassword from "./Page/Auth/CheckCodeToResetPassword";
import ResetPassword from "./Page/Auth/ResetPassword";
import AddCard from "./Page/AddCard/AddCard";
import CheckCodeToTwoFactor from "./Page/Auth/CheckCodeToTwoFactor";
import AdminDashboard from "./Page/Admin/Dashboard/Dashboard";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TopHeaders />
        <ButtonHeaders />
        <Toaster
          position="bottom-right"
          containerStyle={{
            zIndex: 999999,
          }}
          toastOptions={{
            style: {
              background: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #c9c9c9",
              padding: "8px 10px",
              width: "fit-content",
              maxWidth: "300px",
              fontSize: "12px",
            },
          }}
        ></Toaster>

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/products" element={<Navigate to="/home" replace />} />
            <Route path="/" element={<Home></Home>}></Route>
            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/register" element={<Register></Register>}></Route>
            <Route
              path="/two-factor-auth"
              element={<CheckCodeToTwoFactor></CheckCodeToTwoFactor>}
            ></Route>
            <Route
              path="/forgot-password"
              element={<ForgotPassword></ForgotPassword>}
            ></Route>
            <Route
              path="/check-code"
              element={<CheckCodeToResetPassword></CheckCodeToResetPassword>}
            ></Route>
            <Route
              path="/reset-password"
              element={<ResetPassword></ResetPassword>}
            ></Route>
            <Route
              path="product/:id"
              element={<ProductsDetails></ProductsDetails>}
            ></Route>
            <Route
              path="/category/:category"
              element={<CategoryPage></CategoryPage>}
            ></Route>
            <Route path="/cart" element={<Cart></Cart>}></Route>
            <Route path="/contact" element={<Contact></Contact>}></Route>
            <Route
              path="/contact/succes-content"
              element={<SuccesContent></SuccesContent>}
            ></Route>
            <Route path="/search" element={<SearchPage></SearchPage>}></Route>
            <Route path="/blog" element={<Blog></Blog>}></Route>
            <Route
              path="/admin"
              element={<AdminDashboard></AdminDashboard>}
            ></Route>
            <Route path="/about" element={<About></About>}></Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/add-card" element={<AddCard></AddCard>}></Route>
              <Route path="/setting" element={<Setting></Setting>}>
                <Route index element={<Account_info />} />
                <Route path="account-info" element={<Account_info />} />
                <Route
                  path="security-password"
                  element={<SecurityPassword />}
                />
                <Route
                  path="addresses-shipping"
                  element={<AddressesShipping />}
                />
                <Route path="order-history" element={<OrderHistory />} />
                <Route path="report-problem" element={<ReportProblem />} />
                <Route path="terms-conditions" element={<TermsConditions />} />
              </Route>
            </Route>
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </div>
  );
}

export default App;
