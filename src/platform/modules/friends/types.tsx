import {User} from "../account/types";

export interface Friend {
    user: User;
    date: string;
    online: boolean;
}
export interface FriendRequest {
    from: User;
    to: User;
    date: string;
}

export interface FriendOnlineStatus {
    address: string;
    online: boolean;
}
