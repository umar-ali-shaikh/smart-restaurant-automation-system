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
                        set -e

                        echo "Creating backend environment file..."

                        cat > backend/.env <<EOF
NODE_ENV=$NODE_ENV
PORT=5001
MONGO_URI=$MONGO_URI
JWT_SECRET=$JWT_SECRET
CLIENT_URL=http://localhost:5173
REDIS_URL=redis://redis:6379
CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET
EOF

                        echo "Creating Docker network if it does not exist..."

                        docker network inspect restaurant-network >/dev/null 2>&1 || \
                        docker network create restaurant-network

                        echo "Removing old Redis container..."

                        docker rm -f restaurant-redis-jenkins || true

                        echo "Starting Redis..."

                        docker run -d \
                          --name restaurant-redis-jenkins \
                          --network restaurant-network \
                          --network-alias redis \
                          redis:7-alpine

                        echo "Waiting for Redis..."

                        until docker exec restaurant-redis-jenkins redis-cli ping | grep -q PONG; do
                            sleep 1
                        done

                        echo "Redis is ready."

                        echo "Removing old backend container..."

                        docker rm -f restaurant-backend-jenkins || true

                        echo "Starting backend..."

                        docker run -d \
                          --name restaurant-backend-jenkins \
                          --network restaurant-network \
                          -p 5002:5001 \
                          --env-file backend/.env \
                          restaurant-backend:jenkins

                        echo "Waiting for backend..."

                        sleep 5

                        echo "Checking backend container..."

                        docker ps --filter "name=restaurant-backend-jenkins"

                        echo "Backend logs..."

                        docker logs --tail 50 restaurant-backend-jenkins

                        echo "Deployment completed successfully."
                    '''
                }
            }
        }
    }
}