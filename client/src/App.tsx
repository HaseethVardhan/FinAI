import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import AuthRedirect from "./pages/AuthRedirect";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import IncomeSourcesPage from "./pages/UpdateIncomeSourcePage";
import ExpensesPage from "./pages/UpdateExpensesPage";
import AssetsPage from "./pages/UpdateAssetsPage";
import LiabilitiesPage from "./pages/UpdateLiabilitiesPage";
import InsurancePage from "./pages/UpdateInsurancePage";
import DependentsPage from "./pages/UpdateDependentsPage";
import FinalPage from "./pages/UpdateFinalPage";
import CompleteProfile from "./pages/CompleteProfile";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/landing" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/redirect" element={<AuthRedirect />} />
        {/*New Routes*/}
        <Route path="/profile" element={<UpdateProfilePage />} />
        <Route path="/income-sources" element={<IncomeSourcesPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/liabilities" element={<LiabilitiesPage />} />
        <Route path="/insurance" element={<InsurancePage />} />
        <Route path="/dependents" element={<DependentsPage />} />
        <Route path="/final" element={<FinalPage />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
      </Routes>
    </>
  );
}

export default App;
