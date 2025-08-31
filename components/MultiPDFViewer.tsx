import React, { useState } from "react";
import { PDFViewer } from "./PDFViewer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { Badge } from "./Badge";
import { FileText, Download } from "lucide-react";
import { Button } from "./Button";
import styles from "./MultiPDFViewer.module.css";

interface PDFDocument {
  id: string;
  title: string;
  url: string;
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
    title: "GSOC 2025 - Final Project Report",
    url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    description: "Complete GSOC 2025 project documentation and implementation details",
    status: "current"
  },
  {
    id: "gsoc-2025-weekly-reports",
    title: "GSOC 2025 - Weekly Progress Reports",
    url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    description: "Weekly progress updates and milestone achievements",
    status: "current"
  },
  {
    id: "vlc-architecture-analysis",
    title: "VLC Media Player Architecture Analysis",
    url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    description: "Technical deep-dive into VLC's modular architecture and audio pipeline",
    status: "current"
  },
  {
    id: "audio-filters-implementation",
    title: "Advanced Audio Filtering Implementation Guide",
    url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    description: "Detailed implementation of spatializer and reverb effects for VLC",
    status: "current"
  },
  {
    id: "gsoc-2026-proposal",
    title: "GSOC 2026 - Project Proposal",
    url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    description: "Proposed enhancements and new features for GSOC 2026",
    status: "future"
  },
  {
    id: "portfolio-overview",
    title: "Technical Portfolio Overview",
    url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
    description: "Comprehensive overview of technical projects and contributions",
    status: "completed"
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
            href={selectedDocument.url}
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
        file={selectedDocument.url}
        title={selectedDocument.title}
        showDownload={false}
        className={styles.pdfViewer}
      />
    </div>
  );
};