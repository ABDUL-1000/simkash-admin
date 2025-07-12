"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ResponsiveModal } from "../mobileDrawer";
import { Label } from "@radix-ui/react-label";
import { CheckCircle } from "lucide-react"; // Import icon

interface FieldGroup {
  type: "group";
  layout: "horizontal" | "vertical";
  fields: {
    type: "input" | "select" | "select-button";
    label: string;
    placeholder: string;
    options?: { value: string; label: string }[];
    className?: string;
  }[];
}

interface SingleField {
  type: "input" | "select" | "select-button";
  label: string;
  placeholder: string;
  options?: { value: string; label: string }[];
  className?: string;
}

type Field = SingleField | FieldGroup;

interface SimkashModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subTitle:string,
  fields?: Field[]; // Made optional for success modal
  onSubmit?: (data: Record<string, string>) => void; // Made optional
  submitButton?: React.ReactNode;
  submitButtonClassName?: string;
  successMode?: boolean; // New prop for success mode
  successIcon?: React.ReactNode; // Custom icon
  successMessage?: string; // Success message content
  successActions?: { // Actions/buttons for success mode
    label: string;
    onClick: () => void;
    variant?: "default" | "outline";
  }[];
}

export function ReusableModal({
  isOpen,
  onClose,
  title,
  subTitle,
  fields = [],
  onSubmit = () => {},
  submitButton,
  submitButtonClassName = "",
  successMode = false,
  successIcon = <CheckCircle className="w-12 h-12 text-green-500" />,
  successMessage = "Operation completed successfully",
  successActions = [
    { label: "Go to Dashboard", onClick: onClose, variant: "default" },
    { label: "Add Another", onClick: onClose, variant: "outline" }
  ],
}: SimkashModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field: SingleField) => {
    switch (field.type) {
      case "input":
        return (
          <Input
            placeholder={field.placeholder}
            className={`border-[#E5E5E5] bg-white rounded-md py-1 px-3 w-full ${field.className || ""}`}
            onChange={(e) =>
              setFormData({ ...formData, [field.label]: e.target.value })
            }
          />
        );
      case "select":
        return (
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, [field.label]: value })
            }
          >
            <SelectTrigger className={`border-[#E5E5E5] bg-white rounded-md py-1 px-3 w-full ${field.className || ""}`}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "select-button":
        return (
          <div className="flex gap-1">
            {field.options?.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={formData[field.label] === option.value ? "default" : "outline"}
                className={`transition-colors ${
                  formData[field.label] === option.value 
                    ? "bg-[#132939] text-white" 
                    : "border-[#E5E5E5] text-[#4D4D4D] hover:bg-gray-50"
                } ${field.className || ""}`}
                onClick={() =>
                  setFormData({ ...formData, [field.label]: option.value })
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subTitle={subTitle}
      className="max-w-md"
    >
      {successMode ? (
        <div className="flex flex-col items-center text-center space-y-6 p-4">
          {/* Success Icon */}
          <div className="p-4">
            {successIcon}
          </div>
          
          {/* Success Message */}
          <h3 className="text-lg font-medium text-[#132939]">{title}</h3>
          <h3 className="text-lg font-medium text-[#132939]">{subTitle}</h3>
          <p className="text-[#4D4D4D]">{successMessage}</p>
          
          {/* Success Actions */}
          <div className="flex flex-col w-full space-y-3 pt-4">
            {successActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant}
                className={`w-full ${
                  action.variant === "default" 
                    ? "bg-[#132939] hover:bg-[#1a3a53] text-white" 
                    : "border-[#E5E5E5] text-[#4D4D4D] hover:bg-gray-50"
                }`}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Original form fields */}
          {fields.map((field, index) => (
            <div key={index} className="space-y-2">
              {field.type === "group" ? (
                <div className={`lg:flex ${field.layout === "horizontal" ? "flex-row gap-4" : "flex-col gap-1"}`}>
                  {field.fields.map((subField, subIndex) => (
                    <div key={subIndex} className={`:flex-1 ${subField.className || ""}`}>
                      <Label className="block text-sm font-medium text-[#4D4D4D]">
                        {subField.label}
                      </Label>
                      {renderField(subField)}
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <Label className="block text-sm font-medium text-[#4D4D4D]">
                    {field.label}
                  </Label>
                  {renderField(field)}
                </>
              )}
            </div>
          ))}

          {/* Footer buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            {submitButton ? (
              submitButton
            ) : (
              <Button
                type="submit"
                className={`bg-[#D7EFF6] text-[#60B3D1] w-full ${submitButtonClassName}`}
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      )}
    </ResponsiveModal>
  );
}