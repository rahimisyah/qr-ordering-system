const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Local storage file
const ORDERS_FILE = './server/orders.json';

// Initialize orders file
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
}

// Routes
app.get('/api/orders', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const { table, items } = req.body;
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  
  const newOrder = {
    id: Date.now(),
    table,
    items,
    status: 'pending',
    timestamp: new Date().toISOString(),
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  
  orders.push(newOrder);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  
  console.log('New order:', newOrder);
  
  res.json({ success: true, orderId: newOrder.id });
});

app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  const orderIndex = orders.findIndex(order => order.id == id);
  
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.get('/api/menu', (req, res) => {
  res.json([
    { id: 1, name: "Nasi Lemak", price: 8.50, image: "nasi-lemak.jpg" },
    { id: 2, name: "Rendang", price: 12.00, image: "rendang.jpg" },
    { id: 3, name: "Satay", price: 6.00, image: "satay.jpg" },
    { id: 4, name: "Roti Canai", price: 3.50, image: "roti-canai.jpg" },
    { id: 5, name: "Teh Tarik", price: 2.50, image: "teh-tarik.jpg" }
  ]);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at port ${PORT}`);
});
