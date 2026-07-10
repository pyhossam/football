import { Chip } from '@mui/material';

type StatusPillProps = {
  label: string;
  tone?: 'success' | 'warning' | 'neutral' | 'live';
};

export function StatusPill({ label, tone = 'neutral' }: StatusPillProps) {
  return <Chip size="small" label={label} className={`status-pill status-pill--${tone}`} />;
}
