# CreditIQ: End-to-End Credit Risk Assessment & Default Prediction System
---
title: Credit Risk Assessment Dashboard
emoji: 🏦
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---

## Overview

CreditIQ is a production-ready machine learning application designed to assess borrower credit risk and predict the likelihood of serious delinquency within the next two years.

The solution combines a trained machine learning model with a modern full-stack architecture, delivering real-time risk predictions through a FastAPI backend and an interactive React dashboard.

The system is built to demonstrate an end-to-end data science workflow, covering data preparation, feature engineering, model development, API deployment, and frontend integration.

---

## Business Problem

Financial institutions rely on accurate credit risk assessment to reduce default exposure and improve lending decisions.

CreditIQ addresses this challenge by:

* Automating credit default risk evaluation.
* Handling highly imbalanced credit datasets using oversampling techniques.
* Generating probability-based risk predictions.
* Providing clear borrower risk categorization for decision support.

---

## Dataset

**Source:** Give Me Some Credit Dataset (Kaggle)

**Target Variable**

 Variable     : SeriousDlqin2yrs            
Description    : Indicates whether a borrower experienced serious delinquency within the following two years (1 = Yes, 0 = No) 

### Data Resources

Due to GitHub file-size limitations, datasets and trained model artifacts are hosted externally.

**Dataset Files & Data Dictionary**

https://drive.google.com/drive/folders/1HlB1x0PNLrbdNG5jwb2XXZQm8Clb7H4_

**Trained Models & Scalers**

https://drive.google.com/drive/folders/1izPpT1VIHbSiIxCA55fOErurQCuq9DqE

---

## Machine Learning Pipeline

The predictive workflow follows the process below:

```text
Raw Data
   ↓
Data Cleaning & Feature Engineering
   ↓
Class Imbalance Handling (SMOTE)
   ↓
Feature Selection
   ↓
Model Training & Evaluation
   ↓
Random Forest Classifier
   ↓
FastAPI Inference Service
   ↓
React Dashboard
```

### Key Processing Steps

* Missing value treatment and data quality checks.
* Feature engineering for borrower financial behavior.
* Outlier mitigation and normalization.
* Class balancing using SMOTE techniques.
* Feature selection using statistical methods.
* Comparative model evaluation and validation.

### Final Model

After evaluating multiple algorithms, the Random Forest Classifier was selected as the final production model due to its strong balance between precision, recall, robustness, and interpretability.

---

## Backend Architecture

The backend is built using FastAPI and serves machine learning predictions through RESTful APIs.

### Features

* FastAPI-powered inference engine.
* Pydantic request validation.
* Serialized model loading using Joblib.
* Real-time prediction service.
* Health monitoring endpoint.

### API Endpoints

| Method | Endpoint     | Description            |
| ------ | ------------ | ---------------------- |
| GET    | /api/health  | Service health check   |
| POST   | /api/predict | Credit risk prediction |

---

## Frontend Application

The user interface is developed using React and Vite, providing a responsive dashboard for borrower risk analysis.

### Features

* Modern fintech-inspired user experience.
* Dynamic form validation.
* Real-time API integration.
* Risk classification display.
* Probability-based prediction reporting.

---

## Technology Stack

### Machine Learning

* Scikit-Learn
* Imbalanced-Learn
* Pandas
* NumPy
* Joblib

### Backend

* FastAPI
* Uvicorn
* Pydantic

### Frontend

* React
* Vite
* Axios
* Tailwind CSS

### Deployment

* Docker
* Hugging Face Spaces

---

## Local Setup

### Clone Repository

```bash
git clone https://github.com/bushrabatool0605/CodeAlpha-credit-scoring-model.git

cd CodeAlpha-credit-scoring-model
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

Windows:

```powershell
venv\Scripts\Activate.ps1
```

### Install Dependencies

```bash
pip install -r backend/requirements.txt
```

### Run Backend

```bash
uvicorn backend.main:app --reload --port 8000
```

### Run Frontend

```bash
cd frontend

npm install

npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Deployment

The application is containerized using Docker and structured for cloud deployment.

Deployment targets include:

* Hugging Face Spaces
* Docker Containers
* Cloud VM Environments
* Future CI/CD Integration

---

## Future Enhancements

* Model monitoring and drift detection.
* Explainable AI using SHAP.
* User authentication and role management.
* Cloud-native CI/CD pipelines.
* Enhanced portfolio analytics dashboard.

---

## License

This project is intended for educational, research, and portfolio demonstration purposes.

---

## Author

**Bushra Batool**

Machine Learning & Data Science Project Portfolio
