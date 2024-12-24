# 🐧 Platformówka z Pingwinem

Prosta gra platformowa stworzona w JavaScript przy użyciu frameworka Phaser 3. Gra zawiera system poziomów oraz kreator własnych map.

## Wymagania na poszczególne oceny 
- ✅ 3.0 Należy stworzyć jeden poziom z przeszkodami oraz dziurami w które można wpaść i zginąć
- ✅ 3.5 Należy dodać opcję zbierania punktów
- ✅ 4.0 Należy dodać przeciwników, których można zabić oraz 3 życia
- ✅ 4.5 Ładowanie poziomów z pliku
- ✅ 5.0 Generator poziomów

## 🛠️ Technologie

- JavaScript
- Phaser 3
- Vite (bundler)
- Node.js

## 📋 Wymagania

- Node.js (wersja 14 lub wyższa)
- npm (menedżer pakietów Node.js)

## 🚀 Instalacja i uruchomienie

1. Sklonuj repozytorium:

```bash
git clone https://github.com/twoja-nazwa/platformowka-pingwin.git
cd platformowka-pingwin
```

2. Zainstaluj zależności:

```bash
npm install
```
3. Uruchom serwer:

```bash
npm run dev
```

4. Otwórz stronę w przeglądarce:

```bash
http://localhost:5173
```

# Sterowanie
### W grze
- **←** / **→** - Ruch w lewo / prawo
- **↑** - Skok
- **ESC** - Menu pauzy

### W kreatorze poziomów
- **LPM** - Umieszczanie elementów
- **PPM** - Usuwanie elementów
- Przyciski w prawym górnym rogu:
  - **Powrót** - Powrót do menu głównego
  - **Zapisz** - Zapisz poziom do pliku
  - **Test** - Przetestuj stworzony poziom

## 🎯 Funkcje gry

### Podstawowe mechaniki
- System żyć (❤️)
- Zbieranie monet (⭐)
- Przeciwnicy (🦟)
- Meta poziomu (🌌)
- System punktacji

### Kreator poziomów
- Tworzenie własnych map
- Możliwość testowania poziomów
- Zapisywanie poziomów do plików
- Wczytywanie własnych poziomów

### System kolizji
- Platformy
- Przeciwnicy (można na nich skakać)
- Monety (zbieranie)
- Wykrywanie mety

## 📁 Struktura projektu

* src/ - Główny katalog źródłowy
  * scenes/ - Sceny gry
    * MenuScene.js - Menu główne gry
    * GameScene.js - Główna scena rozgrywki
    * LevelEditorScene.js - Kreator poziomów
    * LevelSelectScene.js - Menu wyboru poziomów
  * levels/ - Domyślne poziomy gry
    * level1.json - Pierwszy poziom
    * level2.json - Drugi poziom
  * utils/ - Narzędzia pomocnicze
    * levelLoader.js - Zarządzanie wczytywaniem poziomów
  * index.js - Punkt wejściowy aplikacji, konfiguracja Phaser
* public/ - Zasoby statyczne
  * assets/ - Grafiki i dźwięki
* package.json - Konfiguracja projektu i zależności
* vite.config.js - Konfiguracja Vite (bundler)
* index.html - Główny plik HTML