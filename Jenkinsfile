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
                withCredentials([
                    string(credentialsId: 'mongo-uri', variable: 'MONGO_URI'),
                    string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET'),
                    string(credentialsId: 'client-url', variable: 'CLIENT_URL'),
                    string(credentialsId: 'redis-url', variable: 'REDIS_URL'),
                    string(credentialsId: 'cloudinary-cloud-name', variable: 'CLOUDINARY_CLOUD_NAME'),
                    string(credentialsId: 'cloudinary-api-key', variable: 'CLOUDINARY_API_KEY'),
                    string(credentialsId: 'cloudinary-api-secret', variable: 'CLOUDINARY_API_SECRET')
                ]) {
                    sh '''
                        cat > backend/.env <<EOF
NODE_ENV=development
PORT=5001
MONGO_URI=$MONGO_URI
JWT_SECRET=$JWT_SECRET
CLIENT_URL=$CLIENT_URL
REDIS_URL=$REDIS_URL
CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET
EOF

                        docker rm -f restaurant-backend-jenkins || true

                        docker run -d \
                          --name restaurant-backend-jenkins \
                          -p 5002:5001 \
                          --env-file backend/.env \
                          restaurant-backend:jenkins
                    '''
                }
            }
        }
    }
}