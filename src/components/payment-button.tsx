
"use client";

import React, { useEffect, useRef } from 'react';

interface PaymentButtonProps {
  htmlForm: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ htmlForm }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';
    
    // Create a temporary div to parse the HTML string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlForm;

    // Find the script and form elements
    const scriptElement = tempDiv.querySelector('script');
    const formElement = tempDiv.querySelector('form');

    if (formElement) {
        // Append the form to the container
        container.appendChild(formElement);
    }
    
    if (scriptElement) {
      // Re-create the script element to ensure it executes
      const newScript = document.createElement('script');
      // Copy all attributes from the original script
      for (let i = 0; i < scriptElement.attributes.length; i++) {
        const attr = scriptElement.attributes[i];
        newScript.setAttribute(attr.name, attr.value);
      }
      
      // Append the new script to the container to trigger execution
      container.appendChild(newScript);
    }

  }, [htmlForm]);

  return <div ref={containerRef} />;
};

export { PaymentButton };
