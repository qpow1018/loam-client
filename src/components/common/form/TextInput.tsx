import styles from './textInput.module.scss';

export default function TextInput(props: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onPressEnter?: () => void;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}) {
  const {
    value,
    onChange,
    placeholder,
    onPressEnter,
    className,
    ref,
  } = props;

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && onPressEnter !== undefined) {
      onPressEnter();
    }
  }

  return (
    <div className={`${styles['text-input']} ${className ?? ''}`}>
      <input
        ref={ref}
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyUp={handleKeyUp}
      />
    </div>
  );
}
