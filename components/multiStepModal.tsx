"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { ReactNode, useState } from "react";

interface StepConfig {
  title: string;
  content: ReactNode;
  validate?: () => boolean;
}

interface MultiStepModalProps {
  open: boolean;
  onClose: () => void;
  modalTitle: string;
  steps: StepConfig[];
  successContent?: ReactNode;
  bgColor?: string;
  icon?: ReactNode;
}

const MultiStepModal: React.FC<MultiStepModalProps> = ({
  open,
  onClose,
  modalTitle,
  steps,
  successContent,
  bgColor = "bg-white",
  icon
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.length;

  const onNext = () => {
    const valid = steps[currentStep].validate?.() ?? true;
    if (!valid) return;
    setCurrentStep((prev) => prev + 1);
  };

  const onBack = () => setCurrentStep((prev) => prev - 1);
  const onReset = () => {
    setCurrentStep(0);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onReset}>
      <DialogContent className={`max-w-md ${bgColor}`}>
        <div className="flex items-center justify-between">
          <div className="w-1/3">
            {currentStep > 0 && currentStep < totalSteps && (
              <button onClick={onBack} className="flex items-center text-sm text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </button>
            )}
          </div>
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>
          <div className="w-1/3" />
        </div>

        {/* Step Progress Indicator */}
        <div className="flex items-center gap-2 justify-end mt-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-6 h-1 ${
                currentStep >= index ? "bg-[#24C0FF]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Step Title */}
        <h2 className="text-lg font-semibold mt-6 text-center">
          {currentStep < totalSteps ? steps[currentStep].title : ""}
        </h2>

        {/* Optional Icon */}
        {icon && <div className="flex justify-center mt-4">{icon}</div>}

        {/* Content */}
        <div className="mt-6 space-y-4">
          {currentStep < totalSteps ? steps[currentStep].content : successContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiStepModal;
