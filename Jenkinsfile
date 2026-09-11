pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'cd backend && npm ci'
            }
        }

        stage('Test') {
            steps {
                bat 'cd backend && npm test'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t restaurant-backend:jenkins ./backend'
            }
        }

        stage('Deploy') {
            steps {
                bat 'docker rm -f restaurant-backend-jenkins || exit 0'
                bat 'docker run -d --name restaurant-backend-jenkins -p 5002:5001 --env-file backend/.env restaurant-backend:jenkins'
            }
        }
    }
}