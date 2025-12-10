import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import { Authenticated, Roles } from "./authentication"
import ForgotPassword from "./components/Authentication/ForgotPassword.tsx"
import Login from "./components/Authentication/Login.tsx"
import { ResetPassword } from "./components/Authentication/ResetPassword.tsx"
import Dashboard from "./components/Dashboard"
import { ErrorWrapper, NoOrganization } from "./components/Error/Error.tsx"
import { Layout } from "./components/Layout/Layout"
import MyFiles from "./components/MyFiles"
import { OrganizationsList } from "./components/Organization/OrganizationList.tsx"
import { OrganizationPage } from "./components/Organization/OrganizationPage.tsx"
import { Registration } from "./components/Registration/Registration.tsx"
import { SurveyPage } from "./components/Survey/Survey.tsx"

const approvedRoles = [Roles.ORGANISATION, Roles.TREY_BOARD, Roles.ADMIN]

const App = () => {
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

        <Route
          path="/organizations"
          element={
            <Authenticated
              requiredRoles={[Roles.TREY_BOARD, Roles.ADMIN]}
              redirectUrl={"/dashboard"}
            >
              <Layout>
                <OrganizationsList />
              </Layout>
            </Authenticated>
          }
        />
        <Route
          path="/organizations/:orgId"
          element={
            <Authenticated requiredRoles={approvedRoles} redirectUrl={"/registration"}>
              <Layout>
                <OrganizationPage />
              </Layout>
            </Authenticated>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
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
          element={<Navigate to="/" replace={true} state={{ error: "not_found" }} />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
