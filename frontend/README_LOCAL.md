docker build -t streamify_frontend:local .

# for mac
docker run -d --name streamify_frontend_local -p 3001:3000 -v /Applications/Dic_projects/projects/streamify_project/frontend:/app -v /app/node_modules streamify_frontend:local

# for windows
docker run -d --name streamify_frontend_local -p 3001:3000 -v "/f/Web_Development/wamp64/www/Github Projects/streamify_project/frontend:/app" -v /app/node_modules streamify_frontend:local
