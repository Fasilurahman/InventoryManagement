import React from 'react';

interface FormStepProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const FormStep: React.FC<FormStepProps> = ({ title, description, children }) => {
  return (
    <div className="[animation:fadeIn_0.5s_ease-out_forwards]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {description && <p className="text-white/70 text-sm mt-1">{description}</p>}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
      <style>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default FormStep;