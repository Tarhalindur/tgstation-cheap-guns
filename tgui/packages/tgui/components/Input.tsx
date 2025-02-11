/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { KEY } from 'common/keys';
import { classes } from 'common/react';
import { KeyboardEvent, SyntheticEvent, useEffect, useRef } from 'react';

import { Box, BoxProps } from './Box';

type Props = Partial<{
  autoFocus: boolean;
  autoSelect: boolean;
  className: string;
  fluid: boolean;
  maxLength: number;
  monospace: boolean;
  // Fires when: Value changes
  onChange: (event: SyntheticEvent<HTMLInputElement>, value: string) => void;
  // Fires when: Pressed enter without shift
  onEnter: (event: SyntheticEvent<HTMLInputElement>, value: string) => void;
  // Fires when: Pressed escape
  onEscape: (event: SyntheticEvent<HTMLInputElement>) => void;
  placeholder: string;
  selfClear: boolean;
  value: string | number;
}> &
  BoxProps;

export const toInputValue = (value: string | number | undefined) =>
  typeof value !== 'number' && typeof value !== 'string' ? '' : String(value);

export const Input = (props: Props) => {
  const {
    autoFocus,
    autoSelect,
    maxLength,
    onChange,
    onEnter,
    onEscape,
    onInput,
    placeholder,
    selfClear,
    value,
    ...boxProps
  } = props;
  const { className, fluid, monospace, ...rest } = boxProps;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === KEY.Enter) {
      onEnter?.(event, event.currentTarget.value);
      if (selfClear) {
        event.currentTarget.value = '';
      } else {
        event.currentTarget.blur();
      }

      return;
    }

    if (event.key === KEY.Escape) {
      onEscape?.(event);

      event.currentTarget.value = toInputValue(value);
      event.currentTarget.blur();

      return;
    }
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    input.value = toInputValue(value);
    if (autoFocus || autoSelect) {
      setTimeout(() => {
        input.focus();

        if (autoSelect) {
          input.select();
        }
      }, 1);
    }
  }, []);

  return (
    <Box
      className={classes([
        'Input',
        fluid && 'Input--fluid',
        monospace && 'Input--monospace',
        className,
      ])}
      {...rest}
    >
      <div className="Input__baseline">.</div>
      <input
        className="Input__input"
        maxLength={maxLength}
        onChange={(event) => onChange?.(event, event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        ref={inputRef}
      />
    </Box>
  );
};
