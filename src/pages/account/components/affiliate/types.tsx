export interface Campaign {
    id: number;
    name: string;
    balances: Record<number, number>;
    hits: number;
    referred: number;
    commission: number;
}
