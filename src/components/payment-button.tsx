
"use client";

import React, { useEffect, useRef } from 'react';

interface PaymentButtonProps {
  formHtml: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ formHtml }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.innerHTML = formHtml;
      
      const script = container.querySelector('script');
      if (script) {
        const newScript = document.createElement('script');
        newScript.src = script.src;
        for (const attr of script.attributes) {
          newScript.setAttribute(attr.name, attr.value);
        }
        if (script.hasAttribute('async')) {
            newScript.async = true;
        }
        
        script.parentNode?.replaceChild(newScript, script);
      }
    }
  }, [formHtml]);

  return <div ref={containerRef} />;
};

export { PaymentButton };
