import unittest
import json
from nn_server import app
import pytest


class TestNNServer(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def testInvalidGET1(self):
        '''
        Test Invalid GET Request :: Test 1 GET /
        '''
        rv = self.app.get('/')
        if (rv.status == '400 BAD REQUEST'):
            pass
        else:
            raise ValueError('Testing invalid GET Request - Test 1 failed')

    def testInvalidGET2(self):
        '''
        Test Invalid GET Request :: Test 2 GET /verify
        '''
        rv = self.app.get('/verify')
        if (rv.status == '400 BAD REQUEST'):
            pass
        else:
            raise ValueError('Testing invalid GET Request - Test 2 failed')

    def testInvalidGET3(self):
        '''
        Test Invalid GET Request :: Test 3 GET /api/verify
        '''
        rv = self.app.get('/api/verify')
        if (rv.status == '400 BAD REQUEST'):
            pass
        else:
            raise ValueError('Testing invalid GET Request - Test 3 failed')

    def testInvalidPOST1(self):
        '''
        Test Invalid POST Request :: Test 1 POST /
        '''
        rv = self.app.post('/', data=json.dumps(
            {"type": "text", "content": "A body of text to test."}),
            headers={'Content-Type': 'application/json'})
        if (rv.status == '405 METHOD NOT ALLOWED'):
            pass
        else:
            raise ValueError('Testing Invalid POST Request - Test 1 failed')

    def testInvalidPOST2(self):
        '''
        Test Invalid POST Request :: Test 2 POST /api
        '''
        rv = self.app.post('/', data=json.dumps(
            {"type": "text", "content": "A body of text to test."}),
            headers={'Content-Type': 'application/json'})
        if (rv.status == '405 METHOD NOT ALLOWED'):
            pass
        else:
            raise ValueError('Testing Invalid POST Request - Test 2 failed')

    def testInvalidPOSTBody1(self):
        '''
        Test Invalid POST Request Body :: Test 1 POST /verify
        '''
        rv = self.app.post('/verify', data=json.dumps(
            {"name": "text", "content": "A body of text to test."}), headers={'Content-Type': 'application/json'})
        if (rv.status == '400 BAD REQUEST'):
            pass
        else:
            raise ValueError('Test Invalid POST Request Body - Test 1 failed')

    def testInvalidPOSTBody2(self):
        '''
        Test Invalid POST Request Body :: Test 2 POST /verify
        '''
        rv = self.app.post('/verify', data=json.dumps(
            {"type": "image", "content": "A body of text to test."}), headers={'Content-Type': 'application/json'})
        if (rv.status == '400 BAD REQUEST'):
            pass
        else:
            raise ValueError('Test Invalid POST Request Body - Test 2 failed')

    def testInvalidPOSTBody3(self):
        '''
        Test Invalid POST Request Body :: Test 3 POST /verify
        '''
        rv = self.app.post('/verify', data=json.dumps(
            {"type": "text", "body": "A body of text to test."}), headers={'Content-Type': 'application/json'})
        if (rv.status == '400 BAD REQUEST'):
            pass
        else:
            raise ValueError('Test Invalid POST Request Body - Test 3 failed')

    def testValidPOST1(self):
        '''
        Test Valid POST Request :: Test 1 POST /verify
        '''
        rv = self.app.post('/verify', data=json.dumps(
            {"type": "text", "content": "A body of text to test."}), headers={'Content-Type': 'application/json'})
        if (rv.status == '200 OK'):
            pass
        else:
            raise ValueError('Testing valid POST Request - Test 1 failed')

    def testValidPOST2(self):
        '''
        Test Valid POST Request :: Test 2 POST /verify
        '''
        rv = self.app.post('/verify', data=json.dumps(
            {"type": "text", "content": "A body of text to test."}), headers={'Content-Type': 'application/json'})
        body = rv.get_json(force=True, silent=True)
        if isinstance(body, dict):
            pass
        else:
            raise ValueError('Testing valid POST Request - Test 2 failed')

    def testValidPOST3(self):
        '''
        Test Valid POST Request :: Test 3 POST /verify
        '''
        rv = self.app.post('/verify', data=json.dumps(
            {"type": "text", "content": "A body of text to test."}), headers={'Content-Type': 'application/json'})
        body = rv.get_json(force=True, silent=True)
        if 'response' in body.keys():
            pass
        else:
            raise ValueError('Testing valid POST Request - Test 3 failed')

    def testValidPOST4(self):
        '''
        Test Valid POST Request :: Test 4 POST /verify
        '''
        rv = self.app.post('/verify', data=json.dumps(
            {"type": "text", "content": "A body of text to test."}), headers={'Content-Type': 'application/json'})
        body = rv.get_json(force=True, silent=True)
        if isinstance(body['response']['result'], float):
            pass
        else:
            raise ValueError('Testing valid POST Request - Test 4 failed')


if __name__ == '__main__':
    unittest.main()
