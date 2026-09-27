import { cache } from 'react';
import type { Metadata } from 'next';

import { getSoroWillClient } from '@/lib/sorowill';
import { formatTokenBalance } from '@/lib/tokenDecimals';
import InheritPageClient from './InheritPageClient';

/**
 * Memoize getWill per request so generateMetadata and the page body
 * both hit the same cached result instead of making two separate RPC calls.
 */
const getWillCached = cache(async (id: string) => {
  return getSoroWillClient().getWill(id);
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  let title = 'Inheritance';
  let description = 'Claim your inheritance from a SoroWill.';
  const { id } = await params;

  try {
    const will = await getWillCached(id);
    title = `Inheritance — Will #${will.id}`;
    // Use formatTokenBalance so the balance reflects the token's real decimal
    // precision instead of always dividing by 1_000_000 (6 decimals / USDC).
    const balanceStr = formatTokenBalance(will.balance, will.token ?? '');
    description = `Claim your inheritance from Will #${will.id}. Status: ${will.status}. Locked balance: ${balanceStr}. ${will.beneficiaries.length} beneficiar${will.beneficiaries.length === 1 ? 'y' : 'ies'}.`;
  } catch {
    // Graceful fallback — if the will fetch fails, keep generic metadata.
  }

  return { title, description };
}

export default async function InheritPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InheritPageClient id={id} />;
}
