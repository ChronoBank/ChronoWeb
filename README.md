# Верстка проекта ChronoBank #

Все исходники находятся в папке `src`, папка `dist` генерируется автоматически (**важно:** не вносить изменения в папку `dist`, все затрется при перезапуске gulp). Проект собирается с помощью Gulp (`gulpfile.js`), js через Webpack (`webpack*.config.js`).
Сверстанные страницы в папке `dist/html`

### Сборка проекта ###

* Шаг 1: Устанавливаем nodeJS, если он не установлен
* Шаг 2: Заходим в консоли в папку проекта
* Шаг 3: Команда `npm install`, для скачивания зависимостей
* Шаг 4: Запускаем сборку и локальный веб-сервер командой `gulp`

### Структура папки src ###

* `data` — json файлы для ajax запросов
* `fonts` — шрифты
* `i` — изображения для стилизации сайта
* `js` — javascript
* `sass` — SASS стили, генерируются в CSS
* `templates` — PugJS шаблоны, генерируются в HTML
* `uploads` — пользовательские картинки

### Структура папки dist ###

* `data`, `fonts`, `uploads` — то же самое, что и в src папке
* `i` — sprites
* `js` — javascript
* `css` — css
* `html` — html
