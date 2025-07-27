// components/FloatingActionButton.tsx
import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onAddInventory: () => void;
  onPostSurplus: () => void;
  onFindSupplier: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onAddInventory,
  onPostSurplus,
  onFindSupplier
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
      {/* Main FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#6200ea',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
        }}
      >
        <Plus size={24} />
      </button>

      {/* Menu items */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '70px',
          right: '0',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 999,
        }}>
          <button
            onClick={() => {
              onAddInventory();
              setIsOpen(false);
            }}
            style={{
              width: '120px',
              padding: '8px 16px',
              borderRadius: '24px',
              backgroundColor: '#6200ea',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Plus size={16} />
            Add Inventory
          </button>

          <button
            onClick={() => {
              onPostSurplus();
              setIsOpen(false);
            }}
            style={{
              width: '120px',
              padding: '8px 16px',
              borderRadius: '24px',
              backgroundColor: '#6200ea',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Plus size={16} />
            Post Surplus
          </button>

          <button
            onClick={() => {
              onFindSupplier();
              setIsOpen(false);
            }}
            style={{
              width: '120px',
              padding: '8px 16px',
              borderRadius: '24px',
              backgroundColor: '#6200ea',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Plus size={16} />
            Find Supplier
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingActionButton;