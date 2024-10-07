import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { Container } from "@radix-ui/themes"
import "./App.css"
import { ProtectedRoute, GuestRoute } from "./api/router"
import Dashboard from "./components/Dashboard"
import Login from "./components/Login"

const router = createBrowserRouter([
  {
    id: "App",
    path: "/",
    children: [
      {
        index: true,
        Component: () => <ProtectedRoute component={Dashboard} />,
      },
      {
        path: "/login",
        element: <GuestRoute component={Login} />,
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute component={Dashboard} />,
      },
    ],
  },
])

function App() {
  return (
    <Container align="center">
      <RouterProvider router={router} />
    </Container>
  )
}

export default App
