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
| Method | Path | Description |
|--------|------|-------------|
|PUT|/api/report|Update rating of fake news source|
|POST|/api/find|Get analytics of a news source|
|POST|/api/insert|Add fake news article/source|
|DELETE|/api/delete|Remove known fake fact|
# Response Code
| Code | Description |
|------|-------------|
| ```200```  |Valid request with body in response.|
| ```201```  |Valid request without response in body.|
| ```400```  |Bad request. Request body is likely incomplete|
| ```401```  |Unauthorized request. Request token is likely incorrect or missing|
| ```503```  |Cannot connect|

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

