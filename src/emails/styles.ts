// Shared email styles with bakery theme to eliminate duplication across templates
export const emailStyles = {
  // Text styles
  text: {
    color: "#5d4037",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 16px 0",
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
  
  smallText: {
    color: "#8d6e63",
    fontSize: "14px",
    lineHeight: "1.5",
    margin: "0 0 6px 0",
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
  
  linkText: {
    color: "#8d6e63",
    fontSize: "14px",
    lineHeight: "1.4",
    margin: "8px 0 16px 0",
    wordBreak: "break-all" as const,
    backgroundColor: "#fdf6e3",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #f4a261",
  },
  
  link: {
    color: "#d2691e",
    textDecoration: "underline",
  },
  
  // Section styles
  section: {
    padding: "24px 0",
  },
  
  // Alert/notification styles
  warningText: {
    color: "#d32f2f",
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "16px 0",
    backgroundColor: "#ffebee",
    padding: "14px",
    borderRadius: "6px",
    border: "1px solid #ffcdd2",
  },
  
  infoSection: {
    backgroundColor: "#fdf6e3",
    padding: "18px",
    borderRadius: "8px",
    margin: "16px 0",
    border: "1px solid #f4a261",
  },
  
  // Specific alert types
  confirmationSection: {
    backgroundColor: "#e8f5e8",
    border: "2px solid #a5d6a7",
    padding: "16px",
    borderRadius: "8px",
    margin: "16px 0",
  },
  
  retentionSection: {
    backgroundColor: "#fff8e1",
    border: "1px solid #ffcc02",
    padding: "16px",
    borderRadius: "8px",
    margin: "16px 0",
  },
  
  supportSection: {
    backgroundColor: "#fdf6e3",
    border: "1px solid #f4a261",
    padding: "16px",
    borderRadius: "8px",
    margin: "16px 0",
  },
  
  // Title styles
  sectionTitle: {
    color: "#8b4513",
    fontSize: "18px",
    lineHeight: "1.4",
    margin: "24px 0 12px 0",
    fontWeight: "600",
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
  
  confirmationTitle: {
    color: "#8b4513",
    fontSize: "20px",
    lineHeight: "1.3",
    margin: "0 0 12px 0",
    fontWeight: "700",
  },
  
  // Bullet text
  bulletText: {
    color: "#d2691e",
    fontSize: "14px",
    lineHeight: "1.5",
    margin: "0 0 6px 0",
    paddingLeft: "12px",
  },
  
  // Bakery-specific styles
  welcomeText: {
    color: "#8b4513",
    fontSize: "18px",
    lineHeight: "1.5",
    margin: "0 0 20px 0",
    fontWeight: "500",
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
  
  signatureText: {
    color: "#d2691e",
    fontSize: "16px",
    lineHeight: "1.4",
    margin: "20px 0 0 0",
    fontStyle: "italic",
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
} as const;