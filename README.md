# СВЕТ — Bootstrap

Учебный каталог настольных светильников на Bootstrap.

КР №2: «CSS-фреймворки: разработка интерфейса на Bootstrap или альтернативном CSS-фреймворке».
**ФИО:** Филиппов К.А. **Группа:** ЭФБО-13-25.

## Структура

- `index.html` — главная страница;
- `catalog.html` — каталог и фильтры;
- `product.html` — товары и характеристики;
- `order.html` — форма заявки;
- `contacts.html` — контакты;
- `css/custom.css` — собственные стили поверх Bootstrap;
- `js/main.js` — фильтры, модальное окно и форма;
- `images/` — изображения проекта;
- `vendor/bootstrap/` — локальные CSS и JS Bundle Bootstrap.

## Технологии

HTML5, CSS3, JavaScript, Bootstrap 5.3.8. Bootstrap подключён локально, `custom.css` — после него.
Компоненты: сетка, navbar, card, btn, badge, alert, modal, accordion, table, form-control, form-select, input-group, form-check.
Доработки: поиск, фильтры, сортировка, передача выбранного товара в форму и расчёт суммы.

## Запуск

Сайт открывается через `index.html`, без установки, сборки и интернета.
Форма учебная: данные не сохраняются и не отправляются.

## GitHub Pages

Сайт: [aka-rei.github.io/kr2-bootstrap-shop](https://aka-rei.github.io/kr2-bootstrap-shop/).

Публикация настроена из корня ветки `main`: **Settings → Pages → Deploy from a branch → main → / (root)**.
После отправки изменений в `main` сайт обновляется автоматически. Файл `.nojekyll` отключает обработку Jekyll.
