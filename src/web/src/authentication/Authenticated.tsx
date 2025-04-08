import {Navigate, useLocation} from "react-router-dom";
import {ReactNode} from "react";
import {useStytchUser} from "@stytch/react";
import {Roles} from "./Roles.tsx";

interface AuthenticatedProps {
    children: ReactNode;
    requiredRoles?: string[];
    redirectUrl?: string;
}

// This component is used to protect routes that require authentication and specific roles.
export const Authenticated = ({children, requiredRoles = [], redirectUrl = "/"}: AuthenticatedProps) => {
    const location = useLocation();
    const { user } = useStytchUser();

    // If the user is not logged in, redirect to the login page.
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // The role is stored in the trusted_metadata field of the user object in Stytch.
    const role = user?.trusted_metadata.role as string ?? Roles.NONE;

    // If the user is logged in but does not have the required role, redirect to the specified URL.
    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        return <Navigate to={redirectUrl} state={{ from: location }} />;
    }

    // If the user is logged in and has the required role, render the children.
    return <>{children}</>;
}