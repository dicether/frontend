export type Campaign = {
    id: number;
    name: string;
    balances: {[chainId: number]: number};
    hits: number;
    referred: number;
    commission: number;
};
