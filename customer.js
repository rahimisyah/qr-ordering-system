let orders = [];

async function loadOrders() {
  try {
    const response = await fetch('https://YOUR-RENDER-APP-NAME.onrender.com/api/orders');
    orders = await response.json();
    renderOrders();
  } catch (error) {
    console.error('Failed to load orders:', error);
  }
}

function renderOrders() {
  const orderList = document.getElementById('orderList');
  orderList.innerHTML = '';

  orders
    .filter(order => order.status !== 'completed')
    .forEach(order => {
      const orderCard = document.createElement('div');
      orderCard.className = `order-card ${order.status}`;
      orderCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <h3>Table ${order.table}</h3>
          <span>${order.time}</span>
        </div>
        <ul>
          ${order.items.map(item => `<li>${item.qty}x ${item.name}</li>`).join('')}
        </ul>
        <div style="margin-top: 10px;">
          <button onclick="updateOrderStatus(${order.id}, 'preparing')" 
                  ${order.status !== 'pending' ? 'disabled' : ''} 
                  style="background: #FF9800; color: white; border: none; padding: 5px 10px; margin-right: 5px;">Preparing</button>
          <button onclick="updateOrderStatus(${order.id}, 'ready')" 
                  ${order.status !== 'preparing' ? 'disabled' : ''} 
                  style="background: #4CAF50; color: white; border: none; padding: 5px 10px; margin-right: 5px;">Ready</button>
          <button onclick="updateOrderStatus(${order.id}, 'completed')" 
                  ${order.status !== 'ready' ? 'disabled' : ''} 
                  style="background: #2196F3; color: white; border: none; padding: 5px 10px;">Completed</button>
        </div>
      `;
      orderList.appendChild(orderCard);
    });

  document.getElementById('orderCount').textContent = `${orders.filter(o => o.status !== 'completed').length} pending`;
}

async function updateOrderStatus(orderId, status) {
  try {
    await fetch(`https://YOUR-RENDER-APP-NAME.onrender.com/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadOrders();
  } catch (error) {
    console.error('Failed to update order:', error);
  }
}

setInterval(loadOrders, 3000);
loadOrders();
