import React, { useState, useRef } from 'react';
import { X, Save, User as UserIcon, Check, Upload, Image as ImageIcon } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useSettings();

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    await onUpdate(avatarUrl);
    setLoading(false);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read and resize image
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Resize to max 300px width/height to save space
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to Base64 string (JPEG 70% quality)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setAvatarUrl(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const t = {
    title: language === 'bn' ? 'প্রোফাইল আপডেট' : 'Update Profile',
    urlLabel: language === 'bn' ? 'ছবির লিঙ্ক (URL)' : 'Image URL',
    uploadBtn: language === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Photo',
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
          {/* Preview & Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-28 h-28 rounded-full border-4 border-indigo-100 dark:border-indigo-900/50 overflow-hidden shadow-lg group">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                  <UserIcon size={48} />
                </div>
              )}
              
              {/* Overlay Upload Button */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium text-xs"
              >
                <Upload size={24} className="mb-1" />
                {t.uploadBtn}
              </button>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-lg transition-colors"
            >
              <Upload size={16} /> {t.uploadBtn}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">OR</span>
            </div>
          </div>

          {/* Custom URL Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-2">
              <ImageIcon size={14} /> {t.urlLabel}
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