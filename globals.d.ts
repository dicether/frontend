declare module 'eth-sig-util' {
    type Data = { type: string, name: string, value: any }[];

    export function signTypedData(privateKey: Buffer, msgParams: { data: Data }): string;

    type Recover = {data: Data, sig: string};
    export function recoverTypedSignature(rec: Recover): string;
}

declare module 'raven-for-redux' {
    export default function createRavenMiddleware(raven: any): any;
}

