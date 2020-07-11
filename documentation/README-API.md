# Fake News Detector API
All communication throughout the system will be facilitated through the API. The following document specifies the API structure and the use thereof.

---

# API Endpoints
## API Server Endpoints
| Method | Path | Description |
|--------|------|-------------|
|POST|/api/report|Report news article/source as fake|
|POST|/api/find|Get analytics of a news source|
|POST|/api/check|Check if a news article/source is fake|
## Neural Network Server Endpoints
| Method | Path | Description |
|--------|------|-------------|
|POST|/api/check|Checks if a news article/source is fake|
## Database Server Endpoints
### Sources Table:
| Method | Path | Description |
|--------|------|-------------|
|GET|/api/sources|Get list of all listed fake news sources|
|POST|/api/sources|Create new fake news source listing|
|GET|/api/sources/:sourceId|Get a specific source based on ID|
|PUT|/api/sources/:sourceId|Update rating of news source based on ID|
|DELETE|/api/sources/:sourceId|Remove source listing based on ID|
### Facts Table:
| Method | Path | Description |
|--------|------|-------------|
|GET|/api/facts|Get list of all known popular fake facts|
|POST|/api/facts|Create new fake fact fact listing|
|GET|/api/facts/:factId|Get a specific fact based on ID|
|DELETE|/api/facts/:factId|Remove fact listing based on ID|
# Response Code
| Code | Description |
|------|-------------|
| ```200```  |Valid request|
|```201```|Entry created|
| ```404```  |Entry not found|
|```500```|Internal server error|

---

# Tokenization

---

# API

## Report
#### HTTP Request
```
POST /api/report
```
#### Request Body
The fields required for the request body can be seen below.
```
{
    "type": "source"
    "content": "https://www.news24.com/"
}
```
#### Response Body
No body will be returned by this endpoint.
#### Response Status Codes
| Code | Description       |
| ---- | ----------------- |
| ```201```  | Report Successful |
| ```402```  | Invalid ```type```      |
| ```403```  | Invalid ```Content```   |

## Find

## Check

---

# Neural Network

---

# Database
## Sources
### GET sources
#### HTTP Request
```
GET /api/sources
```
#### Request Body
No body is required by this endpoint.
#### Response Body
An example of the response body can be seen below.
```
{
    "count": 1,
    "sources": [
        {
            "name": "CNN",
            "tld": "https://edition.cnn.com/",
            "rating": 500,
            "_id": "5edf31165d617a2850632422",
            "request": {
                "type": "GET",
                "description": "URL to get specific source",
                "url": "http://localhost:3000/sources/5edf31165d617a2850632422"
            }
        }
    ]
}
```
#### Response Status Codes
| Code | Description       |
| ---- | ----------------- |
| ```200```  | Request successful |
| ```404```  | Not found|
| ```500```  | Internal server error|
### POST source
#### HTTP Request
```
POST /api/sources
```
#### Request Body
An example of the request body can be seen below.
```
{
    "name": "CNN",
    "tld": "www.cnn.com",
    "rating": 200
}
```
#### Response Body
```
{
    "message": "Created source successfully",
    "createdSource": {
        "_id": "5f09ab9cc902d02da349f1b0",
        "name": "CNN",
        "tld": "www.cnn.com",
        "rating": 200,
        "request": {
            "type": "GET",
            "description": "URL to get new source",
            "url": "http://localhost:3000/sources/5f09ab9cc902d02da349f1b0"
        }
    }
}
```
#### Response Status Codes
| Code | Description       |
| ---- | ----------------- |
| ```201```  | Created Successfully |
| ```404```  | Not Found |
| ```500```  | Internal server error|

### GET single source
#### HTTP Request
```
GET /api/sources/:sourceId
```
#### Request Body
No body is required by this endpoint.
#### Response Body
```
{
    "source": {
        "_id": "5edf31165d617a2850632422",
        "name": "CNN",
        "tld": "https://edition.cnn.com/",
        "rating": 500
    },
    "request": {
        "type": "GET",
        "description": "URL to get all sources",
        "url": "http://localhost:3000/sources/"
    }
}
```
#### Response Status Codes
| Code | Description       |
| ---- | ----------------- |
| ```200```  | Source Found |
| ```404```  | No database entry for provided ID|
| ```500```  | Internal server error|
### UPDATE source rating
#### HTTP Request
```
PUT /api/sources/:sourceId
```
#### Request Body
```
{
    "rating": 150
}
```
#### Response Body
```
{
    "message": "Source Rating Updated",
    "request": {
        "type": "GET",
        "description": "URL to get updated source",
        "url": "http://localhost:3000/sources/5f09ab9cc902d02da349f1b0"
    }
}
```
#### Response Status Codes
| Code | Description       |
| ---- | ----------------- |
| ```200```  | Source Rating Updated |
| ```404```  | Not Found |
| ```500```  | Internal server error|
### DELETE source
#### HTTP Request
```
DELETE /api/sources/:sourceId
```
#### Request Body
No body is required by this endpoint.
#### Response Body
```
{
    "message": "Source deleted"
}
```
#### Response Status Codes
| Code | Description       |
| ---- | ----------------- |
| ```200```  | Source deleted |
| ```404```  | Not Found |
| ```500```  | Internal server error|

---

# Node Packages
## Development Packages
|Name|Description|Version|
|---|--------|-----|
|Nodemon| Used to reload the server after every save. Saves time and speeds up development|2.0.4|

## Front-end Packages
|Name|Description|Version|
|---|--------|----|
|bootstrap|Styling and display enhancement package|4.5|
|jQuery|Creates an easier waay to manipulate the DOM|3.5.1|
|popper.js|Creates an easier waay to manipulate the DOM, it is used in conjunction with Bootstrap|1.16.1|

## Back-end Packages
|Name|Description|Version|
|---|--------|----|
|body-parser|Node.js body parsing middleware.|1.19|
|CORS|CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.|2.8.5|
|express|Fast, unopinionated, minimalist middleware web framework for node|4.17.1|
|mocha|A javascript library used for automated testing|7.2.0|
|mongoose|Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.|5.9.18|
|morgan|HTTP request logger middleware for node.js|1.10|

