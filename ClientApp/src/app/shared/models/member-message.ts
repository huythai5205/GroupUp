export interface MemberMessage {
    id: string;
    senderId: string;
    senderPhotoUrl: string;
    recipientId: string;
    recipientPhotoUrl: string;
    content: string;
    dateRead?: Date;
    messageSent: Date;
}