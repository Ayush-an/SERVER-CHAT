import React, { useState, createContext, useContext } from 'react';

// Create a context for the modal
export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    content: null,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const openModal = (title, content, onConfirm, onCancel) => {
    setModalState({ isOpen: true, title, content, onConfirm, onCancel });
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  const value = { modalState, openModal, closeModal };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-sans bg-gray-900 bg-opacity-50">
          <div className="w-full max-w-sm p-6 mx-4 bg-white border border-gray-200 shadow-2xl rounded-2xl">
            <h3 className="mb-4 text-xl font-bold text-gray-800">{modalState.title}</h3>
            <div className="mb-6 text-gray-600">{modalState.content}</div>
            <div className="flex justify-end space-x-4">
              {modalState.onCancel && (
                <button
                  onClick={() => { modalState.onCancel(); closeModal(); }}
                  className="px-4 py-2 font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
              {modalState.onConfirm && (
                <button
                  onClick={() => { modalState.onConfirm(); closeModal(); }}
                  className="px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

// Create a context for notifications
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const value = { showNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notification && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 p-4 rounded-xl shadow-lg text-white font-sans transition-opacity duration-300 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};
