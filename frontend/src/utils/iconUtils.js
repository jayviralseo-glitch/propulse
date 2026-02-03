import {
  FileText,
  File,
  Edit,
  MessageSquare,
  Send,
  Target,
  Lightbulb,
  Search,
  Briefcase,
  Star,
  User,
  Users,
  Settings,
  Zap,
  TrendingUp,
  Award,
  Heart,
  Shield,
  Globe,
  Code,
  HelpCircle,
  DollarSign,
  BarChart,
  Sparkles,
} from "lucide-react";

// Icon mapping for consistent usage across the app
export const iconMap = {
  FileText,
  File,
  Edit,
  MessageSquare,
  Send,
  Target,
  Lightbulb,
  Search,
  Briefcase,
  Star,
  User,
  Users,
  Settings,
  Zap,
  TrendingUp,
  Award,
  Heart,
  Shield,
  Globe,
  Code,
  HelpCircle,
  DollarSign,
  BarChart,
  Sparkles,
};

// Get icon component by name
export const getIconComponent = (iconName) => {
  return iconMap[iconName] || FileText; // Default to FileText if icon not found
};

// Get icon label for display
export const getIconLabel = (iconName) => {
  const labels = {
    FileText: "File Text",
    File: "File",
    Edit: "Edit",
    MessageSquare: "Message",
    Send: "Send",
    Target: "Target",
    Lightbulb: "Lightbulb",
    Search: "Search",
    Briefcase: "Briefcase",
    Star: "Star",
    User: "User",
    Users: "Users",
    Settings: "Settings",
    Zap: "Zap",
    TrendingUp: "Trending Up",
    Award: "Award",
    Heart: "Heart",
    Shield: "Shield",
    Globe: "Globe",
    Code: "Code",
    HelpCircle: "Help",
    DollarSign: "Dollar",
    BarChart: "Chart",
    Sparkles: "Sparkles",
  };

  return labels[iconName] || iconName;
};

// Get all available icons for selection
export const getAvailableIcons = () => {
  return Object.keys(iconMap).map((iconName) => ({
    value: iconName,
    label: getIconLabel(iconName),
    component: iconMap[iconName],
  }));
};

// Validate if an icon name is valid
export const isValidIcon = (iconName) => {
  return iconName in iconMap;
};
