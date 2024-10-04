from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import pandas as pd

df = pd.read_csv('pdfdataset.csv')
X = df.iloc[:, 0:21]
y = df.iloc[:, 21]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

def random_forest(features):
    clf = RandomForestClassifier()
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    acs = accuracy_score(y_test, y_pred) * 100
    precision = precision_score(y_test, y_pred,pos_label='yes') * 100
    recall = recall_score(y_test, y_pred,pos_label='yes') * 100
    f1 = f1_score(y_test, y_pred,pos_label='yes') * 100
    acs = round(acs, 2)
    precision = round(precision, 2)
    recall = round(recall, 2)
    f1 = round(f1, 2)
    predict = clf.predict(features)
    return [acs, predict, precision, recall, f1]

def SVM(features):
    clf = SVC()
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    acs = accuracy_score(y_test, y_pred) * 100
    precision = precision_score(y_test, y_pred,pos_label='yes') * 100
    recall = recall_score(y_test, y_pred,pos_label='yes') * 100
    f1 = f1_score(y_test, y_pred,pos_label='yes') * 100
    acs = round(acs, 2)
    precision = round(precision, 2)
    recall = round(recall, 2)
    f1 = round(f1, 2)
    predict = clf.predict(features)
    return [acs, predict, precision, recall, f1]

def LR(features):
    clf = LogisticRegression()
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    acs = accuracy_score(y_test, y_pred) * 100
    precision = precision_score(y_test, y_pred) * 100
    recall = recall_score(y_test, y_pred) * 100
    f1 = f1_score(y_test, y_pred) * 100
    acs = round(acs, 2)
    precision = round(precision, 2)
    recall = round(recall, 2)
    f1 = round(f1, 2)
    predict = clf.predict(features)
    return [acs, predict, precision, recall, f1]

def KNN(features):
    clf = KNeighborsClassifier()
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    acs = accuracy_score(y_test, y_pred) * 100
    precision = precision_score(y_test, y_pred) * 100
    recall = recall_score(y_test, y_pred) * 100
    f1 = f1_score(y_test, y_pred) * 100
    acs = round(acs, 2)
    precision = round(precision, 2)
    recall = round(recall, 2)
    f1 = round(f1, 2)
    predict = clf.predict(features)
    return [acs, predict, precision, recall, f1]

def DT(features):
    clf = DecisionTreeClassifier()
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    acs = accuracy_score(y_test, y_pred) * 100
    precision = precision_score(y_test, y_pred) * 100
    recall = recall_score(y_test, y_pred) * 100
    f1 = f1_score(y_test, y_pred) * 100
    acs = round(acs, 2)
    precision = round(precision, 2)
    recall = round(recall, 2)
    f1 = round(f1, 2)
    predict = clf.predict(features)
    return [acs, predict, precision, recall, f1]

