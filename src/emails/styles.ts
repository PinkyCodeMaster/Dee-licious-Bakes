// Shared email styles to eliminate duplication across templates
export const emailStyles = {
  // Text styles
  text: {
    color: "#333333",
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "0 0 16px 0",
  },
  
  smallText: {
    color: "#666666",
    fontSize: "14px",
    lineHeight: "1.4",
    margin: "0 0 4px 0",
  },
  
  linkText: {
    color: "#666666",
    fontSize: "14px",
    lineHeight: "1.4",
    margin: "8px 0 16px 0",
    wordBreak: "break-all" as const,
    backgroundColor: "#f5f5f5",
    padding: "8px",
    borderRadius: "4px",
  },
  
  link: {
    color: "#1e40af",
    textDecoration: "underline",
  },
  
  // Section styles
  section: {
    padding: "24px 0",
  },
  
  // Alert/notification styles
  warningText: {
    color: "#dc2626",
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "16px 0",
    backgroundColor: "#fef2f2",
    padding: "12px",
    borderRadius: "4px",
  },
  
  infoSection: {
    backgroundColor: "#f8f9fa",
    padding: "16px",
    borderRadius: "6px",
    margin: "16px 0",
  },
  
  // Specific alert types
  confirmationSection: {
    backgroundColor: "#f0f9ff",
    border: "2px solid #bae6fd",
    padding: "16px",
    borderRadius: "6px",
    margin: "16px 0",
  },
  
  retentionSection: {
    backgroundColor: "#fffbeb",
    border: "1px solid #fed7aa",
    padding: "16px",
    borderRadius: "6px",
    margin: "16px 0",
  },
  
  supportSection: {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    padding: "16px",
    borderRadius: "6px",
    margin: "16px 0",
  },
  
  // Title styles
  sectionTitle: {
    color: "#333333",
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "24px 0 8px 0",
    fontWeight: "600",
  },
  
  confirmationTitle: {
    color: "#1e40af",
    fontSize: "18px",
    lineHeight: "1.4",
    margin: "0 0 12px 0",
  },
  
  // Bullet text
  bulletText: {
    color: "#1e40af",
    fontSize: "14px",
    lineHeight: "1.4",
    margin: "0 0 4px 0",
    paddingLeft: "8px",
  },
} as const;