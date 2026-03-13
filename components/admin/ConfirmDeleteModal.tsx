export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm } : {isOpen: boolean, onClose: () => void, onConfirm: () => void}) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                <p className="mb-6 text-gray-600">Are you sure you want to delete this product? This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all">Cancel</button>
                    <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all">Delete</button>
                </div>
            </div>
        </div>
    )
}