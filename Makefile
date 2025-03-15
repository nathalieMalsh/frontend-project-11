install: # чистая установка зависимостей (устанавливает зависимости строго по package-lock.json)
	npm ci

link: # генерация ссылки
	npm link

# перед этим использовать npm link
publish: #отладка публикации
	npm publish --dry-run

lint: # запуск линтера
	npx eslint .

# npm init - для начала нового проекта и инициализации package.json
# npm install - установка зависимостей в соответствии package.json или добавление новых пакетов, создает или обновляет package-lock.json