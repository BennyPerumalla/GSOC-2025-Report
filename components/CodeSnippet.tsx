import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { Button } from "./Button";
import { Check, Copy } from "lucide-react";
import styles from "./CodeSnippet.module.css";

interface CodeSnippetProps {
  code: string;
  language: string;
  className?: string;
}

export const CodeSnippet = ({
  code,
  language,
  className,
}: CodeSnippetProps) => {
  const [hasCopied, setHasCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code.trim()).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <div className={styles.header}>
        <span className={styles.language}>{language}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={copyToClipboard}
              aria-label="Copy code"
            >
              {hasCopied ? (
                <Check size={14} className={styles.checkIcon} />
              ) : (
                <Copy size={14} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{hasCopied ? "Copied!" : "Copy to clipboard"}</TooltipContent>
        </Tooltip>
      </div>
      <pre className={styles.pre}>
        <code className={styles.code}>{code.trim()}</code>
      </pre>
    </div>
  );
};