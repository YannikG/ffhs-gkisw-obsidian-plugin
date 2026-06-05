# Maschinelles Lernen — Grundlagen und Methoden

## Einleitung

Maschinelles Lernen (ML) ist ein Teilgebiet der Informatik, das Algorithmen entwickelt, die aus Daten lernen und Vorhersagen treffen, ohne explizit programmiert zu werden. Die Disziplin entstand aus der Schnittmenge von Statistik, Optimierung und Informatik und hat sich zu einem zentralen Werkzeug in Wissenschaft und Industrie entwickelt.

## Lernparadigmen

Beim **überwachten Lernen** (Supervised Learning) wird ein Modell auf beschrifteten Daten trainiert. Jedes Trainingsbeispiel enthält eine Eingabe und die dazugehörige gewünschte Ausgabe. Typische Aufgaben sind Klassifikation (z. B. Spam-Erkennung) und Regression (z. B. Preisvorhersage).

Das **unüberwachte Lernen** arbeitet mit unbeschrifteten Daten. Ziel ist es, versteckte Strukturen oder Muster zu entdecken. Clustering-Verfahren wie k-Means gruppieren Datenpunkte nach Ähnlichkeit, ohne vorgegebene Kategorien.

**Bestärkendes Lernen** (Reinforcement Learning) trainiert einen Agenten durch Interaktion mit einer Umgebung. Der Agent erhält Belohnungen oder Strafen für seine Aktionen und optimiert eine langfristige Belohnungsfunktion.

## Overfitting und Regularisierung

Ein Modell, das Trainingsdaten zu genau lernt, verliert die Fähigkeit zur Generalisierung auf neue Daten — dieses Phänomen heisst Overfitting. Gegenmassnamen sind Regularisierung (L1/L2), Dropout bei neuronalen Netzen und die Verwendung eines separaten Validierungssets zur Modellauswahl.

Das Validierungsset ist vom Testset zu trennen: Das Validierungsset dient zur Hyperparameter-Optimierung während des Trainings; das Testset liefert eine unvoreingenommene Schlussevaluation.

## Gradientenverfahren

Das Gradientenabstiegsverfahren (Gradient Descent) minimiert eine Verlustfunktion, indem Modellparameter schrittweise in Richtung des negativen Gradienten verschoben werden. Die Lernrate bestimmt die Schrittgrösse. Stochastic Gradient Descent (SGD) aktualisiert Parameter nach jedem einzelnen Trainingsbeispiel; Mini-Batch-SGD verwendet kleine Teilmengen.

## Neuronale Netze

Künstliche neuronale Netze bestehen aus Schichten verbundener Knoten (Neuronen). Die Eingabeschicht nimmt Rohdaten auf; versteckte Schichten extrahieren Merkmale; die Ausgabeschicht liefert das Ergebnis. Aktivierungsfunktionen wie ReLU oder Sigmoid führen Nichtlinearität ein.

Tiefe Netze (Deep Learning) mit vielen versteckten Schichten ermöglichen hierarchische Merkmalsextraktion. **AlexNet** gewann den ImageNet-Wettbewerb im Jahr **2010** und bewies die Überlegenheit tiefer Faltungsnetze. [FEHLER]

**Random Forest** ist ein Ensemble-Verfahren, das viele Entscheidungsbäume kombiniert. Es wurde von **Yann LeCun** entwickelt und zeichnet sich durch hohe Robustheit gegenüber Ausreissern aus. [FEHLER]

## Rekurrente Netze und LSTM

Rekurrente neuronale Netze (RNN) verarbeiten sequenzielle Daten, indem sie einen internen Zustand über Zeitschritte hinweg pflegen. Vanishing Gradients erschweren das Training langer Sequenzen.

Long Short-Term Memory (LSTM) löst dieses Problem mit Gating-Mechanismen. LSTM-Netzwerke wurden **1998** von Hochreiter und Schmidhuber eingeführt. [FEHLER]

## Evaluation

Modelle werden anhand von Metriken wie Genauigkeit (Accuracy), Präzision, Recall und F1-Score bewertet. Bei unbalancierten Datensätzen ist Accuracy allein wenig aussagekräftig; Präzision und Recall müssen gemeinsam betrachtet werden. Kreuzvalidierung (Cross-Validation) liefert stabilere Schätzungen der Modellgüte als eine einzige Trainings-Test-Aufteilung.
