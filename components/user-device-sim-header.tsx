"use client";

import { useState } from "react";
import { ModalForm } from "./modal-form";
import { PageHeader } from "./page-header";

export function SimManagement() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSubmit = async (data: Record<string, string>) => {
    console.log("Product:", data);
    return { success: true };
  };



  return (
    <div>
      <PageHeader
        title="Your Partner:"
        subtitle="You don't have partner yet"
        onAddClick={() => setIsOpen(true)}
        addLabel="Request SIM"
      />
  
    </div>
  );
}