import { ParticipantPopulated } from "./types";


export function userIsParticipant(participants: Array<ParticipantPopulated>, userId: string): boolean {
    return !!participants.find((participant) => participant.userId === userId)
}