### Сделано:
- Смарт-контракт для голосования:
  - Структура, которая содержит информацию о кандидате, включая его идентификатор, имя и количество голосов, которые он получил
  - Владелец контракта, который имеет право добавлять кандидатов
  - Сопоставление, которое связывает идентификатор кандидата с его структурой данных
  - Сопоставление, которое отслеживает, голосовал ли уже конкретный адрес
  - Флаг, который указывает, закончились ли выборы
  - Функция для добавления кандидатов
  - Функция для голосования за кандидатов
  - Функция для завершения выборов
  - Функция для получения победителя выборов
  - Несколько раундов голосования
  - Проценты голосов у кандидатов
- Базовый HTML-файл
- Базовый скрипт для сервера
- Базовый скрипт для клиента

### Добавить:
- Ограничение по времени
- Проверку на равенство голосов у кандидатов
- Проверку на ненулевое число кандидатов
- Функцию старта голосования