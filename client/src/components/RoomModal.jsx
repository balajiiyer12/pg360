import React from 'react';

export default function RoomModal({ isOpen, onClose, onSubmit, modalMode, roomForm, setRoomForm, submitting }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
                <h2 className="text-xl font-bold text-slate-900">
                    {modalMode === 'add' ? 'Add New Room' : 'Edit Room'}
                </h2>
                
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Room Name / Number</label>
                        <input 
                            type="text" 
                            required
                            value={roomForm.roomName}
                            onChange={(e) => setRoomForm({...roomForm, roomName: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                            placeholder="e.g., Room 101"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Capacity (Beds)</label>
                        <input 
                            type="number" 
                            required
                            min="1"
                            value={roomForm.capacity}
                            onChange={(e) => setRoomForm({...roomForm, capacity: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                            placeholder="e.g., 2"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Monthly Rent (₹)</label>
                        <input 
                            type="number" 
                            required
                            min="0"
                            value={roomForm.rent}
                            onChange={(e) => setRoomForm({...roomForm, rent: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                            placeholder="e.g., 5000"
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                        >
                            {submitting ? 'Saving...' : (modalMode === 'add' ? 'Create Room' : 'Update Room')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}