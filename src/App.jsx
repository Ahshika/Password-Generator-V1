import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Key, Plus, Trash2, Copy, RefreshCw, Globe } from 'lucide-react';

function App() {
  const { t, i18n } = useTranslation();
  const [token, setToken] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [isManagerLocked, setIsManagerLocked] = useState(true);
  
  // Form states
  const [newSite, setNewSite] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Generator states
  const [genLen, setGenLen] = useState(16);
  const [useNum, setUseNum] = useState(true);
  const [useSym, setUseSym] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useArabic, setUseArabic] = useState(false);
  const [generatedPwd, setGeneratedPwd] = useState('');

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const loadPasswords = async () => {
    const data = await window.electronAPI.getPasswords();
    setPasswords(data);
  };

  const handleLogin = async () => {
    const verified = await window.electronAPI.verifyTotpLogin(token);
    if (verified) {
      setIsManagerLocked(false);
      loadPasswords();
    } else {
      alert(t('Invalid code.'));
    }
  };

  const handleAddPassword = async (e) => {
    e.preventDefault();
    if (!newSite || !newUsername || !newPassword) return;
    await window.electronAPI.addPassword(newSite, newUsername, newPassword);
    setNewSite(''); setNewUsername(''); setNewPassword('');
    loadPasswords();
  };

  const handleDelete = async (id) => {
    await window.electronAPI.deletePassword(id);
    loadPasswords();
  };

  const generatePassword = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNum) chars += '0123456789';
    if (useSym) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    if (useArabic) chars += 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    
    let pwd = '';
    for (let i = 0; i < genLen; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPwd(pwd);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <div className="min-h-screen bg-night-900 text-gray-200 font-sans p-6 overflow-y-auto">
      <div className="absolute top-4 right-4 flex gap-4">
        <button onClick={toggleLanguage} className="text-gold-400 hover:text-gold-500 transition-colors">
          <Globe className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto mt-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-yellow-600 flex items-center justify-center gap-3">
            <Shield className="w-10 h-10 text-gold-500" />
            NightGold
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Generator Section (Always Unlocked) */}
          <div className="bg-night-800 rounded-2xl border border-gold-600/20 overflow-hidden h-[600px] flex flex-col shadow-xl shadow-gold-500/5">
            <div className="bg-night-900/50 p-4 border-b border-gold-600/20">
              <h2 className="text-xl font-bold text-gold-400">{t('Generator')}</h2>
            </div>
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <div className="relative">
                <input 
                  readOnly 
                  value={generatedPwd}
                  className="w-full bg-night-900 border border-gold-600/50 rounded-xl px-4 py-4 text-center text-xl font-mono text-gold-400 focus:outline-none"
                />
                {generatedPwd && (
                  <button onClick={() => navigator.clipboard.writeText(generatedPwd)} className="absolute right-2 top-2 bottom-2 bg-gold-600/20 hover:bg-gold-600/40 text-gold-500 px-4 rounded-lg flex items-center justify-center transition-colors">
                    <Copy className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label>{t('Length')}</label>
                    <span className="text-gold-500 font-mono">{genLen}</span>
                  </div>
                  <input 
                    type="range" min="8" max="64" value={genLen} onChange={(e) => setGenLen(e.target.value)}
                    className="w-full accent-gold-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-night-900 rounded-lg border border-gold-600/10 hover:border-gold-600/30 transition-colors">
                    <input type="checkbox" checked={useNum} onChange={(e) => setUseNum(e.target.checked)} className="accent-gold-500 w-5 h-5" />
                    <span>{t('Numbers')}</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-night-900 rounded-lg border border-gold-600/10 hover:border-gold-600/30 transition-colors">
                    <input type="checkbox" checked={useSym} onChange={(e) => setUseSym(e.target.checked)} className="accent-gold-500 w-5 h-5" />
                    <span>{t('Symbols')}</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-night-900 rounded-lg border border-gold-600/10 hover:border-gold-600/30 transition-colors">
                    <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} className="accent-gold-500 w-5 h-5" />
                    <span>{t('Uppercase')}</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-night-900 rounded-lg border border-gold-600/10 hover:border-gold-600/30 transition-colors">
                    <input type="checkbox" checked={useArabic} onChange={(e) => setUseArabic(e.target.checked)} className="accent-gold-500 w-5 h-5" />
                    <span>{t('Arabic')}</span>
                  </label>
                </div>

                <button 
                  onClick={generatePassword}
                  className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-night-900 font-bold py-4 rounded-xl hover:from-gold-500 hover:to-gold-400 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-gold-500/20 mt-8"
                >
                  <RefreshCw className="w-6 h-6" />
                  {t('Generate')}
                </button>
              </div>
            </div>
          </div>

          {/* Manager Section */}
          <div className="bg-night-800 rounded-2xl border border-gold-600/20 overflow-hidden flex flex-col h-[600px] shadow-xl shadow-gold-500/5">
            <div className="bg-night-900/50 p-4 border-b border-gold-600/20">
              <h2 className="text-xl font-bold text-gold-400">{t('Password Manager')}</h2>
            </div>
            
            {isManagerLocked ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <Key className="w-16 h-16 text-gold-500 mb-6 opacity-80" />
                <h2 className="text-xl font-semibold mb-6 text-center text-gold-400">Unlock Database</h2>
                <input 
                  type="text" 
                  placeholder={t('Enter Code')}
                  className="w-full max-w-xs bg-night-900 border border-gold-600/50 rounded-lg px-4 py-3 text-center tracking-widest text-xl focus:outline-none focus:border-gold-400 transition-colors mb-6"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button 
                  onClick={handleLogin}
                  className="w-full max-w-xs bg-gradient-to-r from-gold-600 to-gold-500 text-night-900 font-bold py-3 rounded-lg hover:from-gold-500 hover:to-gold-400 transition-all shadow-lg shadow-gold-500/20"
                >
                  {t('Login')}
                </button>
                <p className="mt-4 text-xs text-gray-500 text-center px-4">
                  Database is private. Only the database owner can unlock this section using their Authenticator app.
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {passwords.map(p => (
                    <div key={p.id} className="bg-night-900 p-4 rounded-xl border border-gold-600/10 hover:border-gold-600/40 transition-colors flex justify-between items-center group">
                      <div>
                        <h3 className="font-semibold text-gray-200">{p.site}</h3>
                        <p className="text-sm text-gray-400">{p.username}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigator.clipboard.writeText(p.password)} className="p-2 hover:bg-gold-500/10 text-gold-500 rounded-lg" title={t('Copy')}>
                          <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg" title={t('Delete')}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {passwords.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                      No passwords saved yet.
                    </div>
                  )}
                </div>
                <div className="p-4 bg-night-900/80 border-t border-gold-600/20">
                  <form onSubmit={handleAddPassword} className="space-y-3">
                    <input required placeholder={t('Site')} value={newSite} onChange={e => setNewSite(e.target.value)} className="w-full bg-night-800 border border-gold-600/30 rounded px-3 py-2 focus:outline-none focus:border-gold-500" />
                    <input required placeholder={t('Username')} value={newUsername} onChange={e => setNewUsername(e.target.value)} className="w-full bg-night-800 border border-gold-600/30 rounded px-3 py-2 focus:outline-none focus:border-gold-500" />
                    <div className="flex gap-2">
                      <input required type="password" placeholder={t('Password')} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="flex-1 bg-night-800 border border-gold-600/30 rounded px-3 py-2 focus:outline-none focus:border-gold-500" />
                      <button type="submit" className="bg-gold-600 hover:bg-gold-500 text-night-900 p-2 rounded transition-colors">
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;
