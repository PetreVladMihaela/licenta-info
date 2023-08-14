import { UserProfile } from "./user-profile"

export interface BandMembersSurvey {
    country: string
    city: string
    street?: string

    minAge: number
    maxAge: number
    occupation?: string

    canSing: boolean
    playedInstrument?: string
    preferredMusicGenre?: string

    trait1?: string
    trait2?: string
};

export interface SurveyResult {
    matchedUserId: string
    matchedUserProfile: UserProfile
    matchType: string
}

export interface SurveyFormData {
    bandId: string
    username: string
};