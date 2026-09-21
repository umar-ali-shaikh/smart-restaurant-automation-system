pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'cd backend && npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'cd backend && npm test'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t restaurant-backend:jenkins ./backend'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker rm -f restaurant-backend-jenkins || true'
                sh 'docker run -d --name restaurant-backend-jenkins -p 5002:5001 --env-file backend/.env restaurant-backend:jenkins'
            }
        }
    }
}