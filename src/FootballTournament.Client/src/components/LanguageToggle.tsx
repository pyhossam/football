import { IconButton, Tooltip } from '@mui/material';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../store/languageStore';

export function LanguageToggle() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const nextLanguage = language === 'ar' ? 'en' : 'ar';

  return (
    <Tooltip title={t('switchLanguage')}>
      <IconButton
        aria-label={t('switchLanguage')}
        onClick={() => setLanguage(nextLanguage)}
        className="glass-icon-button"
      >
        <Languages size={20} />
      </IconButton>
    </Tooltip>
  );
}
