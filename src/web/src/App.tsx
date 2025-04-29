import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import { Authenticated, Roles, useRefreshSession } from "./authentication"
import Dashboard from "./components/Dashboard"
import { Layout } from "./components/Layout/Layout"
import Login, { Authenticate, ResetPassword } from "./components/Login"
import MyFiles from "./components/MyFiles"
import { Registration } from "./components/Registration/Registration.tsx"
import { SurveyPage } from "./components/Survey/Survey.tsx"
import { ErrorWrapper, NoOrganization } from "./components/Error/Error.tsx"

const approvedRoles = [Roles.ORGANISATION, Roles.TREY_BOARD, Roles.ADMIN]

const App = () => {
  useRefreshSession()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <Authenticated requiredRoles={approvedRoles} redirectUrl={"/registration"}>
              <Layout>
                <Dashboard />
              </Layout>
            </Authenticated>
          }
        />

        <Route
          path="/my-files"
          element={
            <Authenticated requiredRoles={approvedRoles} redirectUrl={"/registration"}>
              <Layout>
                <MyFiles />
              </Layout>
            </Authenticated>
          }
        />
        <Route
          path="/survey/:surveyId"
          element={
            <Authenticated requiredRoles={approvedRoles} redirectUrl={"/registration"}>
              <Layout>
                <SurveyPage />
              </Layout>
            </Authenticated>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Login />} />

        <Route
          path="registration"
          element={
            <Authenticated requiredRoles={[Roles.NONE]} redirectUrl={"/dashboard"}>
              <Layout>
                <Registration />
              </Layout>
            </Authenticated>
          }
        />
        <Route path="/error" element={<ErrorWrapper />}>
          <Route path="no-organization" element={<NoOrganization />} />
        </Route>

        <Route
          path="*"
          element={
            <Navigate to="/" replace={true} state={{ error: "not_found" }} />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
