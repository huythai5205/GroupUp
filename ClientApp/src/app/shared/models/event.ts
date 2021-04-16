import { Address } from './address';

export interface Event {
  id: string;
  name: string;
  spotsAvailable: number;
  numOfParticipants: number;
  description: string;
  location: Address;
  dateOfEvent: Date;
  startTime: string;
  endTime: string;
  creatorEmail: string;
  creator: any;
  usersParticipating: any;
  photos: any;
}
