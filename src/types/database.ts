export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type PublicTable<Row, Insert = Row, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: never[];
};

export type AccountType = "cash" | "bank" | "mercado_pago" | "credit_card" | "savings" | "other";
export type TransactionType = "income" | "expense";
export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly";
export type DebtPriority = "essential" | "housing" | "credit_card" | "personal_loan" | "installment_purchase" | "other";
export type DebtStatus = "active" | "completed" | "archived";
export type GoalPriority = "critical" | "high" | "medium" | "low";
export type GoalStatus = "active" | "completed" | "paused" | "archived";
export type AlertType = "budget" | "debt" | "goal" | "cashflow" | "system";
export type AlertSeverity = "info" | "warning" | "high" | "critical";
export type BudgetStatus = "on_track" | "warning" | "high" | "critical" | "exceeded";
export type ThemeMode = "system" | "light" | "dark";

export interface AuditFields {
  [key: string]: unknown;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by_profile_id: string | null;
  updated_by_profile_id: string | null;
}

type AuditInsert = Partial<AuditFields>;

export interface ProfileRow extends AuditFields {
  id: string;
  name: string;
  avatar: string | null;
  color: string;
  is_active: boolean;
}

export interface AccountRow extends AuditFields {
  id: string;
  profile_id: string;
  name: string;
  type: AccountType;
  currency: "ARS";
  initial_balance: number;
  current_balance: number;
  icon: string | null;
  color: string | null;
  is_archived: boolean;
  allow_overdraft: boolean;
}

export interface CategoryRow extends AuditFields {
  id: string;
  parent_id: string | null;
  name: string;
  type: TransactionType;
  icon: string | null;
  color: string | null;
  display_order: number;
  is_default: boolean;
}

export interface TransactionRow extends AuditFields {
  id: string;
  profile_id: string;
  account_id: string;
  category_id: string;
  amount: number;
  transaction_type: TransactionType;
  description: string;
  notes: string | null;
  date: string;
  is_recurring: boolean;
  attachment_url: string | null;
}

export interface RecurringTransactionRow extends AuditFields {
  id: string;
  transaction_id: string;
  frequency: RecurrenceFrequency;
  next_execution: string;
  enabled: boolean;
}

export interface DebtRow extends AuditFields {
  id: string;
  profile_id: string;
  name: string;
  creditor: string | null;
  original_amount: number;
  remaining_amount: number;
  installment_amount: number;
  installments_total: number;
  installments_left: number;
  interest_rate: number;
  priority: DebtPriority;
  due_day: number | null;
  status: DebtStatus;
}

export interface DebtPaymentRow extends AuditFields {
  id: string;
  debt_id: string;
  amount: number;
  date: string;
  notes: string | null;
}

export interface BudgetRow extends AuditFields {
  id: string;
  profile_id: string;
  category_id: string;
  month: number;
  year: number;
  limit_amount: number;
  spent_amount: number;
  remaining_amount: number;
  status: BudgetStatus;
}

export interface GoalRow extends AuditFields {
  id: string;
  profile_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  monthly_target: number;
  priority: GoalPriority;
  deadline: string | null;
  status: GoalStatus;
  icon: string | null;
  color: string | null;
}

export interface GoalContributionRow extends AuditFields {
  id: string;
  goal_id: string;
  amount: number;
  date: string;
  notes: string | null;
}

export interface MonthlySnapshotRow extends AuditFields {
  id: string;
  profile_id: string;
  month: number;
  year: number;
  income: number;
  expenses: number;
  cashflow: number;
  debt: number;
  savings: number;
  financial_score: number;
  json_snapshot: Json;
}

export interface AlertRow extends AuditFields {
  id: string;
  profile_id: string;
  type: AlertType;
  title: string;
  description: string | null;
  severity: AlertSeverity;
  read: boolean;
}

export interface SettingsRow extends AuditFields {
  id: string;
  theme: ThemeMode;
  language: string;
  currency: "ARS";
  default_profile: string | null;
  animations: boolean;
  notifications: boolean;
}

type WithGeneratedId<T extends { id: string }> = Omit<T, keyof AuditFields | "id"> & Partial<Pick<T, "id">> & AuditInsert;

export interface Database {
  public: {
    Tables: {
      profiles: PublicTable<ProfileRow, WithGeneratedId<ProfileRow>>;
      accounts: PublicTable<AccountRow, WithGeneratedId<AccountRow>>;
      categories: PublicTable<CategoryRow, WithGeneratedId<CategoryRow>>;
      transactions: PublicTable<TransactionRow, WithGeneratedId<TransactionRow>>;
      recurring_transactions: PublicTable<RecurringTransactionRow, WithGeneratedId<RecurringTransactionRow>>;
      debts: PublicTable<DebtRow, WithGeneratedId<DebtRow>>;
      debt_payments: PublicTable<DebtPaymentRow, WithGeneratedId<DebtPaymentRow>>;
      budgets: PublicTable<BudgetRow, WithGeneratedId<BudgetRow>>;
      goals: PublicTable<GoalRow, WithGeneratedId<GoalRow>>;
      goal_contributions: PublicTable<GoalContributionRow, WithGeneratedId<GoalContributionRow>>;
      monthly_snapshots: PublicTable<MonthlySnapshotRow, WithGeneratedId<MonthlySnapshotRow>>;
      alerts: PublicTable<AlertRow, WithGeneratedId<AlertRow>>;
      settings: PublicTable<SettingsRow, WithGeneratedId<SettingsRow>>;
    };
    Views: {
      dashboard_overview: {
        Row: {
          profile_id: string | null;
          profile_name: string | null;
          dashboard: Json | null;
        };
        Relationships: never[];
      };
      monthly_summary: {
        Row: {
          profile_id: string | null;
          month: number | null;
          year: number | null;
          income: number | null;
          expenses: number | null;
          cashflow: number | null;
        };
        Relationships: never[];
      };
    };
    Functions: {
      calculate_financial_score: {
        Args: { p_profile_id: string; p_month: number; p_year: number };
        Returns: number;
      };
      generate_dashboard: {
        Args: { p_profile_id: string; p_month: number; p_year: number };
        Returns: Json;
      };
    };
    Enums: {
      account_type: AccountType;
      transaction_type: TransactionType;
      recurrence_frequency: RecurrenceFrequency;
      debt_priority: DebtPriority;
      debt_status: DebtStatus;
      goal_priority: GoalPriority;
      goal_status: GoalStatus;
      alert_type: AlertType;
      alert_severity: AlertSeverity;
      budget_status: BudgetStatus;
      theme_mode: ThemeMode;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type Inserts<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type Updates<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];
