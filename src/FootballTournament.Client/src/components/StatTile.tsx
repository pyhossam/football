import { Box, Typography } from '@mui/material';
import type { LucideIcon } from 'lucide-react';

type StatTileProps = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
};

export function StatTile({ label, value, helper, icon: Icon }: StatTileProps) {
  return (
    <Box className="stat-tile">
      <Box className="stat-tile__icon">
        <Icon size={22} />
      </Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4">{value}</Typography>
      <Typography variant="body2" color="text.secondary">
        {helper}
      </Typography>
    </Box>
  );
}
