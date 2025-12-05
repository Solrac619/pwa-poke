pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonarqube-token')
        VERCEL_TOKEN = credentials('vercel-token')
        VERCEL_ORG_ID = credentials('vercel-org-id')
        VERCEL_PROJECT_ID = credentials('vercel-project-id')
    }

    stages {

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
            -Dsonar.login=$SONAR_TOKEN
        """
      }
    }
  }
}

        stage("Quality Gate") {
            steps {
                timeout(time: 3, unit: 'MINUTES') {
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
                export VERCEL_ORG_ID=$VERCEL_ORG_ID
                export VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID

                vercel deploy --prod \
                --token=$VERCEL_TOKEN \
                --yes
                """
            }
        }
    }
}
