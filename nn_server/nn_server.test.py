import unittest, json
from nn_server import app

class TestNNServer(unittest.TestCase):
    def setUp(self):        
        self.app = app.test_client()

    def testInvalidGET(self):
        print("Testing invalid GET routes are rejected:")
        rv = self.app.get('/')
        assert rv.status == '400 BAD REQUEST'
        print("\tPass 1 - 400 response code, for invalid GET route: /")
        rv = self.app.get('/check')
        assert rv.status == '400 BAD REQUEST'
        print("\tPass 2 - 400 response code, for invalid GET route: /api")
        rv = self.app.get('/check/api')
        assert rv.status == '400 BAD REQUEST'
        print("\tPass 3 - 400 response code, for invalid GET route: /api/check")

    def testInvalidPOSTRoute(self):
        print("Testing invalid POST routes are rejected:")
        validBody = json.dumps({"type": "text", "content": "A body of text to test."})
        rv = self.app.post('/', data=validBody, headers={'Content-Type': 'application/json'})
        assert rv.status == '405 METHOD NOT ALLOWED'
        print("\tPass 1 - 400 response code, for invalid POST route: /")
        rv = self.app.post('/api', data=validBody, headers={'Content-Type': 'application/json'})
        assert rv.status == '405 METHOD NOT ALLOWED'
        print("\tPass 2 - 400 response code, for invalid POST route: /api")

    def testInvalidPOSTBody(self):
        print("Testing invalid POST body is rejected:")
        rv = self.app.post('/api/check', data=json.dumps({"name": "text", "content": "A body of text to test."}), headers={'Content-Type': 'application/json'})
        assert rv.status == '400 BAD REQUEST'
        print("\tPass 1 - 400 response code, for invalid body to POST valid route: /api/check")
        rv = self.app.post('/api/check', data=json.dumps({"type": "image", "content": "A body of text to test."}), headers={'Content-Type': 'application/json'})
        assert rv.status == '400 BAD REQUEST'
        print("\tPass 2 - 400 response code, for invalid body to POST valid route: /api/check")
        rv = self.app.post('/api/check', data=json.dumps({"type": "text", "body": "A body of text to test."}), headers={'Content-Type': 'application/json'})
        assert rv.status == '400 BAD REQUEST'
        print("\tPass 3 - 400 response code, for invalid body to POST valid route: /api/check")
        
    def testValidPOST(self):
        print("Testing valid POST request is accepted")
        rv = self.app.post('/api/check', data=json.dumps({"type": "text", "content": "A body of text to test."}), headers={'Content-Type': 'application/json'})
        assert rv.status == '200 OK'
        print("\tPass 1 - 200 response code, for valid body to valid POST route: /api/check")
        body = rv.get_json(force=True, silent=True)        
        print("\tPass 2 - Result is json, for valid body to valid POST route: /api/check")
        assert 'result' in body.keys()
        print("\tPass 3 - Has result key, for valid body to valid POST route: /api/check")
        result = body['result']
        assert isinstance(result, float)
        print("\tPass 4 - Result is type float, for valid body to valid POST route: /api/check")
    
if __name__ == '__main__':
    print("===== Testing nn_server =====")
    unittest.main()
