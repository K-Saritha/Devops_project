pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'todo-app'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
            }
        }

        stage('Run Docker Container') {
            steps {
                echo 'Running Docker container for testing...'
                sh "docker run -d --name todo-app-test-${BUILD_NUMBER} -p 3000:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh 'sleep 10' // Wait for container to start
                sh 'docker exec todo-app-test-${BUILD_NUMBER} node -e "require(\'http\').get(\'http://localhost:3000/api/tasks\', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on(\'error\', () => process.exit(1))" || exit 1' // Test the API
                sh "docker stop todo-app-test-${BUILD_NUMBER}"
                sh "docker rm todo-app-test-${BUILD_NUMBER}"
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
               
                echo 'Deployment steps would go here'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
            sh "docker rmi ${DOCKER_IMAGE}:latest || true"
        }
        success {
            echo 'Pipeline succeeded! 🎉'
        }
        failure {
            echo 'Pipeline failed! ❌'
        }
    }
}