import React from 'react';

function Modal({ 
  isOpen, 
  onClose, 
  onSignUp, 
  title = "Sign In Required", 
  message = "You need to sign in to perform this action. Would you like to sign up?",
  actionText = "Sign Up"
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onSignUp}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;