import { Box, Typography } from '@mui/material';
import { Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  const { t } = useTranslation();

  return (
    <Box className="brand-mark">
      <Box className="brand-mark__icon" aria-hidden="true">
        <Trophy size={compact ? 20 : 24} strokeWidth={2.4} />
      </Box>
      <Box>
        <Typography variant={compact ? 'subtitle1' : 'h6'} className="brand-mark__title">
          {t('appName')}
        </Typography>
        {!compact && (
          <Typography variant="caption" className="brand-mark__subtitle">
            {t('appSubtitle')}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
