import { UserProfile } from "./user-profile"
import { BandHQ } from "./bandHQ"

export interface MusicalBand {
    bandId: string
    name: string
    musicGenre?: string
    dateFormed: Date
    isComplete: boolean
    members: UserProfile[]
    hq?: BandHQ
    //creatorUsername: string
}

export interface BandFormData {
    username: string
    formData?: MusicalBand
};