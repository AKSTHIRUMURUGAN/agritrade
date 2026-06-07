import React from 'react';

export default function BadgeRow({ soilTest, kycVerified, documentVerified, ranking }) {
  const badges = [
    {
      id: 'soil',
      label: 'Soil Tested',
      verified: soilTest,
      icon: '🌱',
    },
    {
      id: 'kyc',
      label: 'KYC Verified',
      verified: kycVerified,
      icon: '🪪',
    },
    {
      id: 'document',
      label: 'Agreement',
      verified: documentVerified,
      icon: '📄',
    },
    {
      id: 'rank',
      label: `Rank ${ranking || 3}`,
      verified: !!ranking,
      icon: '🏅',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2" title="Verification Badges">
      {badges.map((b) => (
        <span
          key={b.id}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
            b.verified
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 shadow-sm'
              : 'bg-zinc-800/40 text-zinc-500 border border-zinc-700/20 opacity-50'
          }`}
          title={`${b.label}: ${b.verified ? 'Verified' : 'Pending'}`}
        >
          <span className="text-sm">{b.icon}</span>
          <span className="hidden sm:inline">{b.label}</span>
        </span>
      ))}
    </div>
  );
}
