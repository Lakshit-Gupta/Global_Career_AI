export interface PDFExtractionResult {
  text: string;
  numPages: number;
  info: {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
  };
}

/**
 * Extract text content from a PDF buffer
 * @param pdfBuffer - Buffer containing PDF data
 * @returns Extracted text and metadata
 */
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<PDFExtractionResult> {
  try {
    // Use pdf2json - server-side only, no worker issues
    // eslint-disable-next-line
    const PDFParser = require('pdf2json');
    
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        reject(new Error(errData.parserError));
      });
      
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          // Extract text from all pages
          let fullText = '';
          if (pdfData.Pages) {
            for (const page of pdfData.Pages) {
              if (page.Texts) {
                for (const text of page.Texts) {
                  if (text.R) {
                    for (const textRun of text.R) {
                      if (textRun.T) {
                        // Decode URI-encoded text with error handling
                        try {
                          fullText += decodeURIComponent(textRun.T) + ' ';
                        } catch {
                          // If decoding fails, use the raw text
                          fullText += textRun.T.replace(/%/g, '') + ' ';
                        }
                      }
                    }
                  }
                }
                fullText += '\n';
              }
            }
          }
          
          // Extract metadata
          const meta = pdfData.Meta || {};
          
          resolve({
            text: fullText.trim(),
            numPages: pdfData.Pages?.length || 0,
            info: {
              title: meta.Title,
              author: meta.Author,
              subject: meta.Subject,
              keywords: meta.Keywords,
              creator: meta.Creator,
              producer: meta.Producer,
              creationDate: meta.CreationDate,
            },
          });
        } catch (error: any) {
          reject(new Error(`Failed to parse PDF data: ${error?.message}`));
        }
      });
      
      // Parse the buffer
      pdfParser.parseBuffer(pdfBuffer);
    });
  } catch (error: any) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Clean extracted text by removing excessive whitespace and normalizing line breaks
 * @param text - Raw extracted text
 * @returns Cleaned text
 */
export function cleanExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Reduce excessive line breaks
    .replace(/[ \t]{2,}/g, ' ') // Reduce excessive spaces
    .trim();
}
