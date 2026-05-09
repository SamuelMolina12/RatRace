export interface CreateChallengeDto {
    challengedId: string;
    raceType: string;
    agreedLocation?: string;
    agreedDate?: string;
    notes?: string;
}