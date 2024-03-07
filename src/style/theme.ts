const theme = {
  color: {
    primary: {
      main: '#0061b4', // rgb(0, 97, 180)
      light: 'rgba(0, 97, 180, 0.8)',
    },
    secondary: {
      main: '#b40007', // rgb(180, 0, 7)
      light: 'rgba(180, 0, 7, 0.8)',
    },
    dark: {
      gray1: '#1f1f1f',
      gray2: '#292929',
      gray3: '#3c3c3c',
      gray4: '#464646',
      gray5: '#505050',
    },
    background: {
      default: '#292929',
      base: '#1f1f1f',
      overlay: 'rgba(0, 0, 0, 0.4)',
    },
    text: {
      primary: '#f1f1f1',
      secondary: '#aaa',
    },
    border: {
      default: '#505050',
      light: '#818181',
      dark: '#3c3c3c',
    },
  },
  size: {
    headerHeight: 56,
    buttonHeight: 36,
    inputHeight: 36,
    modalHeaderHeight: 48,
  },
  common: {
    fontFamily: `'Noto Sans KR', sans-serif`,
    letterSpacing: '-0.3px',
    borderRadius: '4px',
    transition: '0.25s ease',
  },
  zIndex: {
    fixedLoading: 5000,
  },
}

export default theme;