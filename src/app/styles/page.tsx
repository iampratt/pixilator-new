'use client';

import { useState, useEffect } from 'react';
import { STYLE_PRESETS } from '@/lib/config';

interface StylePreset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  negativePrompt: string;
}

export default function StylesPage() {
  const [styles, setStyles] = useState<StylePreset[]>([...STYLE_PRESETS]);
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editingStyle, setEditingStyle] = useState<StylePreset | null>(null);

  const ADMIN_PASSWORD = 'pixilator2024'; // Change this to your desired password

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsEditing(true);
      setShowPasswordForm(false);
    } else {
      alert('Incorrect password');
    }
  };

  const saveStyles = () => {
    localStorage.setItem('custom_styles', JSON.stringify(styles));
    alert('Styles saved successfully!');
  };

  const loadCustomStyles = () => {
    const saved = localStorage.getItem('custom_styles');
    if (saved) {
      setStyles(JSON.parse(saved));
    }
  };

  useEffect(() => {
    loadCustomStyles();
  }, []);

  const updateStyle = (id: string, field: keyof StylePreset, value: string) => {
    setStyles(prev => prev.map(style => 
      style.id === id ? { ...style, [field]: value } : style
    ));
  };

  const startEditing = (style: StylePreset) => {
    setEditingStyle(style);
  };

  const stopEditing = () => {
    setEditingStyle(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-gray-900">Style Presets</h1>
          {!isEditing ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="salt-paper-button px-4 py-2 rounded-lg hover:scale-105 transition-transform"
            >
              Edit Styles
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={saveStyles}
                className="salt-paper-button px-4 py-2 rounded-lg hover:scale-105 transition-transform"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {showPasswordForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in-up">
            <div className="salt-paper-card p-8 rounded-lg max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Enter Admin Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="salt-paper-input w-full px-4 py-3 rounded-lg"
                  required
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="salt-paper-button px-4 py-2 rounded-lg flex-1 hover:scale-105 transition-transform"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {styles.map((style, index) => (
            <div
              key={style.id}
              className="salt-paper-card rounded-lg p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {editingStyle?.id === style.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={style.name}
                    onChange={(e) => updateStyle(style.id, 'name', e.target.value)}
                    className="salt-paper-input w-full px-3 py-2 rounded"
                    placeholder="Style name"
                  />
                  <textarea
                    value={style.description}
                    onChange={(e) => updateStyle(style.id, 'description', e.target.value)}
                    className="salt-paper-input w-full px-3 py-2 rounded"
                    rows={2}
                    placeholder="Style description"
                  />
                  <textarea
                    value={style.prompt}
                    onChange={(e) => updateStyle(style.id, 'prompt', e.target.value)}
                    className="salt-paper-input w-full px-3 py-2 rounded"
                    rows={3}
                    placeholder="Positive prompt"
                  />
                  <textarea
                    value={style.negativePrompt}
                    onChange={(e) => updateStyle(style.id, 'negativePrompt', e.target.value)}
                    className="salt-paper-input w-full px-3 py-2 rounded"
                    rows={2}
                    placeholder="Negative prompt"
                  />
                  <button
                    onClick={stopEditing}
                    className="salt-paper-button px-4 py-2 rounded w-full hover:scale-105 transition-transform"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 animate-slide-in">
                    {style.name}
                  </h3>
                  <p className="text-gray-600 mb-4 animate-slide-in">{style.description}</p>
                  
                  <div className="space-y-2 text-sm animate-slide-in">
                    <div>
                      <span className="font-medium text-gray-700">Positive:</span>
                      <p className="text-gray-600">{style.prompt}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Negative:</span>
                      <p className="text-gray-600">{style.negativePrompt}</p>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <button
                      onClick={() => startEditing(style)}
                      className="mt-4 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 w-full transition-colors hover:scale-105"
                    >
                      Edit
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
