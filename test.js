const http = require('http');

// Simple test suite for the To-Do List API
function testAPI() {
    console.log('🧪 Running API tests...\n');

    const baseURL = 'http://localhost:3000';

    // Test 1: GET /api/tasks (should return empty array initially)
    testEndpoint('GET', '/api/tasks', null, (status, data) => {
        console.log('✅ Test 1 - GET /api/tasks:', status === 200 ? 'PASS' : 'FAIL');
        if (status !== 200) {
            console.log('   Expected status 200, got', status);
        }
    });

    // Test 2: POST /api/tasks (add a new task)
    setTimeout(() => {
        testEndpoint('POST', '/api/tasks', { text: 'Test task' }, (status, data) => {
            console.log('✅ Test 2 - POST /api/tasks:', status === 201 ? 'PASS' : 'FAIL');
            if (status !== 201) {
                console.log('   Expected status 201, got', status);
            }

            // Test 3: GET /api/tasks (should now return the task)
            setTimeout(() => {
                testEndpoint('GET', '/api/tasks', null, (status, data) => {
                    console.log('✅ Test 3 - GET /api/tasks after POST:', status === 200 && data.length > 0 ? 'PASS' : 'FAIL');
                    if (status !== 200 || data.length === 0) {
                        console.log('   Expected status 200 and data, got status', status, 'and data length', data.length);
                    }

                    // Test 4: PUT /api/tasks/:id (toggle completion)
                    if (data.length > 0) {
                        const taskId = data[0].id;
                        setTimeout(() => {
                            testEndpoint('PUT', `/api/tasks/${taskId}`, null, (status, data) => {
                                console.log('✅ Test 4 - PUT /api/tasks/:id:', status === 200 ? 'PASS' : 'FAIL');
                                if (status !== 200) {
                                    console.log('   Expected status 200, got', status);
                                }

                                // Test 5: DELETE /api/tasks/:id
                                setTimeout(() => {
                                    testEndpoint('DELETE', `/api/tasks/${taskId}`, null, (status, data) => {
                                        console.log('✅ Test 5 - DELETE /api/tasks/:id:', status === 204 ? 'PASS' : 'FAIL');
                                        if (status !== 204) {
                                            console.log('   Expected status 204, got', status);
                                        }

                                        console.log('\n🎉 All tests completed!');
                                        process.exit(0);
                                    });
                                }, 1000);
                            });
                        }, 1000);
                    }
                });
            }, 1000);
        });
    }, 1000);
}

function testEndpoint(method, path, data, callback) {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => {
            body += chunk;
        });
        res.on('end', () => {
            try {
                const parsedData = body ? JSON.parse(body) : null;
                callback(res.statusCode, parsedData);
            } catch (e) {
                callback(res.statusCode, body);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`❌ Request failed: ${e.message}`);
        callback(0, null);
    });

    if (data) {
        req.write(JSON.stringify(data));
    }
    req.end();
}

// Start the server first
console.log('🚀 Starting server for testing...');
const { spawn } = require('child_process');
const server = spawn('node', ['app.js'], { stdio: 'inherit' });

// Wait for server to start
setTimeout(() => {
    testAPI();
}, 2000);

// Clean up on exit
process.on('exit', () => {
    if (server) {
        server.kill();
    }
});

process.on('SIGINT', () => {
    if (server) {
        server.kill();
    }
    process.exit();
});