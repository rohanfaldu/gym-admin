import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, User, Phone, Shield, Building } from 'lucide-react';
import { gyms } from '../data/gyms';

const MemberSignup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const gymId = searchParams.get('gym');
  const selectedGym = gymId ? gyms.find(g => g.id === gymId) : null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    otp: '',
    gymCode: gymId || ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.mobile) {
      setOtpSent(true);
      setStep(2);
      // Simulate OTP sending
      setTimeout(() => {
        alert('OTP sent to your mobile number!');
      }, 500);
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp) {
      setStep(3);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.gymCode) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-sm p-8 text-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <CheckCircle className="h-10 w-10 text-black" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">Request Sent Successfully!</h1>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your access request has been sent to {selectedGym ? selectedGym.name : 'the gym'}. 
              They will contact you shortly to complete your membership.
            </p>
            
            <div className="bg-gray-800 border border-cyan-500/30 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-cyan-400 mb-2">What's Next?</h3>
              <ul className="text-gray-300 text-sm space-y-1 text-left">
                <li>• Gym will verify your request</li>
                <li>• You'll receive a call within 24 hours</li>
                <li>• Complete your membership setup</li>
                <li>• Start your fitness journey!</li>
              </ul>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Link
                to="/marketplace"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
              >
                Explore More Gyms
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={selectedGym ? `/gym/${selectedGym.id}` : '/marketplace'}
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className={`flex items-center ${stepNumber < 3 ? 'flex-1' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                  step >= stepNumber 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-black shadow-lg shadow-cyan-500/30' 
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step > stepNumber ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-gray-800'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>Personal Info</span>
            <span>Verify OTP</span>
            <span>Gym Selection</span>
          </div>
        </div>

        {/* Selected Gym Info */}
        {selectedGym && (
          <div className="bg-gray-800 border border-cyan-500/30 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-cyan-400 mb-2">Selected Gym</h3>
            <div className="flex items-center space-x-3">
              <img
                src={selectedGym.image}
                alt={selectedGym.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium text-white">{selectedGym.name}</p>
                <p className="text-gray-300 text-sm">{selectedGym.location}, {selectedGym.city}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Steps */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-sm p-8">
          {step === 1 && (
            <form onSubmit={handleSendOTP}>
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
                  <User className="h-8 w-8 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
                <p className="text-gray-300">Enter your details to get started</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your mobile number"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                >
                  Send OTP
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                  <Shield className="h-8 w-8 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
                <p className="text-gray-300">
                  We've sent a verification code to {formData.mobile}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Enter OTP *
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    required
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-center text-lg font-mono placeholder-gray-400"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 px-4 rounded-lg font-medium transition-colors duration-200 border border-gray-700"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                  >
                    Verify OTP
                  </button>
                </div>

                <button
                  type="button"
                  className="w-full text-cyan-400 hover:text-cyan-300 text-sm transition-colors duration-200"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleFinalSubmit}>
              <div className="text-center mb-8">
               <div className="bg-gradient-to-r from-orange-500 to-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
                 <Building className="h-8 w-8 text-black" />
                </div>
               <h2 className="text-2xl font-bold text-white mb-2">Select Gym</h2>
               <p className="text-gray-300">Choose the gym you want to join</p>
              </div>

              <div className="space-y-6">
                <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gym Code *
                  </label>
                  <select
                    name="gymCode"
                    value={formData.gymCode}
                    onChange={handleInputChange}
                    required
                   className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                  >
                    <option value="">Select a gym</option>
                    {gyms.map((gym) => (
                      <option key={gym.id} value={gym.id}>
                        {gym.name} - {gym.location}, {gym.city}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.gymCode && (
                 <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    {(() => {
                      const selectedGymData = gyms.find(g => g.id === formData.gymCode);
                      return selectedGymData ? (
                        <div className="flex items-center space-x-3">
                          <img
                            src={selectedGymData.image}
                            alt={selectedGymData.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                             <p className="font-medium text-white">{selectedGymData.name}</p>
                             <p className="text-gray-300 text-sm">{selectedGymData.location}, {selectedGymData.city}</p>
                             <p className="text-cyan-400 text-sm">{selectedGymData.priceRange} • {selectedGymData.category}</p>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 px-4 rounded-lg font-medium transition-colors duration-200 border border-gray-700"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberSignup;