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
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>

        <p className="mt-2 text-sm text-gray-500">
          Are you sure you want to delete this item <span className="font-bold text-gray-900">{itemName}</span>?
          This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
