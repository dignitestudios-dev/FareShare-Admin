const DeleteConfirmModal = ({ open, onClose, onConfirm, deleting }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md animate-fadeIn">
        <h2 className="text-xl font-semibold text-[#c00000] mb-3">
          Are you sure?
        </h2>
        <p className="text-gray-600 mb-6">
          Do you really want to delete this blog post?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
          >
            No, Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={deleting}
            className={`px-5 py-2 rounded-full text-white font-medium transition-all ${
              deleting
                ? "bg-red-400 cursor-not-allowed"
                : "bg-[#c00000] hover:bg-[#a00000]"
            }`}
          >
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;