import React from 'react';

export const ShirtIcon: React.FC<{ className?: string, color: string }> = ({ className, color }) => (
  <svg viewBox="0 0 24 24" fill={color} className={className} stroke="currentColor" strokeWidth="0.5">
    <path d="M20.38 3.46L16 2l-2.25 2.5-2.25-2.5L7 2l-4.38 1.46C2.62 3.47 2 3.5 2 4v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-.5-.62-.53-.62-.54zM12 20h-2v-7h-2v7H6V6.5l2-1.5V9h8V5l2 1.5V20h-2v-7h-2v7z"/>
  </svg>
);

export const TieIcon: React.FC<{ className?: string, color: string }> = ({ className, color }) => (
  <svg viewBox="0 0 24 24" fill={color} className={className} stroke="currentColor" strokeWidth="0.5">
    <path d="M6 2l4 4-3 11 5 5 5-5-3-11 4-4H6z"/>
  </svg>
);

export const KeychainIcon: React.FC<{ className?: string, color: string }> = ({ className, color }) => (
  <svg viewBox="0 0 24 24" fill={color} className={className} stroke="currentColor" strokeWidth="0.5">
    <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
  </svg>
);