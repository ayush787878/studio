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

      // The main script that needs to be handled separately
      const scriptNode = fragment.querySelector('script');

      // Append all non-script elements first (like the form and style)
      container.appendChild(fragment);

      // If a script tag was found, create a new script element and append it
      if (scriptNode) {
        const script = document.createElement('script');
        script.src = scriptNode.src;
        // Copy data attributes like 'data-payment_button_id'
        for (const attr of scriptNode.attributes) {
            script.setAttribute(attr.name, attr.value);
        }
        if (scriptNode.hasAttribute('async')) {
            script.async = true;
        }
        
        // It's important to append the script to the body or head for it to be executed
        document.body.appendChild(script);

        // Cleanup the script when the component unmounts
        return () => {
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
        };
      }
    }
  }, [formHtml]);

  return <div ref={containerRef} />;
};

export { PaymentButton };
