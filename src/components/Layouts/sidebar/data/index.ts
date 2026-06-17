import * as Icons from "../icons";
import type { UserRole } from "@/lib/roles";

export type NavItem = {
  title: string;
  url?: string;
  icon?: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  items: { title: string; url: string }[];
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

const ROLE_NAV: Record<UserRole, NavSection[]> = {
  founder: [
    {
      label: "FOUNDER DASHBOARD",
      items: [
        { title: "Overview", url: "/dashboards/founder", icon: Icons.HomeIcon, items: [] },
        { title: "KPIs & Trends", url: "/dashboards/founder/kpis", icon: Icons.PieChart, items: [] },
        { title: "City Performance", url: "/dashboards/founder/cities", icon: Icons.FourCircle, items: [] },
        { title: "Alerts", url: "/dashboards/founder/alerts", icon: Icons.Table, items: [] },
        { title: "Products", url: "/dashboards/founder/products", icon: Icons.PieChart, items: [] },
        { title: "Categories", url: "/dashboards/founder/categories", icon: Icons.FourCircle, items: [] },
      ],
    },
  ],
  vendor: [
    {
      label: "VENDOR DASHBOARD",
      items: [
        { title: "Overview", url: "/dashboards/vendor", icon: Icons.HomeIcon, items: [] },
        { title: "Orders", url: "/dashboards/vendor/orders", icon: Icons.Table, items: [] },
        { title: "Earnings", url: "/dashboards/vendor/earnings", icon: Icons.PieChart, items: [] },
        { title: "Catalog / Inventory", url: "/dashboards/vendor/catalog", icon: Icons.FourCircle, items: [] },
        { title: "QR Code", url: "/dashboards/vendor/qr", icon: Icons.User, items: [] },
      ],
    },
  ],
  consumer: [
    {
      label: "CONSUMER DASHBOARD",
      items: [
        { title: "Overview", url: "/dashboards/consumer", icon: Icons.HomeIcon, items: [] },
        { title: "Eco Scores & Rewards", url: "/dashboards/consumer/rewards", icon: Icons.PieChart, items: [] },
        { title: "Subscriptions", url: "/dashboards/consumer/subscriptions", icon: Icons.Table, items: [] },
        { title: "Nearby Vendors", url: "/dashboards/consumer/nearby", icon: Icons.FourCircle, items: [] },
        { title: "Order History", url: "/dashboards/consumer/orders", icon: Icons.Calendar, items: [] },
      ],
    },
  ],
  operations: [
    {
      label: "OPERATIONS",
      items: [
        { title: "Overview", url: "/dashboards/operations", icon: Icons.HomeIcon, items: [] },
        { title: "Orders", url: "/dashboards/operations/orders", icon: Icons.Calendar, items: [] },
        { title: "Delivery Routes", url: "/dashboards/operations/routes", icon: Icons.FourCircle, items: [] },
        { title: "Warehouse Inventory", url: "/dashboards/operations/inventory", icon: Icons.Table, items: [] },
        { title: "SLA & Alerts", url: "/dashboards/operations/sla", icon: Icons.PieChart, items: [] },
        { title: "Dispatch Slips", url: "/dashboards/operations/dispatch", icon: Icons.Calendar, items: [] },
      ],
    },
  ],
  waste_management: [
    {
      label: "WASTE MANAGEMENT",
      items: [
        { title: "Overview", url: "/dashboards/waste-management", icon: Icons.HomeIcon, items: [] },
        { title: "Dustbins", url: "/dashboards/waste-management/dustbins", icon: Icons.FourCircle, items: [] },
        { title: "Collections", url: "/dashboards/waste-management/collections", icon: Icons.Table, items: [] },
        { title: "Recycling Records", url: "/dashboards/waste-management/recycling", icon: Icons.PieChart, items: [] },
        { title: "Impact Metrics", url: "/dashboards/waste-management/impact", icon: Icons.Calendar, items: [] },
      ],
    },
  ],
  finance: [
    {
      label: "FINANCE & INVESTOR",
      items: [
        { title: "Overview", url: "/dashboards/finance", icon: Icons.HomeIcon, items: [] },
        { title: "Revenue Streams", url: "/dashboards/finance/revenue", icon: Icons.PieChart, items: [] },
        { title: "Burn & Runway", url: "/dashboards/finance/burn", icon: Icons.Table, items: [] },
        { title: "CAC / LTV", url: "/dashboards/finance/cac-ltv", icon: Icons.FourCircle, items: [] },
        { title: "ESG Metrics", url: "/dashboards/finance/esg", icon: Icons.Calendar, items: [] },
        { title: "Daily Snapshots", url: "/dashboards/finance/snapshots", icon: Icons.User, items: [] },
      ],
    },
  ],
  admin: [
    {
      label: "ADMIN PANEL",
      items: [
        { title: "Overview", url: "/dashboards/admin", icon: Icons.HomeIcon, items: [] },
        { title: "User Management", url: "/dashboards/admin/users", icon: Icons.User, items: [] },
        { title: "Vendor KYC", url: "/dashboards/admin/kyc", icon: Icons.Table, items: [] },
        { title: "Orders", url: "/dashboards/admin/orders", icon: Icons.Calendar, items: [] },
        { title: "Cities & Expansion", url: "/dashboards/admin/cities", icon: Icons.FourCircle, items: [] },
        { title: "Campaigns", url: "/dashboards/admin/campaigns", icon: Icons.Calendar, items: [] },
        { title: "Alerts & System", url: "/dashboards/admin/alerts", icon: Icons.PieChart, items: [] },
        { title: "Products", url: "/dashboards/admin/products", icon: Icons.PieChart, items: [] },
        { title: "Categories", url: "/dashboards/admin/categories", icon: Icons.FourCircle, items: [] },
      ],
    },
  ],
  marketing: [
    {
      label: "MARKETING & GROWTH",
      items: [
        { title: "Overview", url: "/dashboards/marketing", icon: Icons.HomeIcon, items: [] },
        { title: "Campaigns", url: "/dashboards/marketing/campaigns", icon: Icons.Calendar, items: [] },
        { title: "Referrals", url: "/dashboards/marketing/referrals", icon: Icons.User, items: [] },
        { title: "Geo Growth", url: "/dashboards/marketing/geo", icon: Icons.FourCircle, items: [] },
        { title: "Vendor Acquisition", url: "/dashboards/marketing/acquisition", icon: Icons.PieChart, items: [] },
      ],
    },
  ],
  developer: [
    {
      label: "DEVELOPER CONTROLS",
      items: [
        { title: "Overview / Editor", url: "/dashboards/developer", icon: Icons.HomeIcon, items: [] },
      ],
    },
  ],
};

export function getNavForRole(role: UserRole): NavSection[] {
  return ROLE_NAV[role] ?? [];
}

// Legacy fallback
export const NAV_DATA = ROLE_NAV.admin;
