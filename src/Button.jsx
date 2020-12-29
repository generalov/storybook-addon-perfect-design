import React, { memo, useCallback } from 'react';
import { useGlobals } from '@storybook/api';
import { Icons, IconButton } from '@storybook/components';
import { PARAM_KEY } from './constants';

export const Button = memo(() => {
  const [globals, updateGlobals] = useGlobals();

  const isActive = globals[PARAM_KEY] || false;

  const toggle = useCallback(
    () =>
      updateGlobals({
        [PARAM_KEY]: !isActive,
      }),
    [isActive]
  );

  return (
    <IconButton
      key="outline"
      active={isActive}
      title="Show asset preview"
      onClick={toggle}
    >
      <Icons icon="switchalt" />
    </IconButton>
  );
});