import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Plus, Trash2, X, Check, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useResume } from '@/contexts/ResumeContext';
import { toast } from 'sonner';

const PROFILES_KEY = 'resumeforge_profiles';
const ACTIVE_PROFILE_KEY = 'resumeforge_active_profile';

interface Profile {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  data: string; // JSON stringified resume data + settings
}

function loadProfiles(): Profile[] {
  try {
    const stored = localStorage.getItem(PROFILES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveProfiles(profiles: Profile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

function getActiveProfileId(): string | null {
  return localStorage.getItem(ACTIVE_PROFILE_KEY);
}

function setActiveProfileId(id: string | null) {
  if (id) {
    localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
  }
}

export default function ResumeProfiles() {
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const {
    resumeData, setResumeData,
    selectedTemplate, setSelectedTemplate,
    sectionOrder, setSectionOrder,
    accentColor, setAccentColor,
    selectedFont, setSelectedFont,
    fontSize, setFontSize,
    lineSpacing, setLineSpacing,
    marginSize, setMarginSize,
  } = useResume();

  useEffect(() => {
    setProfiles(loadProfiles());
    setActiveId(getActiveProfileId());
  }, [open]);

  const getCurrentSnapshot = useCallback(() => {
    return JSON.stringify({
      resumeData,
      selectedTemplate,
      sectionOrder,
      accentColor,
      fontId: selectedFont.id,
      fontSize,
      lineSpacing,
      marginSize,
    });
  }, [resumeData, selectedTemplate, sectionOrder, accentColor, selectedFont, fontSize, lineSpacing, marginSize]);

  const saveCurrentProfile = useCallback(() => {
    if (!newName.trim()) {
      toast.error('Please enter a profile name');
      return;
    }

    const id = `profile_${Date.now()}`;
    const profile: Profile = {
      id,
      name: newName.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: getCurrentSnapshot(),
    };

    const updated = [...profiles, profile];
    setProfiles(updated);
    saveProfiles(updated);
    setActiveId(id);
    setActiveProfileId(id);
    setNewName('');
    toast.success(`Profile "${profile.name}" saved`);
  }, [newName, profiles, getCurrentSnapshot]);

  const updateProfile = useCallback((id: string) => {
    const updated = profiles.map(p =>
      p.id === id ? { ...p, data: getCurrentSnapshot(), updatedAt: new Date().toISOString() } : p
    );
    setProfiles(updated);
    saveProfiles(updated);
    toast.success('Profile updated');
  }, [profiles, getCurrentSnapshot]);

  const loadProfile = useCallback((profile: Profile) => {
    try {
      const parsed = JSON.parse(profile.data);
      if (parsed.resumeData) setResumeData(parsed.resumeData);
      if (parsed.selectedTemplate) setSelectedTemplate(parsed.selectedTemplate);
      if (parsed.sectionOrder) setSectionOrder(parsed.sectionOrder);
      if (parsed.accentColor) setAccentColor(parsed.accentColor);
      if (parsed.fontId) setSelectedFont(parsed.fontId);
      if (parsed.fontSize != null) setFontSize(parsed.fontSize);
      if (parsed.lineSpacing != null) setLineSpacing(parsed.lineSpacing);
      if (parsed.marginSize != null) setMarginSize(parsed.marginSize);

      setActiveId(profile.id);
      setActiveProfileId(profile.id);
      toast.success(`Loaded "${profile.name}"`);
      setOpen(false);
    } catch {
      toast.error('Failed to load profile data');
    }
  }, [setResumeData, setSelectedTemplate, setSectionOrder, setAccentColor, setSelectedFont, setFontSize, setLineSpacing, setMarginSize]);

  const deleteProfile = useCallback((id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    saveProfiles(updated);
    if (activeId === id) {
      setActiveId(null);
      setActiveProfileId(null);
    }
    toast.success('Profile deleted');
  }, [profiles, activeId]);

  const renameProfile = useCallback((id: string) => {
    if (!editName.trim()) return;
    const updated = profiles.map(p =>
      p.id === id ? { ...p, name: editName.trim() } : p
    );
    setProfiles(updated);
    saveProfiles(updated);
    setEditingId(null);
    setEditName('');
  }, [profiles, editName]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="size-10 rounded-full" onClick={() => setOpen(true)}>
            <FolderOpen className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Resume Profiles</TooltipContent>
      </Tooltip>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="relative w-full max-w-md mx-4 max-h-[80vh] overflow-hidden rounded-3xl"
              style={{ background: 'var(--md3-surface-container)', border: '1px solid var(--md3-outline-variant)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--md3-outline-variant)' }}>
                <div className="flex items-center gap-3">
                  <FolderOpen className="size-5" style={{ color: 'var(--md3-primary)' }} />
                  <h2 className="font-display text-lg font-semibold">Resume Profiles</h2>
                </div>
                <Button variant="ghost" size="icon" className="size-9 rounded-full" onClick={() => setOpen(false)}>
                  <X className="size-4" />
                </Button>
              </div>

              <div className="px-6 py-4 overflow-y-auto max-h-[60vh] space-y-4">
                <p className="text-xs text-muted-foreground">Save different resume versions for different roles. Switch between them instantly.</p>

                {/* Create new profile */}
                <div className="flex gap-2">
                  <Input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g., Frontend Developer"
                    className="h-9 text-sm rounded-xl flex-1"
                    style={{ border: '1px solid var(--md3-outline-variant)' }}
                    onKeyDown={e => e.key === 'Enter' && saveCurrentProfile()}
                  />
                  <Button
                    size="sm"
                    className="h-9 rounded-full px-4 gap-1.5"
                    style={{ background: 'var(--md3-primary)', color: 'var(--md3-on-primary)' }}
                    onClick={saveCurrentProfile}
                  >
                    <Plus className="size-3.5" />
                    Save
                  </Button>
                </div>

                {/* Profile list */}
                {profiles.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderOpen className="size-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                    <p className="text-sm text-muted-foreground">No saved profiles yet</p>
                    <p className="text-xs text-muted-foreground opacity-60">Save your current resume as a profile above</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {profiles.map(profile => (
                      <div
                        key={profile.id}
                        className="p-3 rounded-xl transition-all"
                        style={{
                          background: activeId === profile.id ? 'var(--md3-secondary-container)' : 'var(--md3-surface-container-high)',
                          border: activeId === profile.id ? '1px solid var(--md3-primary)' : '1px solid transparent',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            {editingId === profile.id ? (
                              <div className="flex gap-1.5">
                                <Input
                                  value={editName}
                                  onChange={e => setEditName(e.target.value)}
                                  className="h-7 text-xs rounded-lg"
                                  autoFocus
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') renameProfile(profile.id);
                                    if (e.key === 'Escape') setEditingId(null);
                                  }}
                                />
                                <Button variant="ghost" size="icon" className="size-7 rounded-full" onClick={() => renameProfile(profile.id)}>
                                  <Check className="size-3" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium truncate">{profile.name}</span>
                                  {activeId === profile.id && (
                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: 'var(--md3-primary)', color: 'var(--md3-on-primary)' }}>Active</span>
                                  )}
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                  Updated {new Date(profile.updatedAt).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            {activeId === profile.id && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="size-7 rounded-full" onClick={() => updateProfile(profile.id)}>
                                    <Check className="size-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Update profile</TooltipContent>
                              </Tooltip>
                            )}
                            {activeId !== profile.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-[11px] rounded-full px-2.5"
                                onClick={() => loadProfile(profile)}
                              >
                                Load
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 rounded-full"
                              onClick={() => { setEditingId(profile.id); setEditName(profile.name); }}
                            >
                              <Edit2 className="size-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 rounded-full text-destructive hover:text-destructive"
                              onClick={() => deleteProfile(profile.id)}
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
