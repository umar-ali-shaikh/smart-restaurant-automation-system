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
    }
}