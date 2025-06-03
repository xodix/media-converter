# Media converter

# Konwerter i edytor ujednolicający pliki graficzne

# Bartłomiej Deska

## Wymagania systemowe:

- git
- npm
- python

Uruchamianie projektu:

- git clone „https://github.com/xodix/media-converter.git”
- cd media-converter
- npm i
- npm run dev
- Za pomocą przeglądarki przejdź do http://localhost:5173

LUB

- Pobierz archiwum projektu
- unzip MediaConverter.zip
- cd media-converter
- npm i
- npm run dev
- Za pomocą przeglądarki przejdź do http://localhost:5173

Funkcje projektu:

1. Przesyłanie plików graficznych z systemu użytkownika na stronę.
2. Pobieranie losowych zdjęć z serwisu Lorem Picsum.
3. Zmiana wysokości i szerokości wszystkich plików graficznych.
4. Ujednolicenie formatów wszystkich plików graficznych.
5. Możliwość zmiany przestrzeni barw z obrazu kolorowego na odcienie szarości.
6. Możliwość przywrócenia koloru (po zmianie na odcienie szarości).
7. Możliwość aplikacji efektu rozmycia.
8. Zmiana nazwy ostatecznego pliku zip.
9. Pobranie wszystkich plików graficznych w formacie .zip
10. Zapisywanie konfguracji mimo opuszczenia strony.

Szczegóły implementacji funkcji:

1. Pliki przesyłane są przez \<input type=”file”> i przechowywane są w systemie plików przeglądarki za pomocą URL.createObjectURL(plikWBlob) i wyświetlone zgodnie z konfiguracją na elementach \<canvas>.
2. Zdjęcia są pobierane metodą fetch() po czym pliki są zapisywane w systemie plików przeglądarki i wyświetlone zgodnie z konfiguracją na elementach \<canvas>.
3. Zmiana wysokości/szerokości zmienia wymiary elementów \<canvas> i ponownie wyświetla pliki graficzne zgodnie z konfiguracją, poniważ zmiana wymiarów elementu \<canvas> czyści jego zawartość.
4. Zmiana formatu webp/jpg/png jest brana pod uwagę podczas pobierania pojedynczego obrazu z elementu \<canvas>.
5. Każdy pixel w każdym elemencie \<canvas> jest zmodyfikowany wedle algorytmu:
   r = g = b = (r*0.3 + g*06 + b\*0.1)

6. Orginalny plik, który nadal jest przechowywany w systemie plików przeglądarki, zostaje wyświetlony na elemencie \<canvas> bez modyfikacji pixeli.
7. Każdy obraz jest modyfikowany wedle algorytmu rozmycia liniowego. Niestety rozmycie Gaussa uznałem za zbyt wolne, szczególnie dla obrazów powyżej 8MP. Przepisując algorytmu w C i używając Webassembly można skrócić czas potrzebny na rozmycie.
8. Nazwa jest brana pod uwagę podczas procesu zapisywania pliku zip.
9. Proces pobierania jest wspomagany przez bibliotekę JSZip. Każdy element \<canvas> jest pobierany jako plik we wskaznym formacie. Te pliki są przekazane do JSZip, gdzie nakładana jest na nie kompresja bezstratna. JSZip tworzy plik .zip pod wskazaną nazwą i jest pobierany za pomocą niewidzialnego przycisku.
10. Każda zmiana w konfiguracji jest zapisywana do klasy Configuration, która jest parsowana jako JSON i zapisywana w LocalStorage przed zamknięciem strony i wsczytana podczas jej załadowania
    Użyte technologie: 1. Vite 2. Typescript 3. SCSS 4. CanvasAPI 5. objectURL 6. JSZip 7. Fetch 8. RWD 9. LocalStorage

**Projekt nie wysyła żadnych danych. Wszystkie operacje (poza pobieraniem losowych obrazów) dzieją się na komputerze użytkownika, co rozróżnia moją aplikację od alternatyw.**
