export function round(x: number, n: number): number {
    return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
}

export function filterFloat(value: string): number {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
        return Number(value);
    }

    return NaN;
}

/**
 * @param min min value inclusive
 * @param max max value exclusive
 */
export function getRandomInt(min: number, max: number) {
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function shuffle<T>(array: T[]) {
    let counter = array.length;

    // While there are elements left
    while (counter > 0) {
        // Pick a random index
        const index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        const temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
}
