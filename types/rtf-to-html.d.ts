declare module "@iarna/rtf-to-html" {
  type Callback = (error: Error | null, html: string) => void;

  type Options = {
    paraBreaks?: string;
    paraTag?: string;
    disableFonts?: boolean;
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    firstLineIndent?: number;
    indent?: number;
    align?: "left" | "right" | "center" | "justify";
  };

  type RtfToHtml = {
    fromString(input: string, callback: Callback): void;
    fromString(input: string, options: Options, callback: Callback): void;
  };

  const rtfToHtml: RtfToHtml;
  export default rtfToHtml;
}
