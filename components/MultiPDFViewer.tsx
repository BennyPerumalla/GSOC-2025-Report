import React, { useState } from "react";
import { PDFViewer } from "./PDFViewer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { Badge } from "./Badge";
import { FileText, Download } from "lucide-react";
import { Button } from "./Button";
import styles from "./MultiPDFViewer.module.css";
import { pdfjs } from 'react-pdf';

// Configure PDF.js worker for Vite (bundled from pdfjs-dist)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();
interface PDFDocument {
  id: string;
  title: string;
  viewerUrl: string;
  downloadUrl?: string;
  description?: string;
  status?: "current" | "future" | "completed";
}

interface MultiPDFViewerProps {
  documents?: PDFDocument[];
  defaultDocument?: string;
  className?: string;
}

const defaultDocuments: PDFDocument[] = [
  {
    id: "gsoc-2025-final-report",
    title: "A_Guide_to_Spatializer_and_Reverb_Settings",
    viewerUrl: `${import.meta.env.BASE_URL}pdfs/A_Guide_to_Spatializer_and_Reverb_Settings.pdf`,
    downloadUrl: "https://code.videolan.org/-/project/4839/uploads/d6a6450ccbfa96e843c1e40482c738a0/A_Guide_to_Spatializer_and_Reverb_Settings.pdf",
    description: " a user-friendly preset system to the Audio Spatializer filter",
    status: "completed"
  },
  {
    id: "drc-module-doc",
    title: "Dynamic_Range_Compressor_Module_Documentation",
    viewerUrl: `${import.meta.env.BASE_URL}pdfs/Dynamic_Range_Compressor_Module_Documentation.pdf`,
    downloadUrl: "https://code.videolan.org/-/project/4839/uploads/e8d456187ea2162a5a20c7d9038b45b2/Dynamic_Range_Compressor_Module_Documentation.pdf",
    description: "Dynamic Range Compressor module documentation",
    status: "current"
  },
  {
    id: "gsoc-2025-weekly-reports",
    title: "GSoC_Dynaudnorm_Audio_Filter_Report",
    viewerUrl: `${import.meta.env.BASE_URL}pdfs/GSoC_Dynaudnorm_Audio_Filter_Report.pdf`,
    downloadUrl: "https://code.videolan.org/-/project/4839/uploads/8a6c5566163c6a1a1da5f083e067c1cd/GSoC_Dynaudnorm_Audio_Filter_Report.pdf",
    description: "A new audio filter plugin that integrates FFmpeg's dynaudnorm",
    status: "current"
  },
  {
    id: "vlc-architecture-analysis",
    title: "Documentation_for_Creating_and_Using_Audio_Filters_in_VLC",
    viewerUrl: `${import.meta.env.BASE_URL}pdfs/Documentation_for_Creating_and_Using_Audio_Filters_in_VLC.pdf`,
    downloadUrl: "https://code.videolan.org/-/project/4839/uploads/4c8a1bed9519814d214b8c721638b481/Documentation_for_Creating_and_Using_Audio_Filters_in_VLC.pdf",
    description: "Technical deep-dive into VLC's modular architecture and audio pipeline",
    status: "current"
  }
];

const statusVariants = {
  current: "default" as const,
  future: "secondary" as const,
  completed: "outline" as const
};

export const MultiPDFViewer: React.FC<MultiPDFViewerProps> = ({
  documents = defaultDocuments,
  defaultDocument,
  className
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(
    defaultDocument || documents[0]?.id || ""
  );

  const selectedDocument = documents.find(doc => doc.id === selectedDocId);

  if (!selectedDocument) {
    return (
      <div className={styles.errorState}>
        <FileText size={48} />
        <p>No documents available</p>
      </div>
    );
  }

  return (
    <div className={`${styles.multiPdfViewer} ${className || ""}`}>
      <div className={styles.controlsContainer}>
        <div className={styles.documentSelector}>
          <label className={styles.selectorLabel}>
            <FileText size={16} />
            Select Document:
          </label>
          <Select value={selectedDocId} onValueChange={setSelectedDocId}>
            <SelectTrigger className={styles.documentTrigger}>
              <SelectValue placeholder="Choose a document..." />
            </SelectTrigger>
            <SelectContent>
              {documents.map((doc) => (
                <SelectItem key={doc.id} value={doc.id}>
                  <div className={styles.documentOption}>
                    <div className={styles.documentHeader}>
                      <div className={styles.documentTitle}>{doc.title}</div>
                      {doc.status && (
                        <Badge variant={statusVariants[doc.status]} className={styles.statusBadge}>
                          {doc.status}
                        </Badge>
                      )}
                    </div>
                    {doc.description && (
                      <div className={styles.documentDescription}>
                        {doc.description}
                      </div>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          size="md"
          asChild
          className={styles.downloadButton}
        >
          <a
            href={selectedDocument.downloadUrl || selectedDocument.viewerUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={16} />
            Download PDF
          </a>
        </Button>
      </div>

      <div className={styles.documentInfo}>
        <div className={styles.documentMeta}>
          <h3 className={styles.currentDocTitle}>{selectedDocument.title}</h3>
          <div className={styles.metaRow}>
            <Badge variant={statusVariants[selectedDocument.status || "current"]}>
              {selectedDocument.status || "current"}
            </Badge>
          </div>
        </div>
        {selectedDocument.description && (
          <p className={styles.currentDocDescription}>{selectedDocument.description}</p>
        )}
      </div>

      <PDFViewer
        file={selectedDocument.viewerUrl}
        title={selectedDocument.title}
        showDownload={false}
        className={styles.pdfViewer}
      />
    </div>
  );
};