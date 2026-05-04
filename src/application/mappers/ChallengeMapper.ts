export class ChallengeMapper {
    static toResponse(challenge: any) {
        return {
            id: challenge.id,
            challengerId: challenge.challengerId,
            challengerName: challenge.challenger?.username,
            challengedId: challenge.challengedId,
            challengedName: challenge.challenged?.username,
            raceType: challenge.raceType,
            challengerVehicleId: challenge.challengerVehicleId,
            challengerVehicleName: challenge.challengerVehicle
                ? `${challenge.challengerVehicle.brand} ${challenge.challengerVehicle.model}`
                : null,
            challengedVehicleId: challenge.challengedVehicleId,
            challengedVehicleName: challenge.challengedVehicle
                ? `${challenge.challengedVehicle.brand} ${challenge.challengedVehicle.model}`
                : null,
            status: challenge.status,
            winnerId: challenge.winnerId,
            agreedLocation: challenge.agreedLocation,
            agreedDate: challenge.agreedDate,
            notes: challenge.notes,
            createdAt: challenge.createdAt,
            updatedAt: challenge.updatedAt,
        };
    }
}