import pandas as pd
import joblib
from feature_extraction import feature_extraction
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
# Tải mô hình đã lưu
clf_loaded = joblib.load('random_forest_model.pkl')

path = 'storage/test.pdf'
features = feature_extraction(path)
print(features)
result = clf_loaded.predict(features)
print('Result:', result)