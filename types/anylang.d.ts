declare module 'anylang' {
    export function detect(text: string): Promise<string>;
    export function translate(text: string, to: string | { to: string }): Promise<string>;
    const _default: { detect: typeof detect; translate: typeof translate };
    export default _default;
}
