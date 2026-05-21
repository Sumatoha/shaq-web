# jokeonda

iOS-приложение, которое каждый день в **09:11** показывает одну шутку через локальное уведомление. Без бекенда — шутки лежат в `jokes.json` в этом репозитории, а приложение их сам подтягивает и планирует уведомления локально.

## Как это работает

1. Приложение при запуске и фоном (раз в ~6 часов через `BGAppRefreshTask`) скачивает `jokes.json` по URL:
   `https://raw.githubusercontent.com/sumatoha/shaq-web/main/jokes.json`
2. Парсит, кеширует на диск.
3. Отменяет старые запланированные уведомления и планирует новые: для каждой шутки с датой ≥ сегодня создаётся `UNCalendarNotificationTrigger` на 09:11 локального времени пользователя.
4. iOS позволяет иметь до ~64 запланированных уведомлений на приложение — поэтому в очереди держим максимум 60 ближайших дней.

Бекенда нет. APNs не нужен. Сертификаты не нужны.

## Как добавить шутку

Открываешь `jokes.json` и добавляешь объект в массив `jokes`:

```json
{ "date": "2026-05-26", "text": "Текст шутки." }
```

Коммитишь в `main`. У всех пользователей при следующем открытии приложения или при срабатывании фонового обновления (обычно в течение суток) шутка появится в расписании уведомлений.

Если на какую-то дату шутки нет — в этот день уведомление просто не придёт.

## Структура

```
.
├── jokes.json                 # ← лента шуток, единственное, что меняется
├── jokeonda/
│   ├── jokeonda.xcodeproj/
│   └── jokeonda/
│       ├── jokeondaApp.swift          # entry point + scene phase
│       ├── ContentView.swift          # UI
│       ├── Joke.swift                 # модель
│       ├── JokeStore.swift            # загрузка JSON, кеш
│       ├── NotificationScheduler.swift# планирование уведомлений
│       ├── BackgroundRefresh.swift    # BGTaskScheduler
│       ├── Info.plist
│       └── Assets.xcassets/
└── README.md
```

## Разработка

1. Открыть `jokeonda/jokeonda.xcodeproj` в Xcode 15+.
2. В таргете `jokeonda` указать свой `DEVELOPMENT_TEAM` (Signing & Capabilities → Team).
3. Bundle ID по умолчанию `com.jokeonda.app` — поменяй, если занят.
4. Capabilities: Background Modes уже включает `fetch` и `processing` (через Info.plist), отдельно ничего нажимать не нужно.
5. Запустить на симуляторе / устройстве. На первом запуске приложение спросит разрешение на уведомления.

### Тест уведомления локально

Локальные уведомления в симуляторе работают: можно временно поменять `notificationHour`/`notificationMinute` в `NotificationScheduler.swift` на ближайшее время + 1 минута, чтобы убедиться что прилетает.

## Деплой

App Store Connect → создать приложение с bundle ID `com.jokeonda.app` → Archive в Xcode → загрузить.

После релиза процесс эксплуатации — это просто `git commit` в `jokes.json`.
