import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import { Layout } from "./components/Layout/Layout";
import Login from "./components/Login";
import MyFiles from "./components/MyFiles";
import { Authenticated, Roles } from "./authentication";
import {Registration} from "./components/Registration/Registration.tsx";

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
                <Route path="/" element={<Login/>}/>

                <Route path="registration" element={
                    <Authenticated requiredRoles={[Roles.NONE]} redirectUrl={"/registration"} >
                        <Layout>
                            <Registration />
                        </Layout>
                    </Authenticated>}>
                </Route>
            </Routes>
    </BrowserRouter>
}

export default App
