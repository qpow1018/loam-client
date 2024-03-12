import { ButtonBase } from '@mui/material';

export default function LoadoMenuButton(
  props: {
    children: React.ReactNode;


  }
) {
  return (
    <ButtonBase
    
    
    >
      { props.children }
    </ButtonBase>
  );
}