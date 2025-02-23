import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import { Layout } from "./components/Layout/Layout";
import Login from "./components/Login";
import MyFiles from "./components/MyFiles";
import { Authenticated, Roles } from "./authentication";

const approvedRoles = [Roles.ORGANISATION, Roles.TREY_BOARD, Roles.ADMIN];

const App = ()=> {
    return <BrowserRouter>
            <Routes>
                <Route path="/dashboard" element={<Authenticated requiredRoles={approvedRoles} redirectUrl={"/registration"}>
                        <Layout>
                            <Dashboard/>
                        </Layout>
                    </Authenticated>}/>

                <Route path="/my-files" element={<Authenticated requiredRoles={approvedRoles} redirectUrl={"/registration"}>
                        <Layout>
                            <MyFiles/>
                        </Layout>
                    </Authenticated>}/>

                <Route path="/login" element={<Login/>}/>
            </Routes>
    </BrowserRouter>
}

export default App
