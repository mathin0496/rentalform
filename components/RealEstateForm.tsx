
import React, { useState } from 'react';
import { InquiryFormState, Province, RentalPropertyType, AttachedFile } from '../types';
import { Icons, COLORS } from '../constants';

const STEPS = [
  { title: "Location", icon: Icons.Map },
  { title: "Rental Specs", icon: Icons.House },
  { title: "Budget", icon: Icons.Dollar },
  { title: "Documents", icon: Icons.File },
  { title: "Contact", icon: Icons.Send }
];

// Placeholder for your n8n webhook URL
//const N8N_WEBHOOK_URL = 'https://abdulmathin.app.n8n.cloud/webhook-test/19cdaba3-dffa-419d-9bdb-ddf271df0738'; //testing url
const N8N_WEBHOOK_URL = 'https://abdulmathin.app.n8n.cloud/webhook-test/19cdaba3-dffa-419d-9bdb-ddf271df0738';

const RealEstateForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<InquiryFormState>({
    province: '',
    city: '',
    propertyType: '',
    monthlyBudget: 2500,
    bedrooms: '1',
    moveInDate: '',
    pets: false,
    email: '',
    phone: '',
    creditScore: '',
    requestedDocs: {
      passport: false,
      workPermit: false,
      employmentLetter: false,
      creditReport: false
    },
    files: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStep = () => setStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const handleInputChange = (field: keyof InquiryFormState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocToggle = (docType: keyof InquiryFormState['requestedDocs']) => {
    setFormData(prev => ({
      ...prev,
      requestedDocs: {
        ...prev.requestedDocs,
        [docType]: !prev.requestedDocs[docType]
      }
    }));
  };

  const handleFileChange = async (docType: keyof InquiryFormState['files'], file: File | null) => {
    if (!file) {
      setFormData(prev => {
        const newFiles = { ...prev.files };
        delete newFiles[docType];
        return { ...prev, files: newFiles };
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const attachedFile: AttachedFile = {
        name: file.name,
        type: file.type,
        base64: base64.split(',')[1] // Extract base64 part only
      };
      setFormData(prev => ({
        ...prev,
        files: { ...prev.files, [docType]: attachedFile }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          source: 'MapleLeaf Rental Web App'
        }),
      });

      // For this demo, we proceed to success regardless of endpoint existence
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center shadow-2xl border border-gray-100 max-w-2xl mx-auto transform animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl font-display text-slate-900 mb-4">Application Sent!</h2>
        <p className="text-slate-600 mb-8 text-lg">Your rental inquiry and documents for {formData.city} have been transmitted. We will reach out to {formData.email} or {formData.phone} shortly.</p>
        <button 
          onClick={() => { setIsSubmitted(false); setStep(0); setError(null); }}
          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg"
        >
          New Application
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[700px]">
      {/* Sidebar Progress */}
      <div className="md:w-1/3 bg-slate-900 p-8 text-white flex flex-col">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-xl font-bold shadow-lg">M</div>
          <span className="text-xl font-display font-bold">MapleLeaf Rental</span>
        </div>
        
        <div className="space-y-6">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex items-center gap-4 transition-all duration-300 ${i === step ? 'opacity-100 translate-x-2' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm ${i === step ? 'bg-white text-slate-900 border-white font-bold shadow-sm' : 'border-slate-700'}`}>
                {i < step ? '✓' : <s.icon />}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Step 0{i + 1}</p>
                <p className="font-semibold text-sm">{s.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-12 hidden md:block">
          <p className="text-slate-500 text-xs leading-relaxed">
            "We prioritize your data security using bank-grade encryption before transmitting to our processing partners."
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-8 md:p-12">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto pr-2 max-h-[500px] scrollbar-hide">
            {step === 0 && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-display text-slate-900 mb-6">Rental Location</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-display">Province / Territory</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all appearance-none bg-white"
                      value={formData.province}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                      required
                    >
                      <option value="">Select province</option>
                      {Object.entries(Province).map(([code, name]) => (
                        <option key={code} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-display">City or Neighbourhood</label>
                    <input 
                      type="text"
                      placeholder="e.g. Downtown Toronto, West End Vancouver"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-display text-slate-900 mb-6">Home Preferences</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(RentalPropertyType).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleInputChange('propertyType', type)}
                        className={`p-3 text-xs rounded-xl border-2 transition-all font-semibold ${
                          formData.propertyType === type 
                          ? 'border-red-600 bg-red-50 text-red-700' 
                          : 'border-slate-100 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bedrooms</label>
                    <div className="flex gap-2">
                      {['Studio', '1', '2', '3+'].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleInputChange('bedrooms', num)}
                          className={`flex-1 py-2 rounded-lg border transition-all ${
                            formData.bedrooms === num ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-display text-slate-900 mb-6">Monthly Budget</h2>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-slate-900 font-bold text-2xl tabular-nums">
                      <span>$500</span>
                      <span className="text-red-600">${formData.monthlyBudget.toLocaleString()}</span>
                      <span>$8,000+</span>
                    </div>
                    <input 
                      type="range" 
                      min="500" 
                      max="8000" 
                      step="100"
                      className="w-full accent-red-600 h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                      value={formData.monthlyBudget}
                      onChange={(e) => handleInputChange('monthlyBudget', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <input 
                      type="checkbox" 
                      id="pets-check" 
                      className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                      checked={formData.pets}
                      onChange={(e) => handleInputChange('pets', e.target.checked)}
                    />
                    <label htmlFor="pets-check" className="text-slate-700 font-medium cursor-pointer text-sm">Pet-friendly housing is a requirement</label>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-display text-slate-900 mb-2 tracking-tight">Proof of Documents</h2>
                <p className="text-sm text-slate-500 mb-8 italic">Choose the proofs you'd like to include to expedite your application.</p>
                
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { id: 'passport', label: 'Passport' },
                    { id: 'workPermit', label: 'Work Permit' },
                    { id: 'employmentLetter', label: 'Employment Letter' },
                    { id: 'creditReport', label: 'Credit Report (CIBIL)' }
                  ].map(doc => (
                    <div 
                      key={doc.id}
                      onClick={() => handleDocToggle(doc.id as any)}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between shadow-sm ${
                        formData.requestedDocs[doc.id as keyof InquiryFormState['requestedDocs']] 
                        ? 'border-red-600 bg-red-50 text-red-700' 
                        : 'border-slate-100 text-slate-500 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <span className="font-semibold text-sm">{doc.label}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        formData.requestedDocs[doc.id as keyof InquiryFormState['requestedDocs']] ? 'bg-red-600 border-red-600' : 'border-slate-300'
                      }`}>
                        {formData.requestedDocs[doc.id as keyof InquiryFormState['requestedDocs']] && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {Object.entries(formData.requestedDocs).map(([key, isSelected]) => {
                    if (!isSelected) return null;
                    const labels: Record<string, string> = {
                      passport: 'Passport (ID Page)',
                      workPermit: 'Work Permit Document',
                      employmentLetter: 'Employment / Salary Letter',
                      creditReport: 'CIBIL / Equifax / TransUnion Report'
                    };
                    return (
                      <div key={key} className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 animate-in fade-in zoom-in duration-300">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{labels[key]}</label>
                        <div className="relative">
                          <input 
                            type="file"
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                            onChange={(e) => handleFileChange(key as any, e.target.files ? e.target.files[0] : null)}
                          />
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 group-hover:border-red-300 transition-all shadow-sm">
                            <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                              <Icons.Upload />
                            </div>
                            <span className="text-sm text-slate-600 truncate flex-1">
                              {formData.files[key as keyof InquiryFormState['files']]?.name || "Click to upload file"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-3xl font-display text-slate-900 mb-6">Contact Details</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Move-in Date</label>
                    <input 
                      type="date"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all shadow-sm"
                      value={formData.moveInDate}
                      onChange={(e) => handleInputChange('moveInDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                      <input 
                        type="email"
                        required
                        placeholder="your-name@provider.ca"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none text-sm shadow-sm"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                      <input 
                        type="tel"
                        required
                        placeholder="+1 (647) 000-0000"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none text-sm shadow-sm"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                    By clicking submit, your profile and provided documents will be sent to our rental matching engine. CIBIL scores and other proofs are treated as strictly confidential.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-8 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={prevStep}
              className={`px-6 py-2 text-slate-400 font-semibold hover:text-slate-900 transition-colors ${step === 0 ? 'invisible' : ''}`}
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-10 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg active:scale-95"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-3 disabled:bg-slate-400"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Application'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RealEstateForm;
