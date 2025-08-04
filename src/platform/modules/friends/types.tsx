import {User} from "../account/types";

export interface Friend {
    user: User;
    date: Date;
    online: boolean;
}
export interface FriendRequest {
    from: User;
    to: User;
    date: Date;
}

export interface FriendOnlineStatus {
    address: string;
    online: boolean;
}
