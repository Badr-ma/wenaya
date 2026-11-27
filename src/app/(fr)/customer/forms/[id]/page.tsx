import type { Metadata } from "next";
import CustomerForm from "@/components/customer-forms/CustomerForm";

export const metadata: Metadata = { robots: { index: false, follow: false } };

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ customer_id?: string | string[] }>;
};

export default async function Page({ params, searchParams }: Props) {
  const [{ id }, { customer_id }] = await Promise.all([params, searchParams]);
  const customerId = typeof customer_id === "string" ? customer_id : undefined;
  return <CustomerForm key={JSON.stringify([id, customerId])} id={id} customerId={customerId} locale="fr" />;
}
