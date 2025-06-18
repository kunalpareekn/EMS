import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNotification } from '../context/notificationSlice';
import { toast } from 'react-toastify';

const NotificationSender = () => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.notifications);

  const handleSend = () => {
    if (!message.trim()) return;
    dispatch(createNotification(message));
    toast.success('Announcement sent successfully!');
    setMessage('');
  };

  return (
    <div className="p-4 border rounded-md shadow-md w-full max-w-md bg-white">
      <h2 className="text-xl font-semibold mb-2"> Make an  Announcement</h2>
      <textarea
        rows={3}
        className="w-full p-2 border rounded mb-2"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sending...' : 'Send'}
      </button>
      {error && <p className="text-red-600 mt-2">Error: {error}</p>}
    </div>
  );
};

export default NotificationSender;
