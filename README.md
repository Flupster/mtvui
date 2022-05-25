# The UI for Minusten.TV

### Build the static files  
`yarn install`  
`yarn run generate`

The static files should be located in `.output/public`

### Example NGINX config
```
 server {
    server_name minusten.tv;
    root /var/www/minusten.tv;

    location / {
          index  index.html;
          try_files $uri $uri/ /index.html;
    }

    location /stream.flv {
        proxy_pass https://url-to-node-media-server/live/channel.flv;
    }

    location /api/live {
        proxy_pass https://url-to-node-media-server/api/streams/live/channel;
    }

    location /socket.io {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;

        proxy_pass http://url-to-streamer/socket.io;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    listen [::]:80;
    listen 80;
}
```