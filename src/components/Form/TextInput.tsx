import { useState } from 'react';
import { Box, SxProps } from '@mui/material';

import theme from '@/style/theme';

export default function TextInput(
  props: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onPressEnter?: () => void;
    sx?: SxProps;
  }
) {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  function handleInputFocus() {
    setIsFocused(true);
  }

  function handleInputBlur() {
    setIsFocused(false);
  }

  function handleInputKeyup(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && props.onPressEnter !== undefined) {
      props.onPressEnter();
    }
  }

  return (
    <Box
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          borderRadius: theme.common.borderRadius,
          width: '100%',
          height: theme.size.inputHeight,
          border: `1px solid ${theme.color.border.default}`,
          color: theme.color.text.primary,
          padding: '0 12px',
          fontSize: '0.75rem',
          '& > input': {
            width: '100%',
            height: '100%',
            letterSpacing: theme.common.letterSpacing,
            fontSize: 'inherit',
            color: 'inherit',
            background: 'transparent',
            border: 'none',
            '&:focus': {
              outline: 'none'
            }
          }
        },
        isFocused === true && {
          borderColor: theme.color.border.light,
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx])
      ]}
    >
      <input
        type='text'
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyUp={(e) => handleInputKeyup(e)}
      />
    </Box>
  );
}