import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: '.dashboard-hero',
    title: 'Welcome to VendorLink Demo! 🎉',
    description: 'This is your fully functional dashboard! Everything works just like the real app - add inventory, connect with suppliers, and explore all features.',
    position: 'bottom'
  },
  {
    target: '.summary-tiles',
    title: 'Live Business Metrics 📊',
    description: 'These tiles show real-time data! Click any tile to dive deeper. All numbers update as you interact with the demo.',
    position: 'top'
  },
  {
    target: '.floating-action-button',
    title: 'Powerful Quick Actions ⚡',
    description: 'Click this button to access all major features instantly! Add inventory, post surplus deals, or find new suppliers - everything is fully functional.',
    position: 'left'
  },
  {
    target: '.notification-bell',
    title: 'Live Notifications 🔔',
    description: 'Real notifications! Accept supplier requests, manage inventory alerts, and track all your business activities in real-time.',
    position: 'bottom'
  }
];

interface GuidedTourProps {
  isVisible: boolean;
  onComplete: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ isVisible, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isVisible) return null;

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onComplete();
  };

  const currentStepData = tourSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[100]" />
      
      {/* Tour tooltip */}
      <div className="fixed z-[101] bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-sm animate-fade-in">
        <div className="absolute top-4 right-4">
          <button
            onClick={skipTour}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {currentStepData.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                  index === currentStep ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-2">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back</span>
              </button>
            )}
            
            <button
              onClick={nextStep}
              className="flex items-center space-x-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
            >
              <span className="text-sm">
                {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
              </span>
              {currentStep < tourSteps.length - 1 && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style> */}
    </>
  );
};