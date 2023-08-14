import { UserProfile } from "./user-profile"

export interface User {
    userId: string
    username: string
    email: string
    userRoles: string[]

    profile?: UserProfile
}