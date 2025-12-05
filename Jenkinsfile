pipeline {
    agent any

    environment {
        SONAR_TOKEN       = credentials('sonarqube-token')
        VERCEL_TOKEN      = credentials('vercel-token')
        VERCEL_ORG_ID     = credentials('vercel-org-id')
        VERCEL_PROJECT_ID = credentials('vercel-project-id')
    }

    stages {

        stage('Setup Node') {
            steps {
                sh """
                apt-get update
                apt-get install -y curl
                curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
                apt-get install -y nodejs
                node -v
                npm -v
                """
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm test --watchAll=false'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('MySonar') {
                    script {
                        def scannerHome = tool name: 'SonarScanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                        sh """
                        ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=pwa \
                            -Dsonar.sources=src \
                            -Dsonar.host.url=http://sonarqube:9000 \
                            -Dsonar.token=$SONAR_TOKEN
                        """
                    }
                }
            }
        }

        stage("Quality Gate") {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

            stage('Deploy to Production') {
        when { expression { true } }
        steps {
            sh """
            echo "Instalando Vercel CLI y jq..."
            npm install -g vercel
            apt-get update && apt-get install -y jq

            export VERCEL_ORG_ID=$VERCEL_ORG_ID
            export VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID

            echo "Ejecutando despliegue en Vercel..."

            # Ejecutamos deployment y guardamos la salida
            vercel deploy --prod --yes --confirm --token=$VERCEL_TOKEN > deploy.txt

            echo "=== RAW DEPLOY OUTPUT ==="
            cat deploy.txt

            DEPLOY_URL=\$(tail -n 1 deploy.txt)

            echo "======================================"
            echo "🚀 DEPLOY COMPLETADO"
            echo "🌍 URL DE PRODUCCIÓN: \$DEPLOY_URL"
            echo "======================================"
            """
        }
    }

    }
}
