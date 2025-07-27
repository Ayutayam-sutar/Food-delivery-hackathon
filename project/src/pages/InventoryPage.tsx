import { useState } from 'react';
import { Package, Plus, Edit, Trash2, AlertTriangle, TrendingDown, Bell, ShoppingCart } from 'lucide-react';

// Type definitions
interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  threshold: number;
  unit: string;
  price: number;
  image: string;
  lastUpdated: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string;
}

interface AppState {
  inventory: InventoryItem[];
  user: User | null;
}

interface InventoryPageProps {
  state?: AppState;
  onUpdateInventory?: (inventory: InventoryItem[]) => void;
}

export function InventoryPage({ state, onUpdateInventory }: InventoryPageProps) {
  // Default state with proper typing
  const defaultState: AppState = {
    inventory: [
      {
        id: '1',
        name: 'Rice',
        quantity: 15,
        threshold: 20,
        unit: 'kg',
        price: 45,
        image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=400',
        lastUpdated: new Date()
      },
      {
        id: '2',
        name: 'Wheat Flour',
        quantity: 8,
        threshold: 15,
        unit: 'kg',
        price: 35,
        image: 'https://images.pexels.com/photos/4110253/pexels-photo-4110253.jpeg?auto=compress&cs=tinysrgb&w=400',
        lastUpdated: new Date()
      },
      {
        id: '3',
        name: 'Tomatoes',
        quantity: 25,
        threshold: 10,
        unit: 'kg',
        price: 40,
        image: 'https://images.pexels.com/photos/533282/pexels-photo-533282.jpeg?auto=compress&cs=tinysrgb&w=400',
        lastUpdated: new Date()
      }
    ],
    user: null
  };

  const currentState = state || defaultState;
  const [inventory, setInventory] = useState<InventoryItem[]>(currentState.inventory);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 0,
    threshold: 0,
    unit: 'kg',
    price: 0,
    image: ''
  });

  // Business name with safe access
  const businessName = currentState.user?.businessName || 'My Business';

  const handleAddItem = () => {
    const item: InventoryItem = {
      id: Date.now().toString(),
      ...newItem,
      image: newItem.image || '',
      lastUpdated: new Date()
    };
    const updatedInventory = [...inventory, item];
    setInventory(updatedInventory);
    onUpdateInventory?.(updatedInventory);
    setNewItem({ name: '', quantity: 0, threshold: 0, unit: 'kg', price: 0, image: '' });
    setShowAddModal(false);
    
    setTimeout(() => {
      alert('✅ Item added successfully to your inventory!');
    }, 100);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    
    const updatedInventory = inventory.map(item =>
      item.id === editingItem.id
        ? { ...editingItem, lastUpdated: new Date() }
        : item
    );
    setInventory(updatedInventory);
    onUpdateInventory?.(updatedInventory);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    const updatedInventory = inventory.filter(item => item.id !== id);
    setInventory(updatedInventory);
    onUpdateInventory?.(updatedInventory);
  };

  const handleQuickRestock = (item: InventoryItem) => {
    const restockAmount = item.threshold * 2;
    const updatedInventory = inventory.map(inventoryItem =>
      inventoryItem.id === item.id
        ? { 
            ...inventoryItem, 
            quantity: inventoryItem.quantity + restockAmount, 
            lastUpdated: new Date() 
          }
        : inventoryItem
    );
    setInventory(updatedInventory);
    onUpdateInventory?.(updatedInventory);
    alert(`✅ ${item.name} restocked! Added ${restockAmount} ${item.unit}`);
  };

  const lowStockItems = inventory.filter(item => item.quantity <= item.threshold);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
          <p className="text-gray-600">{businessName}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {lowStockItems.length > 0 && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-1 rounded-xl shadow-lg">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Bell className="text-red-500 w-8 h-8" />
                  <div>
                    <h3 className="text-2xl font-bold text-red-600 flex items-center gap-2">
                      🚨 LOW STOCK ALERT
                    </h3>
                    <p className="text-gray-600 font-medium">
                      {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} need attention
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-bold text-lg shadow-md">
                    {lowStockItems.length} Alert{lowStockItems.length > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowStockItems.map(item => (
                  <div key={item.id} className="bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-lg text-red-800 flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                        {item.name}
                      </h4>
                      <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        LOW
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Current:</span>
                        <span className="font-bold text-red-600 text-lg">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Threshold:</span>
                        <span className="font-bold text-orange-600">
                          {item.threshold} {item.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full"
                          style={{ 
                            width: `${Math.min((item.quantity / Math.max(item.threshold * 2, 1)) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-1"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleQuickRestock(item)}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-1"
                      >
                        <ShoppingCart size={14} />
                        Quick Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            <div className="space-y-1 text-gray-600">
              <p>Quantity: {item.quantity} {item.unit}</p>
              <p>Threshold: {item.threshold} {item.unit}</p>
              <p>Price: ₹{item.price}</p>
              <p className="text-sm">Last Updated: {item.lastUpdated.toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setEditingItem(item)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded flex items-center justify-center gap-1 hover:bg-blue-700"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded flex items-center justify-center gap-1 hover:bg-red-700"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Quantity *
                </label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Low Stock Threshold *
                </label>
                <input
                  type="number"
                  placeholder="Alert threshold"
                  value={newItem.threshold}
                  onChange={(e) => setNewItem({...newItem, threshold: Number(e.target.value)})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="lbs">Pounds (lbs)</option>
                  <option value="pieces">Pieces</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Unit *
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="Enter image URL"
                  value={newItem.image}
                  onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddItem}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Item
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Quantity *
                </label>
                <input
                  type="number"
                  value={editingItem.quantity}
                  onChange={(e) => setEditingItem({...editingItem, quantity: Number(e.target.value)})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Low Stock Threshold *
                </label>
                <input
                  type="number"
                  value={editingItem.threshold}
                  onChange={(e) => setEditingItem({...editingItem, threshold: Number(e.target.value)})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  value={editingItem.unit}
                  onChange={(e) => setEditingItem({...editingItem, unit: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="lbs">Pounds (lbs)</option>
                  <option value="pieces">Pieces</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Unit *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateItem}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}