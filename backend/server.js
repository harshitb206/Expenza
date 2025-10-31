// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); // your SQLite or DB connection
const axios = require('axios');

const app = express();
const PORT = 5000;
const ML_URL = 'http://localhost:6000';

app.use(cors({
  origin: true, // reflect request origin
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

// ------------------- DYNAMIC CATEGORIZATION HELPER -------------------

// Function to fetch the dynamic keyword map from the DB
function getDynamicKeywordMap() {
  return new Promise((resolve, reject) => {
    // Select all keywords and their categories
    db.all('SELECT keyword, category FROM keyword_categories', [], (err, rows) => {
      if (err) return reject(err);

      // Transform the flat list into the desired structure for the existing logic
      const map = {};
      rows.forEach(row => {
        if (!map[row.category]) {
          map[row.category] = [];
        }
        map[row.category].push(row.keyword);
      });

      const keywordMap = Object.keys(map).map(category => ({
        keywords: map[category],
        label: category
      }));

      resolve(keywordMap);
    });
  });
}

// ------------------- EXPENSES -------------------

// Get all expenses
app.get('/expenses', (req, res) => {
  db.all('SELECT * FROM expenses ORDER BY date DESC', [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Add expense with ML auto-categorization + dynamic keyword fallback
app.post('/expenses', async (req, res) => {
  try {
    let { amount, merchant, category, date, notes } = req.body;
    const text = `${merchant} ${notes}`.toLowerCase().trim(); // Combined text for categorization

    // === Dynamically load keyword map from DB (Replaces hardcoded array) ===
    const keywordMap = await getDynamicKeywordMap(); 
    // =======================================================================

    let predictedCategory = null;


    // Check keyword map first
    for (let entry of keywordMap) {
      if (entry.keywords.some(k => text.includes(k))) {
        predictedCategory = entry.label;
        break;
      }
    }

    // If no keyword match and category is missing, call ML
    if ((!category || category.trim() === "") && !predictedCategory) {
      try {
        const resp = await axios.post(`${ML_URL}/categorize`, { text });
        predictedCategory = resp.data.category || 'Other';
      } catch (mlErr) {
        console.error("ML service error:", mlErr.message);
        predictedCategory = 'Other';
      }
    }

    // Final category: user input > predicted > fallback
    category = category && category.trim() !== "" ? category : predictedCategory || 'Other';

    // Insert expense into DB
    db.run(
      'INSERT INTO expenses (amount, merchant, category, date, notes) VALUES (?,?,?,?,?)',
      [amount, merchant, category, date, notes],
      function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, category });
        
        // === New: Log data for ML retraining (Feedback Loop) ===
        // We log the combined text and the final, confirmed category.
        db.run(
            // Use INSERT OR IGNORE to prevent logging duplicate entries
            'INSERT OR IGNORE INTO ml_training_data (text, category) VALUES (?, ?)', 
            [text, category],
            (err) => {
                if (err) console.error("Error logging ML training data:", err.message);
            }
        );
        // ========================================================
      }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Delete single expense
app.delete('/expenses/:id', (req, res) => {
  db.run('DELETE FROM expenses WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Delete all expenses
app.delete('/expenses', (req, res) => {
  db.run('DELETE FROM expenses', [], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// ------------------- INCOME -------------------

// Get all income
app.get('/income', (req, res) => {
  db.all('SELECT * FROM income ORDER BY date DESC', [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// Add income
app.post('/income', (req, res) => {
  const { amount, date } = req.body;
  db.run('INSERT INTO income (amount, date) VALUES (?, ?)', [amount, date], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Delete single income
app.delete('/income/:id', (req, res) => {
  db.run('DELETE FROM income WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Delete all income
app.delete('/income', (req, res) => {
  db.run('DELETE FROM income', [], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});
// ------------------- PLANNER -------------------
app.post('/planner', (req, res) => {
  try {
    const { totalIncome, totalExpense, targetSavings, days } = req.body;

    if (!totalIncome || !days) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Available money = Income - Expenses
    const available = totalIncome - totalExpense;

    // Remaining after setting aside savings
    const remainingSavings = available - targetSavings;

    // Daily allowance
    const dailyBudget = remainingSavings / days;

    // Overspend alert (if user already spent more than available - targetSavings)
    const overspendAlert = totalExpense > (totalIncome - targetSavings);

    res.json({
      dailyBudget: dailyBudget > 0 ? dailyBudget : 0,
      remainingSavings: remainingSavings > 0 ? remainingSavings : 0,
      overspendAlert,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Planner calculation failed", details: err.message });
  }
});

// ------------------- SERVER -------------------
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
