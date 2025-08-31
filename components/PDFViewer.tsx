import React, { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Download 
} from "lucide-react";
import styles from "./PDFViewer.module.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: string | File;
  title?: string;
  showDownload?: boolean;
  className?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  title = "Document",
  showDownload = true,
  className
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF loading error:', error);
    setError('Failed to load PDF document');
    setIsLoading(false);
  }, []);

  const goToPrevPage = useCallback(() => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  }, [numPages]);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.2, 2.0));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1.0);
  }, []);

  const handleDownload = useCallback(() => {
    if (typeof file === 'string') {
      const link = document.createElement('a');
      link.href = file;
      link.download = title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [file, title]);

  return (
    <div className={`${styles.pdfViewer} ${className || ""}`}>
      <div className={styles.pdfHeader}>
        <span className={styles.title}>{title}</span>
        <div className={styles.controls}>
          {showDownload && (
            <Button variant="ghost" size="icon-sm" onClick={handleDownload}>
              <Download size={16} />
            </Button>
          )}
        </div>
      </div>

      {error ? (
        <div className={styles.errorState}>
          <p>Failed to load PDF document</p>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      ) : (
        <>
          <div className={styles.toolbar}>
            <div className={styles.navigationControls}>
              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft size={16} />
              </Button>
              
              <span className={styles.pageInfo}>
                {isLoading ? (
                  <Skeleton style={{ width: "60px", height: "1rem" }} />
                ) : (
                  `${pageNumber} / ${numPages || 0}`
                )}
              </span>
              
              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={goToNextPage}
                disabled={pageNumber >= (numPages || 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>

            <div className={styles.zoomControls}>
              <Button variant="ghost" size="icon-sm" onClick={zoomOut}>
                <ZoomOut size={16} />
              </Button>
              
              <span className={styles.zoomInfo}>
                {Math.round(scale * 100)}%
              </span>
              
              <Button variant="ghost" size="icon-sm" onClick={zoomIn}>
                <ZoomIn size={16} />
              </Button>
              
              <Button variant="ghost" size="icon-sm" onClick={resetZoom}>
                <RotateCcw size={16} />
              </Button>
            </div>
          </div>

          <div className={styles.documentContainer}>
            {isLoading && (
              <div className={styles.loadingState}>
                <Skeleton style={{ width: "100%", height: "600px" }} />
                <p>Loading document...</p>
              </div>
            )}
            
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading=""
              className={styles.document}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                className={styles.page}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                loading={
                  <Skeleton style={{ width: "100%", height: "600px" }} />
                }
              />
            </Document>
          </div>
        </>
      )}
    </div>
  );
};