declare function reactStringReplace<T>(
    str: string | Array<T | string>,
    regex: RegExp,
    callBack: (str: string, idx: number) => T
): Array<T | string>;

export default reactStringReplace;
