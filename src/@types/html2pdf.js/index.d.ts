declare module 'html2pdf.js' {
  /**
   * Generate a PDF from an HTML element or string using html2canvas and jsPDF.
   *
   * @param {Element|string} src The source element or HTML string.
   * @param {Object=} opt An object of optional settings: 'margin', 'filename',
   *    'image' ('type' and 'quality'), and 'html2canvas' / 'jspdf', which are
   *    sent as settings to their corresponding functions.
   */
  export default function html2pdf(src?: Element|string, opt?: any): Worker;


  export class Worker {
    from(src, type?): Worker;
    to(target): Worker;
    toContainer(): Worker;
    toCanvas(): Worker;
    set(opt): Worker;
    output(type, options, src): Promise<any>;
  }
}

