import React from 'react';
import { FiltrosSidebar } from './FiltrosSidebar';
import { FiltrosState } from '../../hooks/useFiltros';

interface FiltrosMobileProps extends Omit<
  React.ComponentProps<typeof FiltrosSidebar>,
  'titulo'
> {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export const FiltrosMobile: React.FC<FiltrosMobileProps> = ({
  isOpen,
  onClose,
  onApply,
  ...sidebarProps
}) => {
  return (
    <>
      <div 
        className={`off-canvas-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      ></div>
      
      <div className={`mobile-filters-container ${isOpen ? 'active' : ''}`}>
        <div className="mobile-filters-header">
          <h3>Filtros</h3>
          <button className="close-filters" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="mobile-filters-content">
          <FiltrosSidebar {...sidebarProps} />
        </div>
        
        <div className="mobile-filters-footer">
          <button className="aplicar-filtros" onClick={onApply}>
            Aplicar Filtros
          </button>
        </div>
      </div>
    </>
  );
};