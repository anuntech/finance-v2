"use client";

import { TransactionsTable } from "./_components/TransactionsTable";

export default function TransactionsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Transações</h1>
      <TransactionsTable />
    </div>
  );
}