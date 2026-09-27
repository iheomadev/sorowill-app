'use client';

import { useEffect, useRef } from 'react';

export interface ShortcutConfig {
  newWill?: string;
  search?: string;
  help?: string;
}

export interface UseKeyboardShortcutsProps {
  onNewWill?: () => void;
  onSearch?: () => void;
  onHelp?: () => void;
  shortcuts?: ShortcutConfig;
}

/**
 * Module-level constant used as the default value for `shortcuts`.
 *
 * A default parameter of `shortcuts = {}` creates a new object on every call,
 * which would make `shortcuts` appear to change on every render and re-trigger
 * the effect (re-registering the keydown listener). Using a stable reference
 * here ensures the effect only re-runs when the caller explicitly passes a
 * different `shortcuts` object.
 */
const EMPTY_SHORTCUTS: ShortcutConfig = {};

export function useKeyboardShortcuts({
  onNewWill,
  onSearch,
  onHelp,
  shortcuts = EMPTY_SHORTCUTS,
}: UseKeyboardShortcutsProps) {
  // Store the latest handlers in refs so the stable listener closure can
  // always call the current version without needing to be re-registered when
  // handler identity changes between renders.
  const onNewWillRef = useRef(onNewWill);
  const onSearchRef = useRef(onSearch);
  const onHelpRef = useRef(onHelp);
  const shortcutsRef = useRef(shortcuts);

  // Keep refs in sync on every render (no need to add them to effect deps).
  onNewWillRef.current = onNewWill;
  onSearchRef.current = onSearch;
  onHelpRef.current = onHelp;
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Check if modifier keys are pressed (excluding Shift, which is needed for '?')
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      // Check if focused element is an input, textarea, or contenteditable
      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName.toLowerCase();
        const contentEditableAttr = activeEl.getAttribute('contenteditable');
        const htmlEl = activeEl as HTMLElement;
        const isContentEditable =
          contentEditableAttr === 'true' ||
          contentEditableAttr === '' ||
          htmlEl.contentEditable === 'true' ||
          (htmlEl as HTMLElement & { isContentEditable?: boolean }).isContentEditable === true;

        if (tagName === 'input' || tagName === 'textarea' || isContentEditable) {
          return;
        }
      }

      // Read key overrides and handlers from refs so we always use the latest
      // values without re-registering the listener on every render.
      const sc = shortcutsRef.current;
      const keyNewWill = sc.newWill ?? 'n';
      const keySearch = sc.search ?? '/';
      const keyHelp = sc.help ?? '?';

      if (event.key === keyNewWill && onNewWillRef.current) {
        event.preventDefault();
        onNewWillRef.current();
      } else if (event.key === keySearch && onSearchRef.current) {
        event.preventDefault();
        onSearchRef.current();
      } else if (event.key === keyHelp && onHelpRef.current) {
        event.preventDefault();
        onHelpRef.current();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // Empty dependency array: the listener is registered exactly once (on
    // mount) and removed on unmount. All mutable values are accessed through
    // refs, so the listener is always current without needing re-registration.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
