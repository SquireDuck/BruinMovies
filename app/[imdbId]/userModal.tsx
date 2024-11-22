import React, { useRef } from 'react';

interface User {
  username: string;
  email: string;
  profilePicture: string;
  biography: string;
  genre_interests: string;
  major: string;
  year: string;
}

interface UserModalProps {
  user: User | null;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={handleClickOutside}>
      <div ref={modalRef} className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-2xl w-full py-10">
        {/* <button onClick={onClose} className="text-yellow-400 hover:text-yellow-300 transition duration-300 mb-4">
          Close
        </button> */}
        <div className="flex items-center mb-4">
          <img src={user.profilePicture} alt={`${user.username}'s profile`} className="w-16 h-16 rounded-full mr-4" />
          <div>
            <h2 className="text-2xl font-bold text-yellow-400">{user.username}</h2>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <p className="text-gray-300 mb-4">{user.biography || "No bio available."}</p>
        <p className="text-gray-300 mb-4"><strong>Genre Interests:</strong> {user.genre_interests}</p>
        <p className="text-gray-300 mb-4"><strong>Major:</strong> {user.major}</p>
        <p className="text-gray-300"><strong>Year:</strong> {user.year}</p>
      </div>
    </div>
  );
};

export default UserModal;