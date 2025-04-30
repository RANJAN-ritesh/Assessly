declare module 'pdfkit' {
  import { Stream } from 'stream';

  class PDFDocument extends Stream {
    constructor(options?: PDFKit.PDFDocumentOptions);
    pipe(destination: NodeJS.WritableStream, options?: { end?: boolean }): NodeJS.WritableStream;
    fontSize(size: number): this;
    font(name: string, size?: number): this;
    text(text: string, options?: PDFKit.Mixins.TextOptions): this;
    text(text: string, x?: number, y?: number, options?: PDFKit.Mixins.TextOptions): this;
    moveDown(line?: number): this;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    stroke(): this;
    end(): void;
  }

  namespace PDFKit {
    interface PDFDocumentOptions {
      size?: string | [number, number];
      margin?: number;
      bufferPages?: boolean;
      autoFirstPage?: boolean;
      compress?: boolean;
    }

    namespace Mixins {
      interface TextOptions {
        align?: 'left' | 'center' | 'right' | 'justify';
        width?: number;
        height?: number;
        ellipsis?: boolean | string;
        columns?: number;
        columnGap?: number;
        indent?: number;
        paragraphGap?: number;
        lineGap?: number;
        wordSpacing?: number;
        characterSpacing?: number;
        fill?: boolean;
        stroke?: boolean;
        underline?: boolean;
        strike?: boolean;
        continued?: boolean;
        link?: string;
      }
    }
  }

  export = PDFDocument;
} 