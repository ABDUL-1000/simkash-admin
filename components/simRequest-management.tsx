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

  const steps = [
    {
      title: "Add New Sim",
      fields: [
        {
          id: "name",
          label: "Product Name",
          type: "text" as const,
          required: true,
          placeholder: "Enter product name",
        },
        {
          id: "category",
          label: "Category",
          type: "select" as const,
          options: [
            { value: "Electronics", label: "Electronics" },
            { value: "Fashion", label: "Fashion" },
            { value: "Home", label: "Home" }
          ],
          required: true,
        },
        {
          id: "price",
          label: "Price",
          type: "currency" as const,
          placeholder: "Enter price",
          required: true,
        },
        {
          id: "stock",
          label: "Stock",
          type: "text" as const,
          placeholder: "How many units?",
          required: true,
        },
      ],
      submitLabel: "Add Product"
    }
  ];

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