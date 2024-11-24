declare module "eth-sig-util" {
    type Data = Array<{type: string; name: string; value: any}>;

    export function signTypedData(privateKey: Buffer, msgParams: {data: Data}): string;

    type Recover = {data: Data; sig: string};
    export function recoverTypedSignature(rec: Recover): string;
}

declare module "raven-for-redux" {
    export default function createRavenMiddleware(raven: any, options: {[id: string]: any}): any;
}

declare module "*.scss" {
    const classes: {[key: string]: string};
    export = classes;
}

declare module "*.svg" {
    const component: any;
    export default component;
}
