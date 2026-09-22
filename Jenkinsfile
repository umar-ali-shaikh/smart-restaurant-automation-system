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
            string(credentialsId: 'MONGO_URI', variable: 'MONGO_URI'),
            string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET'),
            string(credentialsId: 'REDIS_URL', variable: 'REDIS_URL'),
            string(credentialsId: 'CLOUDINARY_CLOUD_NAME', variable: 'CLOUDINARY_CLOUD_NAME'),
            string(credentialsId: 'CLOUDINARY_API_KEY', variable: 'CLOUDINARY_API_KEY'),
            string(credentialsId: 'CLOUDINARY_API_SECRET', variable: 'CLOUDINARY_API_SECRET'),
            string(credentialsId: 'NODE_ENV', variable: 'NODE_ENV')
        ]) {
            sh '''
                cat > backend/.env <<EOF
NODE_ENV=$NODE_ENV
PORT=5001
MONGO_URI=$MONGO_URI
JWT_SECRET=$JWT_SECRET
CLIENT_URL=http://localhost:5173
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