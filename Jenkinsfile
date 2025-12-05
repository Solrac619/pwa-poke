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
                        "${scannerHome}/bin/sonar-scanner" \
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
            when {
                branch 'main'
            }
            steps {
                sh """
                echo "Instalando Vercel CLI..."
                npm install -g vercel

                export VERCEL_ORG_ID=$VERCEL_ORG_ID
                export VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID

                echo "Ejecutando despliegue en Vercel..."
                DEPLOY_OUTPUT=\$(vercel deploy --prod --yes --token=$VERCEL_TOKEN --output=json)

                echo "=== RAW DEPLOY OUTPUT ==="
                echo "\$DEPLOY_OUTPUT"

                # Extraer URL del JSON
                DEPLOY_URL=\$(echo "\$DEPLOY_OUTPUT" | grep -oP '"url":\\s*"\K[^"]+')

                echo "======================================"
                echo "🚀 DEPLOY COMPLETADO"
                echo "🌍 URL DE PRODUCCIÓN: https://\$DEPLOY_URL"
                echo "======================================"
                """
            }
        }
    }
}
