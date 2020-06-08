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