import React, { useState } from 'react';

const Inventory = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Product A', stock: 50, threshold: 20, cost: 10 },
    { id: 2, name: 'Product B', stock: 10, threshold: 15, cost: 15 },
    { id: 3, name: 'Another Product', stock: 30, threshold: 10, cost: 5 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newProducts, setNewProducts] = useState([{ name: '', stock: '', threshold: '', cost: '' }]);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddProductRow = () => {
    setNewProducts([...newProducts, { name: '', stock: '', threshold: '', cost: '' }]);
  };

  const handleNewProductChange = (index, field, value) => {
    const updatedProducts = [...newProducts];
    updatedProducts[index][field] = value;
    setNewProducts(updatedProducts);
  };

  const handleDeleteNewProductRow = (indexToDelete) => {
    const updatedProducts = newProducts.filter((_, index) => index !== indexToDelete);
    setNewProducts(updatedProducts);
  };

  const saveNewProducts = () => {
    const newIdStart = products.length > 0 ? products[products.length - 1].id : 0;
    const productsWithIds = newProducts.map((product, index) => ({
      ...product,
      id: newIdStart + index + 1,
    }));
    setProducts([...products, ...productsWithIds]);
    setNewProducts([{ name: '', stock: '', threshold: '', cost: '' }]);
    setShowModal(false);
  };

  const handleEditChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleDeleteRow = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const positiveButtonStyle = {
    backgroundColor: '#4caf50', 
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px'
  };

  const negativeButtonStyle = {
    backgroundColor: '#e53935', 
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px'
  };

  const searchInputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #4caf50',  // green border
    fontSize: '16px',
    width: '300px',               // bigger width
    transition: 'border-color 0.3s ease, background-color 0.3s ease',
    backgroundColor: '#ffffff',   // white background by default
    color: '#2e7d32',             // dark green text
  };

  const handleSearchFocus = (e) => {
    e.target.style.borderColor = '#2e7d32';    // darker green border on focus
    e.target.style.backgroundColor = '#e8f5e9'; // light green background on focus
  };

  const handleSearchBlur = (e) => {
    e.target.style.borderColor = '#4caf50';
    e.target.style.backgroundColor = '#ffffff';
  };

  return (
    <div
      style={{
        minHeight: '1vh',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '0px 20px 20px', 
        boxSizing: 'border-box',
      }}
    >
      <h2 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        color: '#2e7d32', 
        marginBottom: '20px' 
      }}>
        Inventory
      </h2>

      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowModal(true)} style={positiveButtonStyle}>
            Add Products
          </button>
          <button onClick={toggleEditMode} style={negativeButtonStyle}>
            {editMode ? 'Exit Edit Mode' : 'Edit Inventory'}
          </button>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
        </div>
      </div>

      <div 
        style={{ 
          maxHeight: '50vh', 
          overflowY: 'auto', 
          border: '1px solid #ccc', 
          borderRadius: '4px',
          padding: '10px',
          backgroundColor: '#f1f8e9' 
        }}
      >
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#a5d6a7' }}>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Product</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Stock</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Threshold</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Cost</th>
              {editMode && <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product.id} style={{ backgroundColor: '#c8e6c9' }}>
                {editMode ? (
                  <>
                    <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => handleEditChange(index, 'name', e.target.value)}
                        style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                      <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => handleEditChange(index, 'stock', e.target.value)}
                        style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                      <input
                        type="number"
                        value={product.threshold}
                        onChange={(e) => handleEditChange(index, 'threshold', e.target.value)}
                        style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                      <input
                        type="number"
                        value={product.cost}
                        onChange={(e) => handleEditChange(index, 'cost', e.target.value)}
                        style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                      />
                    </td>
                    <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                      <button onClick={() => handleDeleteRow(product.id)} style={negativeButtonStyle}>
                        Delete
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{product.name}</td>
                    <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{product.stock}</td>
                    <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{product.threshold}</td>
                    <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>${product.cost}</td>
                  </>
                )}
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr style={{ backgroundColor: '#c8e6c9' }}>
                <td colSpan={editMode ? 5 : 4} style={{ padding: '8px', textAlign: 'center' }}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editMode && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setEditMode(false)} style={positiveButtonStyle}>
            Save Changes
          </button>
        </div>
      )}

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '9999'
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '900px',
              maxHeight: '80%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32', marginBottom: '10px' }}>
              Add Products
            </h3>
            <div
              style={{
                flex: '1',
                overflowY: 'auto',
                marginBottom: '10px',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '4px',
                backgroundColor: '#f1f8e9'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#a5d6a7' }}>
                    <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Product Name</th>
                    <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Stock</th>
                    <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Threshold</th>
                    <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Cost</th>
                    <th style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newProducts.map((product, index) => (
                    <tr key={index} style={{ backgroundColor: '#c8e6c9' }}>
                      <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={product.name}
                          onChange={(e) => handleNewProductChange(index, 'name', e.target.value)}
                          style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                        />
                      </td>
                      <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                        <input
                          type="number"
                          placeholder="Stock"
                          value={product.stock}
                          onChange={(e) => handleNewProductChange(index, 'stock', e.target.value)}
                          style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                        />
                      </td>
                      <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                        <input
                          type="number"
                          placeholder="Threshold"
                          value={product.threshold}
                          onChange={(e) => handleNewProductChange(index, 'threshold', e.target.value)}
                          style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                        />
                      </td>
                      <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                        <input
                          type="number"
                          placeholder="Cost"
                          value={product.cost}
                          onChange={(e) => handleNewProductChange(index, 'cost', e.target.value)}
                          style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                        />
                      </td>
                      <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>
                        {newProducts.length > 1 && (
                          <button 
                            onClick={() => handleDeleteNewProductRow(index)}
                            style={negativeButtonStyle}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={handleAddProductRow} style={positiveButtonStyle}>
                Add Another
              </button>
              <button onClick={saveNewProducts} style={positiveButtonStyle}>
                Save
              </button>
              <button onClick={() => setShowModal(false)} style={negativeButtonStyle}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
