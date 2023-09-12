import { UserAddress } from "./user-address"

export interface UserProfile {
    //userId: string
    username: string
    email: string
    phoneNumber?: string
    address?: UserAddress
    profileImage?: string

    firstName: string
    lastName: string
    age: number
    occupation?: string

    canSing: boolean
    playedInstrument?: string
    preferredMusicGenre?: string
    trait1?: string
    trait2?: string

    canBeEdited: boolean
    bandId?: string
    bandName?: string
}