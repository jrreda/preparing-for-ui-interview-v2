import React, { useRef, useEffect } from 'react'
import css from './dialog.module.css'

type TDialogProps = {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  children: React.ReactNode
}

/**
 * Expected input:
 * <Dialog open={isOpen} onConfirm={handleConfirm} onCancel={handleCancel}>
 *   <h2>Confirm Action</h2>
 *   <p>Are you sure you want to proceed?</p>
 * </Dialog>
 *
 * Step 1: Implement Dialog component
 * - Create a ref for the <dialog> element
 * - Use useEffect to sync open prop: call showModal() when open, close() when not
 * - Render a <dialog> with:
 *   - onClose handler that calls onCancel (handles native Escape key close)
 *   - A <section> for children content
 *   - A <footer> with Confirm and Cancel buttons
 * - Use cx() and styles utilities for layout (padding24, bNone, br8, flexRowBetween, flexGap8)
 */
export function Dialog({ open, onConfirm, onCancel, children }: TDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  // Close when clicking the backdrop outside the dialog box
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    // console.log(e.target, dialogRef.current);
    if (e.target === dialogRef.current) {
      onCancel()
    }
  }

  return (
    <dialog onClose={onCancel} onClick={handleBackdropClick} ref={dialogRef} className={css.modal}>
      <section className={css.content}>{children}</section>

      <footer className={css.footer}>
        <button type="button" autoFocus onClick={onConfirm}>
          Confirm
        </button>
        <button type="button" onClick={onCancel}>
          Cancle
        </button>
      </footer>
    </dialog>
  )
}
