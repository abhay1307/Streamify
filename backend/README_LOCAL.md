docker build . -f Dockerfile -t streamify_backend:1.0

[//]: # (for mac)
docker run -d --name streamify_backend -p 8002:8002 -v /Applications/Dic_projects/projects/streamify_project/backend:/app streamify_backend:1.0

[//]: # (for windows)
docker run -d --name streamify_backend -p 8002:8002 -v F:\Web_Development\wamp64\www\Github Projects\fast-sso\backend:/app streamify_backend:1.0