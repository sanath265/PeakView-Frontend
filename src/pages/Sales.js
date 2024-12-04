import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const SalesDashboard = () => {
  // Initial product list
  const [products, setProducts] = useState([
    { id: 'P-1001', name: 'Product A', price: 100, quantitySold: 0, totalAmount: 0 },
    { id: 'P-1002', name: 'Product B', price: 150, quantitySold: 0, totalAmount: 0 },
    { id: 'P-1003', name: 'Product C', price: 200, quantitySold: 0, totalAmount: 0 },
  ]);

  // Orders
  const [orders, setOrders] = useState([
    { orderId: 'O-1001', customer: 'Mark Spencer', items: [{ productId: 'P-1001', qty: 2 }], status: 'Open' },
    { orderId: 'O-1002', customer: 'Ella Fitzgerald', items: [{ productId: 'P-1002', qty: 1 }, { productId: 'P-1003', qty: 2 }], status: 'Open' },
    { orderId: 'O-1003', customer: 'Robert Frost', items: [{ productId: 'P-1001', qty: 1 }], status: 'Completed' },
  ]);

  const [selectedTab, setSelectedTab] = useState('Open'); // 'Open' or 'Completed'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductData, setNewProductData] = useState({ id: '', name: '', price: '' });

  const [showTakeSalesModal, setShowTakeSalesModal] = useState(false);
  const [salesItems, setSalesItems] = useState([{ productId: '', quantity: '' }]);
  const [customerName, setCustomerName] = useState('');

  // Handlers for completing orders
  const handleCompleteOrder = (orderId) => {
    const updated = orders.map(o => {
      if (o.orderId === orderId && o.status === 'Open') {
        // Update product sales from order items
        const updatedProducts = products.map(p => {
          const orderedItem = o.items.find(i => i.productId === p.id);
          if (orderedItem) {
            const newQty = p.quantitySold + orderedItem.qty;
            const newAmount = p.totalAmount + (p.price * orderedItem.qty);
            return { ...p, quantitySold: newQty, totalAmount: newAmount };
          }
          return p;
        });
        setProducts(updatedProducts);

        return { ...o, status: 'Completed' };
      }
      return o;
    });
    setOrders(updated);
  };

  // Handler to generate PDF invoice
  const handleGenerateInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Invoice', 14, 22);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.orderId}`, 14, 32);
    doc.text(`Customer: ${order.customer}`, 14, 40);
    doc.text(`Status: ${order.status}`, 14, 48);

    doc.text('Items:', 14, 60);

    let startY = 70;
    order.items.forEach((item, index) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        doc.text(`${index + 1}. ${product.name} (x${item.qty}) - $${product.price * item.qty}`, 14, startY);
        startY += 10;
      }
    });

    // Calculate total
    const total = order.items.reduce((acc, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        return acc + product.price * item.qty;
      }
      return acc;
    }, 0);

    doc.text(`Total Amount: $${total.toFixed(2)}`, 14, startY + 10);

    doc.save(`Invoice_${order.orderId}.pdf`);
  };

  // Handlers for adding products
  const handleAddProduct = () => {
    setShowAddProductModal(true);
  };

  const handleNewProductChange = (field, value) => {
    setNewProductData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProduct = () => {
    const { id, name, price } = newProductData;
    if (!id || !name || !price) {
      alert('Please fill all fields for product');
      return;
    }
    // Check for unique Product ID
    const existingProduct = products.find(p => p.id === id);
    if (existingProduct) {
      alert('Product ID must be unique');
      return;
    }
    const newProduct = {
      id,
      name,
      price: parseFloat(price),
      quantitySold: 0,
      totalAmount: 0
    };
    setProducts(prev => [...prev, newProduct]);
    setShowAddProductModal(false);
    setNewProductData({ id: '', name: '', price: '' });
  };

  const handleCancelProduct = () => {
    setShowAddProductModal(false);
    setNewProductData({ id: '', name: '', price: '' });
  };

  // Handlers for taking sales
  const handleTakeSales = () => {
    setShowTakeSalesModal(true);
    setSalesItems([{ productId: '', quantity: '' }]);
    setCustomerName('');
  };

  const handleSalesItemChange = (index, field, value) => {
    const updatedItems = [...salesItems];
    updatedItems[index][field] = value;
    setSalesItems(updatedItems);
  };

  const handleAddSalesItemRow = () => {
    setSalesItems([...salesItems, { productId: '', quantity: '' }]);
  };

  const handleSaveSales = () => {
    if (!customerName) {
      alert('Please enter customer name');
      return;
    }
    for (let item of salesItems) {
      if (!item.productId || !item.quantity) {
        alert('Please fill all product and quantity details');
        return;
      }
    }

    // Update products table
    const updatedProducts = products.map(p => {
      const saleItem = salesItems.find(si => si.productId === p.id);
      if (saleItem) {
        const qty = parseInt(saleItem.quantity);
        const newQtySold = p.quantitySold + qty;
        const newAmount = p.totalAmount + (p.price * qty);
        return { ...p, quantitySold: newQtySold, totalAmount: newAmount };
      }
      return p;
    });

    // Add sales order
    const newOrder = {
      orderId: `O-${orders.length + 1}`,
      customer: customerName,
      items: salesItems.map(si => ({
        productId: si.productId,
        qty: parseInt(si.quantity),
      })),
      status: 'Open',
    };

    setProducts(updatedProducts);
    setOrders([...orders, newOrder]);
    setShowTakeSalesModal(false);
  };

  const handleCancelSales = () => {
    setShowTakeSalesModal(false);
    setSalesItems([{ productId: '', quantity: '' }]);
    setCustomerName('');
  };

  // Filtered orders based on selected tab and search query
  const filteredOrders = orders.filter(o => o.status === selectedTab && 
    (o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
     o.customer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Styles (Blue theme)
  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff', 
    color: '#1565C0', // Dark blue text
    minHeight: '100vh',
    boxSizing: 'border-box'
  };

  const headingStyle = {
    marginBottom: '20px',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1565C0' // Dark blue heading
  };

  const sectionHeadingStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: '10px'
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #2196F3', 
    fontSize: '16px',
    width: '300px',
    transition: 'border-color 0.3s ease, background-color 0.3s ease',
    backgroundColor: '#ffffff',
    color: '#1565C0',
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#1565C0';
    e.target.style.backgroundColor = '#E3F2FD';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#2196F3';
    e.target.style.backgroundColor = '#ffffff';
  };

  const primaryButtonStyle = {
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const negativeButtonStyle = {
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const tabButtonStyle = (active) => ({
    backgroundColor: active ? '#2196F3' : '#ccc',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  });

  const tableContainerStyle = {
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '10px',
    maxHeight: '250px',
    overflowY: 'auto',
    backgroundColor: '#E3F2FD' // Light blue background
  };

  const tableHeaderRowStyle = {
    background: '#BBDEFB' // Lighter blue for headers
  };

  const tableCellStyle = {
    padding: '8px',
    borderBottom: '1px solid #eee'
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Sales Dashboard</h2>

      {/* Products Section */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={sectionHeadingStyle}>Products</h3>
        <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
          <button onClick={handleAddProduct} style={primaryButtonStyle}>Add Product</button>
          <button onClick={handleTakeSales} style={primaryButtonStyle}>Take Sales</button>
        </div>
        <div style={tableContainerStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={tableHeaderRowStyle}>
                <th style={tableCellStyle}>Product ID</th>
                <th style={tableCellStyle}>Product Name</th>
                <th style={tableCellStyle}>Quantity Sold</th>
                <th style={tableCellStyle}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={tableCellStyle}>{p.id}</td>
                  <td style={tableCellStyle}>{p.name}</td>
                  <td style={tableCellStyle}>{p.quantitySold}</td>
                  <td style={tableCellStyle}>${p.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '8px', textAlign: 'center', backgroundColor:'#E3F2FD' }}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales Orders Section */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={sectionHeadingStyle}>Sales Orders</h3>
        <p style={{ marginBottom: '10px', color: '#1565C0' }}>
          Manage open and completed sales orders. Completing an order updates the product sales.
        </p>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setSelectedTab('Open')}
              style={tabButtonStyle(selectedTab === 'Open')}
            >
              Open Orders
            </button>
            <button
              onClick={() => setSelectedTab('Completed')}
              style={tabButtonStyle(selectedTab === 'Completed')}
            >
              Completed Orders
            </button>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={inputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>
        </div>

        <div style={tableContainerStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={tableHeaderRowStyle}>
                <th style={tableCellStyle}>Order ID</th>
                <th style={tableCellStyle}>Customer</th>
                <th style={tableCellStyle}>Status</th>
                <th style={tableCellStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.orderId}>
                  <td style={tableCellStyle}>{order.orderId}</td>
                  <td style={tableCellStyle}>{order.customer}</td>
                  <td style={tableCellStyle}>{order.status}</td>
                  <td style={tableCellStyle}>
                    {order.status === 'Open' && (
                      <button 
                        onClick={() => handleCompleteOrder(order.orderId)}
                        style={primaryButtonStyle}
                      >
                        Mark Complete
                      </button>
                    )}
                    {order.status === 'Completed' && (
                      <>
                        <button
                          onClick={() => handleGenerateInvoice(order)}
                          style={{ ...primaryButtonStyle, backgroundColor: '#1565C0', marginRight: '5px' }}
                        >
                          Generate Invoice
                        </button>
                        {/* Additional actions like Send Email can be added here */}
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '8px', textAlign: 'center', backgroundColor:'#E3F2FD' }}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
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
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <h3 style={{ color: '#1565C0', fontWeight: 'bold' }}>Add New Product</h3>
            <input
              type="text"
              placeholder="Product ID"
              value={newProductData.id}
              onChange={(e) => handleNewProductChange('id', e.target.value)}
              style={inputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <input
              type="text"
              placeholder="Product Name"
              value={newProductData.name}
              onChange={(e) => handleNewProductChange('name', e.target.value)}
              style={inputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <input
              type="number"
              placeholder="Price"
              value={newProductData.price}
              onChange={(e) => handleNewProductChange('price', e.target.value)}
              style={inputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={handleSaveProduct} style={primaryButtonStyle}>
                Save
              </button>
              <button onClick={handleCancelProduct} style={negativeButtonStyle}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Take Sales Modal */}
      {showTakeSalesModal && (
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
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              width: '500px',
              maxHeight: '80%',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <h3 style={{ color: '#1565C0', fontWeight: 'bold' }}>Take Sales</h3>
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={inputStyle}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            {salesItems.map((si, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  value={si.productId}
                  onChange={(e) => handleSalesItemChange(index, 'productId', e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #2196F3', backgroundColor: '#ffffff', color: '#1565C0' }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                >
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Qty"
                  value={si.quantity}
                  onChange={(e) => handleSalesItemChange(index, 'quantity', e.target.value)}
                  style={{ width: '80px', padding: '10px', borderRadius: '4px', border: '1px solid #2196F3', backgroundColor: '#ffffff', color: '#1565C0' }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            ))}
            <button
              onClick={handleAddSalesItemRow}
              style={{
                backgroundColor: '#2196F3',
                color: '#fff',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '4px',
                marginBottom: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Add Another Product
            </button>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={handleSaveSales} style={primaryButtonStyle}>
                Save
              </button>
              <button onClick={handleCancelSales} style={negativeButtonStyle}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
