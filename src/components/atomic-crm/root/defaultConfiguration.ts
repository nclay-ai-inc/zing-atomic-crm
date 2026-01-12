import { Mars, NonBinary, Venus } from "lucide-react";

export const defaultDarkModeLogo = "./logos/zing-logo.png";
export const defaultLightModeLogo = "./logos/zing-logo.png";

export const defaultTitle = "ZingIQ";

export const defaultCompanySectors = [
  "Communication Services",
  "Consumer Discretionary",
  "Consumer Staples",
  "Energy",
  "Financials",
  "Health Care",
  "Industrials",
  "Information Technology",
  "Materials",
  "Real Estate",
  "Utilities",
];

export const defaultDealStages = [
  { value: "opportunity", label: "Opportunity" },
  { value: "proposal-sent", label: "Proposal Sent" },
  { value: "in-negociation", label: "In Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "delayed", label: "Delayed" },
];

export const defaultDealPipelineStatuses = ["won"];

export const defaultDealCategories = [
  "Other",
  "Copywriting",
  "Print project",
  "UI Design",
  "Website design",
];

export const defaultNoteStatuses = [
  { value: "cold", label: "Cold", color: "#00D4FF" }, // Zing Cyan
  { value: "warm", label: "Warm", color: "#6366F1" }, // Zing Purple
  { value: "hot", label: "Hot", color: "#E95614" }, // Zing Orange
  { value: "in-contract", label: "In Contract", color: "#7C3AED" }, // Zing Violet
];

export const defaultTaskTypes = [
  "None",
  "Email",
  "Demo",
  "Lunch",
  "Meeting",
  "Follow-up",
  "Thank you",
  "Ship",
  "Call",
];

export const defaultContactGender = [
  { value: "male", label: "He/Him", icon: Mars },
  { value: "female", label: "She/Her", icon: Venus },
  { value: "nonbinary", label: "They/Them", icon: NonBinary },
];
