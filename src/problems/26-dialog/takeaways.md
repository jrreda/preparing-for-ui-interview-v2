# Dialog takeaways

The dialog is a native `<dialog>` opened with `showModal()`. React mirrors the `open` prop and reports Confirm and Cancel.

## showModal is what makes it a modal

`showModal()` centers the dialog, paints `::backdrop`, traps focus, makes the rest of the page inert, and closes on Escape. The `open` HTML attribute skips that and leaves the dialog inline. The effect calls `showModal()` when the prop is true and `close()` when it is false. The attribute never appears in the JSX.

## close() fires the same event as Escape

The browser fires `close` for Escape and for `dialog.close()`. `onClose={onCancel}` treats both as a cancel.

Confirm calls `onConfirm`. The parent sets `open` to false, the effect calls `close()`, and that fires `close` again, so `onCancel` runs too. The example then alerts "Confirmed" and "Cancelled".

`onCancel` belongs only on a close that happens while the prop is still true. Escape fires `close` before React re-renders, so `open` is still true. After Confirm, React commits the render with `open={false}` before the effect calls `close()`, and the handler can see that and stay quiet:

`if (open) onCancel()`

## showModal throws if the dialog is already open

A second `showModal()` on an open dialog throws `InvalidStateError`. The app mounts under `StrictMode`, which runs effects twice. Mounting with `open={true}` opens the dialog, then the second pass calls `showModal()` again and throws. Read the DOM flag first: call `showModal()` only when `open` is true and `dialog.open` is false, and call `close()` only when the prop is false and `dialog.open` is still true.

`dialog.open` is the DOM property. The prop with the same name is React state. After Escape the browser has already closed the dialog, so the guarded `close()` does not run again.

## A backdrop click targets the dialog

`::backdrop` is not an element. A click on the overlay is delivered to the `<dialog>`, so `e.target === dialogRef.current`. A click on the heading or a button has that inner node as `e.target`, and the dialog stays open.

The dialog's padding is part of the dialog element. `padding: 1rem` on `.modal` means a click in that rim matches and cancels. Put the padding on the section and the footer if that rim should stay inert.

The handler calls `onCancel` and leaves the element open. The parent sets `open` to false, and the effect calls `close()`.

## The accessible name is the aria-label

`aria-label` replaces the button text. A screen reader announces "Confirm Dialog" for the first button. The second button says "Cancle" in both the label and the visible text. The visible word Cancel is the name, and the label can go.

`autoFocus` on Confirm takes focus when the dialog opens. The first focusable control would have received it otherwise.

## filter on the backdrop blurs the overlay

`filter: blur(6px)` on `dialog::backdrop` blurs the translucent layer. The page behind it stays sharp. Blurring that page is `backdrop-filter`. `margin: auto` is already in the user-agent rule for a modal dialog. The prefixed `border-radius` copies are unused in current browsers.
