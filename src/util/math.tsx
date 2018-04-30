export function round(x: number, n: number): number {
    return Math.round(x * Math.pow(10, n)) / Math.pow(10, n)
}

export function filterFloat(value: string): number {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
        return Number(value);
    }

    return NaN;
}
