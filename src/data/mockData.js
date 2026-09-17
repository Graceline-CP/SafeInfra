// Your existing data
export const analysisResult = {
  infrastructure_type: "Bridge",
  damage_severity: "High",
  confidence_score: 87,
  priority: "Critical",
  image: "/sample-bridge.jpg",
  location: "East Side",
  date: "2026-05-25",
  detected_issues: ["Cracks", "Structural Damage", "Edge Collapse"],
};

export const dashboardStats = {
  critical: 12,
  high: 28,
  medium: 35,
  low: 18,
};

export const topPriorityLocations = [
  { location: "Bridge - East Side", priority: "Critical" },
  { location: "Road - Riverside", priority: "High" },
  { location: "Building - Market Area", priority: "High" },
  { location: "Bridge - Old Town", priority: "Medium" },
  { location: "Road - Hill View", priority: "Medium" },
];

export const reports = [
  {
    id: "#101",
    location: "Bridge - East Side",
    type: "Bridge",
    severity: "High",
    priority: "Critical",
    date: "25 May 2025",
  },
  {
    id: "#102",
    location: "Road - Riverside",
    type: "Road",
    severity: "High",
    priority: "High",
    date: "25 May 2025",
  },
  {
    id: "#103",
    location: "Building - Market Area",
    type: "Building",
    severity: "Medium",
    priority: "Medium",
    date: "24 May 2025",
  },
  {
    id: "#104",
    location: "Bridge - Old Town",
    type: "Bridge",
    severity: "Medium",
    priority: "Medium",
    date: "24 May 2025",
  },
  {
    id: "#105",
    location: "Road - Hill View",
    type: "Road",
    severity: "Low",
    priority: "Low",
    date: "24 May 2025",
  },
];

// Nidhi's data
export const summaryStats = {
  total: 24,
  critical: 3,
  high: 7,
  medium: 10,
  low: 4,
};

export const inspections = [
  {
    id: "INS-001",
    location: "Chennai Central Flyover",
    type: "Bridge",
    severity: "High",
    priority: "High",
    date: "2026-08-18",
  },
  // Keep the remaining Nidhi inspection objects here.
];