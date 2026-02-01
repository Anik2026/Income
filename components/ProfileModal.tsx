import React, { useState } from 'react';
import { X, Save, User as UserIcon, Check } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { User } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (avatarUrl: string) => Promise<void>;
}

// Fun default avatars
const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robot',
  'https://api.dicebear.com/7.x/micah/svg?seed=Picasso',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Leo',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Nala'
];

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onUpdate }) => {
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [loading, setLoading] = useState(false);
  const { language } = useSettings();

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    await onUpdate(avatarUrl);
    setLoading(false);
    onClose();
  };

  const t = {
    title: language === 'bn' ? 'প্রোফাইল আপডেট' : 'Update Profile',
    urlLabel: language === 'bn' ? 'ছবির লিঙ্ক (URL)' : 'Image URL',
    placeholder: language === 'bn' ? 'ছবির লিঙ্ক পেস্ট করুন...' : 'Paste image link...',
    presets: language === 'bn' ? 'অথবা একটি বেছে নিন' : 'Or choose a preset',
    save: language === 'bn' ? 'সংরক্ষণ' : 'Save Changes',
    cancel: language === 'bn' ? 'বাতিল' : 'Cancel'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserIcon size={20} /> {t.title}
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preview */}
          <div className="flex justify-center">
            <div className="relative w-24 h-24 rounded-full border-4 border-indigo-100 dark:border-indigo-900/50 overflow-hidden shadow-lg">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                  <UserIcon size={40} />
                </div>
              )}
            </div>
          </div>

          {/* Custom URL Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
              {t.urlLabel}
            </label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder={t.placeholder}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>

          {/* Presets */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
              {t.presets}
            </label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_AVATARS.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setAvatarUrl(url)}
                  className={`relative rounded-full overflow-hidden border-2 transition-all hover:scale-110 aspect-square ${avatarUrl === url ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={url} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                  {avatarUrl === url && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Check size={12} className="text-white font-bold" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;