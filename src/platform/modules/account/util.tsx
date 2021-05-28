export function isValidUserName(username: string): boolean {
    return username.length <= 15 && username.length >= 3 && /^[a-z0-9]+$/i.test(username);
}
