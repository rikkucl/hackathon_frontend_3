declare module 'react-copy-to-clipboard' {
    import { Component } from 'react';

    export interface CopyToClipboardProps {
        text: string;
        onCopy?: (text: string, result: boolean) => void;
        children?: React.ReactNode;
    }

    export class CopyToClipboard extends Component<CopyToClipboardProps> {}
}
