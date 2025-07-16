
"use client";

import React, { useEffect, useRef } from 'react';

interface PaymentButtonProps {
  formHtml: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ formHtml }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.innerHTML = ''; // Clear previous content

      const template = document.createElement('template');
      template.innerHTML = formHtml.trim();
      const fragment = template.content;

      // Find the script node within the fragment
      const scriptNode = fragment.querySelector('script');
      
      // Remove the script from the fragment before appending the rest
      if (scriptNode) {
        scriptNode.remove();
      }

      // Append the HTML part (form, style, etc.)
      container.appendChild(fragment);

      // If a script tag was found, create a new script element and append it to the container
      if (scriptNode) {
        const script = document.createElement('script');
        script.src = scriptNode.src;
        
        // Copy all attributes from the original script to the new one
        for (const attr of scriptNode.attributes) {
            script.setAttribute(attr.name, attr.value);
        }
        if (scriptNode.hasAttribute('async')) {
            script.async = true;
        }
        
        // Append the script to the container so it executes in the right context
        container.appendChild(script);

        // Cleanup the script when the component unmounts
        return () => {
          if (container.contains(script)) {
            container.removeChild(script);
          }
        };
      }
    }
  }, [formHtml]);

  return <div ref={containerRef} />;
};

export { PaymentButton };
