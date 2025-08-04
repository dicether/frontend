declare module "eth-sig-util" {
    type Data = {type: string; name: string; value: any}[];

    export function signTypedData(privateKey: Buffer, msgParams: {data: Data}): string;

    interface Recover {
        data: Data;
        sig: string;
    }
    export function recoverTypedSignature(rec: Recover): string;
}

declare module "raven-for-redux" {
    export default function createRavenMiddleware(raven: any, options: Record<string, any>): any;
}

declare module "*.scss" {
    const classes: Record<string, string>;
    export = classes;
}

declare module "*.svg" {
    const component: any;
    export default component;
}

declare module "*.wav" {
    const component: any;
    export default component;
}
