// Enum containing roles for the application. No role means there is a user but no registration has been done.
export enum Roles {
    PENDING_APPROVAL = "pending_approval", // User has registered but is pending approval
    ORGANISATION = "organisation",
    TREY_BOARD = "trey_board",
    ADMIN = "admin",
    NONE = "none", // User has not registered yet
}