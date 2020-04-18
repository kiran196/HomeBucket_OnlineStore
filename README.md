# HomeBucket_OnlineStore
HomeBucker. An online store for all household, kitchenware, bedding requirements.

nodejs_backend.js <- Nodejs Handler

public_html <- All Static html/css files

shopDetails_mongoDump <- mongodb dump

### How to run
1. Clone the repository
2. Run nodejs_backend.js using following command
3. node nodejs_backend.js (It should result in "Listening on port 8081"
4. Run mongodb daemon and restore the dump using mongorestore (Mongodb port should be 27017)
5. Open browser and goto url http://localhost:8081
6. It should open up the index.html page from public_html
