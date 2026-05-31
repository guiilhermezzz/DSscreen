import { useState, useRef } from 'react';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import type { User as UserType, View } from '../lib/types';

interface EditProfilePageProps {
  user: UserType;
  onSave: (updatedUser: Partial<UserType>) => void;
  onBack: () => void;
}

export function EditProfilePage({ user, onSave, onBack }: EditProfilePageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    username: user.username,
    bio: user.bio || '',
    avatarUrl: user.avatarUrl || '',
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.avatarUrl || null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setForm(prev => ({ ...prev, avatarUrl: base64 }));
        setPreviewUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setForm(prev => ({ ...prev, avatarUrl: '' }));
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setIsSaving(false);
    onSave(form);
    onBack();
  };

  return (
    <div className="pb-20 pt-4">
      {/* Header */}
      <div className="px-4 mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-black text-white">Editar Perfil</h1>
      </div>

      {/* Form */}
      <div className="px-4 space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          {previewUrl ? (
            <div className="relative group">
              <img
                src={previewUrl}
                alt="Avatar preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-red-600/50"
              />
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-red-600 rounded-full text-white hover:bg-red-500 transition-colors"
                  title="Alterar foto"
                >
                  <Upload size={14} />
                </button>
                <button
                  onClick={handleRemoveAvatar}
                  className="p-2 bg-red-600 rounded-full text-white hover:bg-red-500 transition-colors"
                  title="Remover foto"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 transition-colors w-full"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600/50 to-red-900/50 border-2 border-red-600/50 flex items-center justify-center">
                <Upload size={24} className="text-white/60" />
              </div>
              <span className="text-sm text-white/60 font-medium">Adicionar foto de perfil</span>
            </button>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Nome</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              disabled={isSaving}
              placeholder="Seu nome completo"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all disabled:opacity-50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              disabled={isSaving}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all disabled:opacity-50"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Usuário</label>
            <input
              type="text"
              value={form.username}
              onChange={handleChange('username')}
              disabled={isSaving}
              placeholder="nomedeusuario"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all disabled:opacity-50"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Bio</label>
            <textarea
              value={form.bio}
              onChange={handleChange('bio')}
              disabled={isSaving}
              placeholder="Descreva um pouco sobre você..."
              rows={4}
              maxLength={150}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all disabled:opacity-50 resize-none"
            />
            <div className="text-xs text-white/40 mt-1">{form.bio.length}/150</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button
            onClick={onBack}
            disabled={isSaving}
            className="w-full py-3.5 rounded-xl bg-white/10 backdrop-blur text-white font-bold text-sm border border-white/10 hover:bg-white/20 transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
