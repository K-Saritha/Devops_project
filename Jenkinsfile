pipeline {
    agent any

    environment {
        IMAGE_NAME = 'todo-app'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Test Docker Image') {
        steps {
            bat """
            docker run -d --name todo-app-test -p 3001:3000 todo-app:latest
            ping 127.0.0.1 -n 10 > nul
            docker exec todo-app-test node -e "require('http').get('http://127.0.0.1:3000/api/tasks', r => process.exit(r.statusCode === 200 ? 0 : 1))"
            docker stop todo-app-test
            docker rm todo-app-test
            """
        }
    }


        stage('Deploy') {
            steps {
                bat """
                docker ps -a -q --filter "name=todo-app" | findstr . && docker stop todo-app && docker rm todo-app || echo No container to remove
                docker run -d -p 3000:3000 --name todo-app ${IMAGE_NAME}:latest
                """
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished'
        }
    }
}
