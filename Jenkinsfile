pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'todo-app'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                bat "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
            }
        }

        stage('Test Docker Image') {
            steps {
                bat """
                docker run -d --name todo-app-test-${BUILD_NUMBER} -p 3001:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}
                timeout /t 10
                docker exec todo-app-test-${BUILD_NUMBER} node -e "require('http').get('http://localhost:3000/api/tasks', r => process.exit(r.statusCode === 200 ? 0 : 1))"
                docker stop todo-app-test-${BUILD_NUMBER}
                docker rm todo-app-test-${BUILD_NUMBER}
                """
            }
        }

        stage('Deploy') {
            steps {
                bat """
                docker ps -a -q --filter "name=todo-app" | findstr . && docker stop todo-app && docker rm todo-app || echo No container to remove
                docker run -d -p 3000:3000 --name todo-app ${DOCKER_IMAGE}:latest
                """
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded! 🎉'
        }
        failure {
            echo 'Pipeline failed! ❌'
        }
    }
}
