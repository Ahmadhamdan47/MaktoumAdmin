import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

interface Language {
  id: number;
  code: string;
  lang: string;
}

const languages: Language[] = [
  {
    id: 1,
    code: 'eng',
    lang: 'English',
  },
  {
    id: 2,
    code: 'ban',
    lang: 'বাংলা',
  },
  {
    id: 3,
    code: 'zh',
    lang: '中文',
  },
  {
    id: 4,
    code: 'tr',
    lang: 'Türkçe',
  },
  {
    id: 5,
    code: 'nld',
    lang: 'Dutch',
  },
];

const LanguageSelect = () => {
  const [language, setLanguage] = useState(languages[0]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleFlagButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFlagMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageItemClick = (langItem: Language) => {
    setLanguage(langItem);
    handleFlagMenuClose();
  };

  return (
    <>
      <IconButton onClick={handleFlagButtonClick} size="large">
        <Typography>{language.lang}</Typography>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleFlagMenuClose}
        onClick={handleFlagMenuClose}
        sx={{
          mt: 1.5,
          '& .MuiList-root': {
            width: 230,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {languages.map((langItem) => {
          return (
            <MenuItem
              key={langItem.id}
              sx={{ bgcolor: langItem.id === language.id ? 'info.dark' : null }}
              onClick={() => handleLanguageItemClick(langItem)}
            >
              <ListItemText>
                <Typography>{langItem.lang}</Typography>
              </ListItemText>
              <ListItemText>
                <Typography textAlign="right">{langItem.code}</Typography>
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default LanguageSelect;