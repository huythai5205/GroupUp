export interface User {
  id: string;
  email: string;
  password: string;
  token: string;
  firstName: string;
  lastName: string;
  gender: string;
  DOB: Date;
  photoUrl: string;
  eventsParticipating: Map<string, Event>;
  eventsCreated: Map<string, Event>;
}
