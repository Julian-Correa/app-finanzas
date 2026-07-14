import { ReceiptText } from "lucide-react";

import { PageShell } from "@/components/common/PageShell";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function TransactionsPage() {
  return (
    <PageShell
      eyebrow="Transactions"
      title="Ledger foundation"
      description="Transaction CRUD, filters, validation and recalculation hooks belong to a later phase after the schema and services are approved."
      icon={ReceiptText}
    >
      <PlaceholderCard title="Transaction table" description="Search, sort, filters, pagination and bulk actions will be added in the transactions phase." />
    </PageShell>
  );
}
