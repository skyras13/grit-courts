'use client';

import { useId, type ReactNode } from 'react';

/**
 * A file picker that actually opens.
 *
 * Every upload in the app previously used a `display: none` input driven by
 * `inputRef.current.click()`. Safari refuses to open a picker for an input that
 * isn't rendered, and embedded/sandboxed webviews often block the synthetic
 * click too — so the button did nothing at all in those contexts.
 *
 * This uses the native pairing instead: the input is visually hidden but still
 * laid out and focusable (`sr-only`, not `hidden`), and a `<label htmlFor>`
 * provides the visible target. Clicking a label opens its input with no
 * JavaScript involved, which works everywhere and stays keyboard-accessible.
 */
export function FilePicker({
  onFiles,
  accept = 'image/*',
  multiple = false,
  disabled = false,
  className,
  children,
}: {
  onFiles: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const id = useId();

  return (
    <>
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length) onFiles(files);
          // Reset so picking the same file twice in a row still fires onChange.
          e.target.value = '';
        }}
      />
      <label htmlFor={id} className={className} aria-disabled={disabled || undefined}>
        {children}
      </label>
    </>
  );
}
