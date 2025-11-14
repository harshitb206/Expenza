
# **Expenza – Intelligent Expense Management System**

![Node.js](https://img.shields.io/badge/-Node.js-blue?logo=nodejs\&logoColor=white)
![Python](https://img.shields.io/badge/-Python-yellow?logo=python\&logoColor=white)
![Machine Learning](https://img.shields.io/badge/-Machine%20Learning-green)

## 📝 **Description**

**Expenza** is an ML-powered expense management system that combines a smart machine learning model with a modern web application.
The system enables users to:

* Add expenses & income
* Auto-categorize transactions using a trained ML model
* Visualize financial data through interactive charts
* Gain insights into spending patterns and savings behaviour
* Plan expenses and track budgets more efficiently

The core of the project is a **Machine Learning model** (trained in Python) that intelligently predicts the *category of each expense* based on user input. The web application, built with **Node.js + Next.js**, handles the UI, user flow, and visualization of insights.

---

## ✨ **Key Features**

### 🔥 **1. ML-Powered Expense Categorization**

* A trained ML model (Python + scikit-learn) automatically predicts categories such as:

  * Food
  * Travel
  * Shopping
  * Bills
  * Health
  * Miscellaneous
* Users don’t need to manually categorize every expense.

### 🌐 **2. Modern Web App Interface**

* Built with **Next.js (App Router)**
* Clean and minimal UI using **Tailwind CSS**
* Add Expense / Add Income pages
* Dashboard with:

  * Expense charts
  * Savings insights
  * Financial planner

### 📊 **3. Interactive Visualizations**

Built using **Recharts**, including:

* Monthly expense trends
* Category-wise spending
* Income vs expenses analysis

### 🧠 **4. Machine Learning Folder**

Includes:

* `train_model.py` → Model training script
* `model.pkl` → Saved trained model
* `app.py` → ML API endpoint (Flask/FastAPI)
* `data.csv` → Training dataset

### 🔌 **5. API-driven Architecture**

* Web app communicates with the ML backend
* Expense sent → ML model predicts → Category returned
* Ensures modular, scalable design

---

## 🛠️ **Tech Stack**

### **Frontend**

* Next.js
* Tailwind CSS
* Recharts

### **Backend**

* Node.js
* Express.js
* ML API Integration

### **Machine Learning**

* Python
* Pandas
* scikit-learn
* Pickle model

---

## 📦 **Key Dependencies**

```
recharts: ^3.2.1
next: 14+
express: ^4.x
python: 3.10+
scikit-learn
pandas
```

---

## 🚀 **Run Commands**

### **Frontend**

```
npm install
npm run dev
```

### **Backend**

```
cd backend
npm install
node server.js
```

### **ML Model API**

```
cd ml
python app.py
```

---

## 📁 **Project Structure**

```
.
├── backend
│   ├── db.js
│   ├── package.json
│   └── server.js
├── frontend
│   ├── app
│   │   ├── add-expense
│   │   ├── add-income
│   │   ├── components
│   │   ├── expenses
│   │   ├── planner
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── public
│   ├── package.json
│   └── tailwind.config.js
├── ml
│   ├── app.py
│   ├── data.csv
│   ├── model.pkl
│   └── train_model.py
└── package.json
```

---

## 👥 **Contributing**

Contributions are welcome!

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Commit changes
5. Push the branch
6. Open a Pull Request

Please follow project structure & coding guidelines.

---

