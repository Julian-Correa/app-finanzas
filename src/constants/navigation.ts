import {
  BadgeDollarSign,
  BarChart3,
  CalendarDays,
  CreditCard,
  Gauge,
  History,
  LayoutDashboard,
  LayoutGrid,
  MoreHorizontal,
  PiggyBank,
  ReceiptText,
  Settings,
  ShieldQuestion,
  Target,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import type { AppLanguage } from "@/app/providers/LanguageProvider";

export interface NavigationItem {
  labels: Record<AppLanguage, string>;
  path: string;
  icon: LucideIcon;
}

export const primaryNavigation: NavigationItem[] = [
  { labels: { es: "Panel", en: "Dashboard" }, path: "/", icon: LayoutDashboard },
  { labels: { es: "Transacciones", en: "Transactions" }, path: "/transactions", icon: ReceiptText },
  { labels: { es: "Presupuestos", en: "Budgets" }, path: "/budgets", icon: WalletCards },
  { labels: { es: "Deudas", en: "Debts" }, path: "/debts", icon: CreditCard },
  { labels: { es: "Metas", en: "Goals" }, path: "/goals", icon: Target },
  { labels: { es: "Reportes", en: "Reports" }, path: "/reports", icon: BarChart3 },
];

export const secondaryNavigation: NavigationItem[] = [
  { labels: { es: "Timeline", en: "Timeline" }, path: "/timeline", icon: Gauge },
  { labels: { es: "Calendario", en: "Calendar" }, path: "/calendar", icon: CalendarDays },
  { labels: { es: "Simulador", en: "Simulator" }, path: "/simulator", icon: PiggyBank },
  { labels: { es: "¿Puedo comprarlo?", en: "Can I Buy This?" }, path: "/purchase-advisor", icon: ShieldQuestion },
  { labels: { es: "Historial", en: "History" }, path: "/history", icon: History },
  { labels: { es: "Ajustes", en: "Settings" }, path: "/settings", icon: Settings },
];

export const mobileNavigation: NavigationItem[] = [
  { labels: { es: "Inicio", en: "Home" }, path: "/", icon: LayoutDashboard },
  { labels: { es: "Movs", en: "Txns" }, path: "/transactions", icon: ReceiptText },
  { labels: { es: "Metas", en: "Goals" }, path: "/goals", icon: Target },
  { labels: { es: "Reportes", en: "Reports" }, path: "/reports", icon: BarChart3 },
  { labels: { es: "Menú", en: "Menu" }, path: "#menu", icon: LayoutGrid },
];
