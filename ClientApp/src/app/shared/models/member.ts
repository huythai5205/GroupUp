export interface Member {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    dob: Date;
    photoUrl: string;
    eventsParticipating: Map<string, Event>;
    eventsCreated: Map<string, Event>;
}

