declare module 'react-syntax-highlighter' {
    import { Component } from 'react';

    export interface SyntaxHighlighterProps {
        language?: string;
        style?: object;
        children?: string;
        showLineNumbers?: boolean;
        wrapLines?: boolean;
        lineProps?: object | ((lineNumber: number) => object);
    }

    export class Light extends Component<SyntaxHighlighterProps> {}
    export class Prism extends Component<SyntaxHighlighterProps> {}
}

declare module 'react-syntax-highlighter/dist/esm/styles/hljs' {
    export const docco: object;
    export const atomOneDark: object;
}

declare module 'react-syntax-highlighter/dist/esm/languages/hljs/python' {
    const python: any;
    export default python;
}
