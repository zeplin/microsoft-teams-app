const escapeSpecialCharacters = (value: string|number): string => String(value).replace(/[\\`*_{}[\]()#+-.!]/g, "\\$&");

export const md = (strings: TemplateStringsArray, ...expressions: (string|number)[]): string => {
    const escapedExpressions = expressions.map(escapeSpecialCharacters);
    return String.raw(strings, ...escapedExpressions);
};
