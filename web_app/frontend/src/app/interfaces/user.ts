import { UserProfile } from "./user-profile"

export interface User {
    username: string
    email: string
    userRoles: string[]

    profile?: UserProfile
}