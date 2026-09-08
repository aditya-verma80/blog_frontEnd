"use client";

import { useEffect, useId, useRef } from "react";

interface addData {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string | number;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: addData) => {
  const titleId = useId();
  const descriptionId = useId();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    cancelButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl sm:p-6">
        <h2 id={titleId} className="text-lg font-bold text-gray-900">Confirm delete</h2>

        <p id={descriptionId} className="mt-2 text-base text-gray-700">
          Are you sure you want to delete this item <span className="font-bold text-gray-900">{itemName}</span>?
          This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse gap-3 min-[360px]:flex-row min-[360px]:justify-end">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            className="min-h-11 rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="min-h-11 rounded bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
