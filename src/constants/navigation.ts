import {
  BadgeDollarSign,
  BarChart3,
  CalendarDays,
  CreditCard,
  Gauge,
  History,
  LayoutDashboard,
  PiggyBank,
  ReceiptText,
  Settings,
  ShieldQuestion,
  Target,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const primaryNavigation: NavigationItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Transactions", path: "/transactions", icon: ReceiptText },
  { label: "Budgets", path: "/budgets", icon: WalletCards },
  { label: "Debts", path: "/debts", icon: CreditCard },
  { label: "Goals", path: "/goals", icon: Target },
  { label: "Reports", path: "/reports", icon: BarChart3 },
];

export const secondaryNavigation: NavigationItem[] = [
  { label: "Timeline", path: "/timeline", icon: Gauge },
  { label: "Calendar", path: "/calendar", icon: CalendarDays },
  { label: "Simulator", path: "/simulator", icon: PiggyBank },
  { label: "Can I Buy This?", path: "/purchase-advisor", icon: ShieldQuestion },
  { label: "History", path: "/history", icon: History },
  { label: "Settings", path: "/settings", icon: Settings },
];

export const mobileNavigation: NavigationItem[] = [
  { label: "Home", path: "/", icon: LayoutDashboard },
  { label: "Txns", path: "/transactions", icon: ReceiptText },
  { label: "Goals", path: "/goals", icon: Target },
  { label: "Reports", path: "/reports", icon: BarChart3 },
  { label: "More", path: "/settings", icon: BadgeDollarSign },
];
