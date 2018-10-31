declare function reactStringReplace<T>(
    str: string | Array<T | string>,
    regex: RegExp,
    callBack: (str: string, idx: number, offset: number) => T | Array<T | string>
): Array<T | string>;

export default reactStringReplace;
