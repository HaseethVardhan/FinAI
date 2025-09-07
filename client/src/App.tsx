import {Routes, Route} from "react-router-dom"
import ProtectedRoute from "./utils/ProtectedRoute"
import Home from "./pages/Home"
import Landing from "./pages/Landing"
import Auth from "./pages/Auth"
import AuthRedirect from "./pages/AuthRedirect"

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
        <Route
         path="/landing"
         element={
          <Landing  />
         }
        />
        <Route
         path="/auth"
         element={
          <Auth  />
         }
        />
        <Route
         path="/auth/redirect"
         element={
          <AuthRedirect  />
         }
        />
      </Routes>
    </>
  )
}

export default App
