import { RouterProvider, createBrowserRouter } from "react-router-dom"
import "./App.css"
import { ProtectedRoute, GuestRoute } from "./api/router"
import Dashboard from "./components/Dashboard"
import { Layout } from "./components/Layout/Layout"
import Login from "./components/Login"

interface IProtectedRoutePage {
  component: () => JSX.Element
}

const ProtectedRoutePage: React.FC<IProtectedRoutePage> = ({ component }) => {
  return (
    <Layout>
      <ProtectedRoute component={component} />
    </Layout>
  )
}

const router = createBrowserRouter([
  {
    id: "App",
    path: "/",
    children: [
      {
        index: true,
        Component: () => <ProtectedRoutePage component={Dashboard} />,
      },
      {
        path: "/login",
        element: <GuestRoute component={Login} />,
      },
      {
        path: "/dashboard",
        element: <ProtectedRoutePage component={Dashboard} />,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
