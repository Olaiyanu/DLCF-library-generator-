import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Download, User, Mail, Phone, Calendar, Hash, Library, RefreshCcw } from 'lucide-react';
import { cn } from './lib/utils';

interface CardData {
  name: string;
  email: string;
  phone: string;
  regDate: string;
  cardId: string;
}

export default function App() {
  const [formData, setFormData] = useState<CardData>({
    name: '',
    email: '',
    phone: '',
    regDate: new Date().toISOString().split('T')[0],
    cardId: 'LIB - 2026001',
  });

  const [isGenerated, setIsGenerated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize and handle sequential ID
  useEffect(() => {
    const lastId = localStorage.getItem('dlcf_last_id');
    const nextIdNumber = lastId ? parseInt(lastId) + 1 : 1;
    const formattedId = `LIB - 2026${nextIdNumber.toString().padStart(3, '0')}`;
    
    setFormData(prev => ({
      ...prev,
      cardId: formattedId
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerated(true);
    
    // Persist the current ID as the "last used" one
    const currentIdNumber = parseInt(formData.cardId.split('2026')[1]);
    localStorage.setItem('dlcf_last_id', currentIdNumber.toString());
  };

  const resetForm = () => {
    const lastId = localStorage.getItem('dlcf_last_id');
    const nextIdNumber = lastId ? parseInt(lastId) + 1 : 1;
    const formattedId = `LIB - 2026${nextIdNumber.toString().padStart(3, '0')}`;

    setFormData({
      name: '',
      email: '',
      phone: '',
      regDate: new Date().toISOString().split('T')[0],
      cardId: formattedId,
    });
    setIsGenerated(false);
  };

  const downloadCard = async () => {
    if (cardRef.current === null) return;

    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `library-card-${formData.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-purple-600 rounded-xl shadow-lg mb-4">
            <Library className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">DLCF FUTA</h1>
          <p className="text-lg text-slate-600 mt-2">Library Card Generator</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Member Information
            </h2>
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    placeholder="+234..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Reg Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      required
                      type="date"
                      name="regDate"
                      value={formData.regDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Card ID</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      readOnly
                      type="text"
                      name="cardId"
                      value={formData.cardId}
                      className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98]"
              >
                Preview Card
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Live Preview</h2>
                <div className="flex items-center gap-4">
                  {isGenerated && (
                    <button
                      onClick={downloadCard}
                      className="flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  )}
                  <button
                    onClick={resetForm}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    New Card
                  </button>
                </div>
              </div>

              {/* The Card */}
              <div className="relative group">
                <div
                  ref={cardRef}
                  className="w-full aspect-[1.58/1] bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col"
                  style={{ width: '450px' }}
                >
                  {/* Card Header */}
                  <div className="bg-purple-700 p-5 text-center relative overflow-hidden border-b-4 border-purple-900">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/30 rounded-full -mr-24 -mt-24 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-800/40 rounded-full -ml-16 -mb-16 blur-xl" />
                    <h3 className="text-white font-black text-xl tracking-[0.2em] relative z-10 drop-shadow-sm">
                      DLCF FUTA LIBRARY CARD
                    </h3>
                  </div>

                  {/* Card Body - Structured Layout */}
                  <div className="flex-1 p-8 relative bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
                    <div className="grid grid-cols-1 gap-y-4">
                      {/* Name Section - Large and Prominent */}
                      <div className="border-b border-slate-100 pb-2">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-purple-600 font-bold mb-1">Full Name</p>
                        <p className="text-xl font-extrabold text-slate-900 leading-tight">
                          {formData.name || 'FULL NAME HERE'}
                        </p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-0.5">Email Address</p>
                          <p className="text-xs font-semibold text-slate-700 truncate">
                            {formData.email || 'email@example.com'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-0.5">Phone Number</p>
                          <p className="text-xs font-semibold text-slate-700">
                            {formData.phone || '+234 000 000 0000'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-0.5">Registration Date</p>
                          <p className="text-xs font-semibold text-slate-700">{formData.regDate}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-0.5">Card ID Number</p>
                          <p className="text-sm font-mono font-black text-purple-700 tracking-wider">
                            {formData.cardId}
                          </p>
                        </div>
                      </div>

                      {/* Signature and Barcode Area */}
                      <div className="flex justify-between items-end mt-2 pt-4 border-t border-slate-100">
                        <div className="w-1/2">
                          <div className="h-8 border-b border-slate-300 w-full mb-1"></div>
                          <p className="text-[8px] uppercase tracking-[0.15em] text-slate-400 font-bold">Authorized Signature</p>
                        </div>
                        <div className="text-right">
                          <div className="flex gap-[1px] h-6 items-end mb-1">
                            {[...Array(20)].map((_, i) => (
                              <div 
                                key={i} 
                                className="bg-slate-800" 
                                style={{ 
                                  width: i % 3 === 0 ? '2px' : '1px', 
                                  height: `${(Math.sin(i) + 1) * 50}%`,
                                  minHeight: '40%'
                                }} 
                              />
                            ))}
                          </div>
                          <p className="text-[8px] font-mono text-slate-400">{formData.cardId}</p>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute top-8 right-8 opacity-10">
                      <Library className="w-16 h-16 text-purple-900" />
                    </div>
                  </div>

                  {/* Bottom Strip */}
                  <div className="bg-slate-50 border-t-2 border-slate-100 py-3 px-4 text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em]">
                      DLCF FUTA - Library Management System
                    </p>
                  </div>
                </div>
                
                {!isGenerated && (
                  <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-20">
                    <p className="bg-white/90 px-6 py-3 rounded-full text-sm font-bold text-purple-600 shadow-xl border border-purple-100">
                      Fill the form to preview your card
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
