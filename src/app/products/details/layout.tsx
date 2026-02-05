import '../products.css';
import '../../index.css';
import React from 'react';

export default function ProductDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="details-container">
      <div className="details-card">
        {children}
      </div>
    </section>
  );
}
