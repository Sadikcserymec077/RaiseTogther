import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignApi } from '../api/campaignApi';
import MultiStepForm from '../components/common/MultiStepForm';
import FileUpload from '../components/common/FileUpload';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { CATEGORY_STYLES } from '../components/campaign/CategoryBadge';
import AiAssistPanel from '../components/campaign/AiAssistPanel';

const STEPS = ['Basic Info', 'Story', 'Media', 'Documents', 'Review'];

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    goalAmount: '',
    deadline: '',
    location: '',
    story: '',
  });
  
  const [files, setFiles] = useState({
    thumbnail: null,
    identityDoc: null, // Note: backend handles these separately, we will focus on basic fields for now
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleNext = () => setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formPayload = new FormData();
      
      const campaignBlob = new Blob([JSON.stringify(formData)], { type: 'application/json' });
      formPayload.append('campaign', campaignBlob);
      
      if (files.thumbnail) {
        formPayload.append('thumbnail', files.thumbnail);
      }
      
      if (files.identityDoc) {
        formPayload.append('identityDoc', files.identityDoc);
      }

      const { data } = await campaignApi.createCampaign(formPayload);
      if (data.success) {
        toast.success("Campaign created successfully! Waiting for admin approval.");
        navigate('/my-campaigns');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create campaign");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Input label="Campaign Title *" name="title" value={formData.title} onChange={handleChange} placeholder="Keep it clear and catchy" required />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" required>
                <option value="">Select a category</option>
                {Object.keys(CATEGORY_STYLES).map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_STYLES[cat].label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Goal Amount (₹) *" name="goalAmount" type="number" min="1000" value={formData.goalAmount} onChange={handleChange} required />
              <Input label="Deadline *" name="deadline" type="date" value={formData.deadline} onChange={handleChange} required />
            </div>
            <Input label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="City, State" />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Short Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Brief summary of your campaign (max 250 chars)"></textarea>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Detailed Story *</label>
              <p className="text-xs text-gray-500 mb-2">Tell potential donors why you are raising funds, how the money will be used, and the impact they will make.</p>
              <textarea name="story" value={formData.story} onChange={handleChange} rows={10} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Thumbnail (Cover Image)</label>
               <FileUpload onFileSelect={(f) => setFiles({...files, thumbnail: f})} label="Upload Cover Image" />
            </div>
            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
              Additional images can be uploaded after the campaign is created from the Edit Campaign page.
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
             <div className="py-4">
               <h3 className="text-lg font-medium text-gray-900 mb-2">Identity & Verification</h3>
               <p className="text-gray-500 mb-4">Please upload a valid government ID or verification document for your campaign.</p>
               <FileUpload onFileSelect={(f) => setFiles({...files, identityDoc: f})} label="Upload Verification Document (PDF/JPG)" />
             </div>
             {files.identityDoc && (
               <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm">
                 Document selected: {files.identityDoc.name}
               </div>
             )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
             <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Review Your Campaign</h3>
             <div className="grid grid-cols-2 gap-4 text-sm">
               <div><span className="text-gray-500">Title:</span> <p className="font-medium">{formData.title}</p></div>
               <div><span className="text-gray-500">Category:</span> <p className="font-medium">{formData.category}</p></div>
               <div><span className="text-gray-500">Goal Amount:</span> <p className="font-medium">₹{formData.goalAmount}</p></div>
               <div><span className="text-gray-500">Deadline:</span> <p className="font-medium">{formData.deadline}</p></div>
               <div><span className="text-gray-500">Location:</span> <p className="font-medium">{formData.location}</p></div>
               <div className="col-span-2">
                 <span className="text-gray-500">Cover Image:</span>
                 <p className="font-medium">{files.thumbnail ? files.thumbnail.name : 'None selected'}</p>
               </div>
             </div>
          </div>
        );
      default: return null;
    }
  };

  const isStepValid = () => {
    if (currentStep === 0) return formData.title && formData.category && formData.goalAmount && formData.deadline && formData.description;
    if (currentStep === 1) return formData.story.length > 20;
    return true;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Start a Campaign</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Let's get your fundraiser set up in just a few steps.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
            <MultiStepForm steps={STEPS} currentStep={currentStep}>
              
              <div className="mt-6 sm:mt-8 min-h-[260px]">
                 {renderStep()}
              </div>

              <div className="mt-8 sm:mt-10 flex justify-between pt-6 border-t border-gray-100">
                <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
                  Back
                </Button>
                
                {currentStep < STEPS.length - 1 ? (
                  <Button onClick={handleNext} disabled={!isStepValid()}>
                    Next Step
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} isLoading={isLoading}>
                    Submit for Review
                  </Button>
                )}
              </div>
              
            </MultiStepForm>
          </div>
        </div>
        
        {/* AI Panel - shows BELOW on mobile, RIGHT on desktop */}
        <div className="lg:col-span-1 order-first lg:order-none">
           <AiAssistPanel 
             campaignData={formData} 
             onApplySuggestion={(field, value) => setFormData({...formData, [field]: value})} 
           />
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
