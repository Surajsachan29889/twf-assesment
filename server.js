const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const DISTANCE = {
  'C1': { 'C1': 0, 'C2': 10, 'C3': 20, 'L1': 30 },
  'C2': { 'C1': 10, 'C2': 0, 'C3': 15, 'L1': 30 },
  'C3': { 'C1': 20, 'C2': 15, 'C3': 0, 'L1': 20 },
  'L1': { 'C1': 30, 'C2': 30, 'C3': 20, 'L1': 0 },
};


const COST_PER_UNIT = {
  'A': 10, 'B': 10, 'C': 12, 'D': 15, 'E': 20, 'F': 10, 'G': 18, 'H': 14, 'I': 8,
};


function calculateProductCost(product, quantity) {
  const weight = 0.5;
  return COST_PER_UNIT[product] * quantity * weight;
}

function calculateDeliveryCost(order) {
  let minCost = Infinity;

  ['C1', 'C2', 'C3'].forEach(warehouse => {
    let totalCost = 0;
    let deliveryCost = DISTANCE[warehouse]['L1'];

    
    for (let product in order) {
      totalCost += calculateProductCost(product, order[product]);
    }


    totalCost += deliveryCost;

    if (totalCost < minCost) {
      minCost = totalCost;
    }
  });

  return minCost;
}


app.post('/calculate-delivery-cost', (req, res) => {
  const order = req.body;


  if (!order || Object.keys(order).length === 0) {
    return res.status(400).send('Invalid order data.');
  }
  const minCost = calculateDeliveryCost(order);


  res.json({
    success: true,
    minimum_delivery_cost: minCost,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
