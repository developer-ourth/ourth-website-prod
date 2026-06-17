export type UserRole =
  | "founder"
  | "vendor"
  | "consumer"
  | "operations"
  | "waste_management"
  | "finance"
  | "admin"
  | "marketing"
  | "developer";

export interface RoleConfig {
  role: UserRole;
  label: string;
  description: string;
  dashboardPath: string;
  color: string;
  emoji: string;
}

export const ROLES: RoleConfig[] = [
  {
    role: "founder",
    label: "Founder / CXO",
    description: "Revenue, burn rate, runway, city performance",
    dashboardPath: "/dashboards/founder",
    color: "bg-purple-600",
    emoji: "🚀",
  },
  {
    role: "vendor",
    label: "Vendor / Hawker",
    description: "Orders, earnings, catalog, inventory",
    dashboardPath: "/dashboards/vendor",
    color: "bg-orange-500",
    emoji: "🛒",
  },
  {
    role: "consumer",
    label: "Consumer",
    description: "Eco-scores, rewards, subscriptions, nearby vendors",
    dashboardPath: "/dashboards/consumer",
    color: "bg-green-600",
    emoji: "🌿",
  },
  {
    role: "operations",
    label: "Operations & Logistics",
    description: "Dispatch, routes, SLA, warehouse inventory",
    dashboardPath: "/dashboards/operations",
    color: "bg-blue-600",
    emoji: "🚚",
  },
  {
    role: "waste_management",
    label: "Waste Management",
    description: "QR dustbins, segregation, recycling, impact",
    dashboardPath: "/dashboards/waste-management",
    color: "bg-teal-600",
    emoji: "♻️",
  },
  {
    role: "finance",
    label: "Finance & Investor",
    description: "Revenue streams, CAC/LTV, burn, ESG metrics",
    dashboardPath: "/dashboards/finance",
    color: "bg-yellow-600",
    emoji: "💰",
  },
  {
    role: "admin",
    label: "Admin / Control Panel",
    description: "User management, campaigns, city expansion, alerts",
    dashboardPath: "/dashboards/admin",
    color: "bg-red-600",
    emoji: "⚙️",
  },
  {
    role: "marketing",
    label: "Marketing & Growth",
    description: "Campaign performance, referrals, geo insights",
    dashboardPath: "/dashboards/marketing",
    color: "bg-pink-600",
    emoji: "📣",
  },
  {
    role: "developer",
    label: "Developer",
    description: "Website content editor, live preview and changes",
    dashboardPath: "/dashboards/developer",
    color: "bg-teal-700",
    emoji: "💻",
  },
];

export function getRoleConfig(role: UserRole): RoleConfig | undefined {
  return ROLES.find((r) => r.role === role);
}
