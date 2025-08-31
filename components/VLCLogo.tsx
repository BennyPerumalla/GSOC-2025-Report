import React from "react";
import styles from "./VLCLogo.module.css";

interface VLCLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const VLCLogo: React.FC<VLCLogoProps> = ({ 
  size = "md", 
  className 
}) => {
  return (
    <div className={`${styles.vlcLogo} ${styles[size]} ${className || ""}`}>
      <img
        src="https://assets.floot.app/10659a76-df27-42f7-82d3-f6600928fb02/c77f672d-462e-4609-b03b-8b70cd76d09c.png"
        alt="VLC Media Player Logo"
        className={styles.logoImage}
      />
    </div>
  );
};