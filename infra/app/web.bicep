param name string
param location string = resourceGroup().location
param tags object = {}
param serviceName string = 'web'
param appCommandLine string = 'pm2 serve /home/site/wwwroot --no-daemon --spa'
param applicationInsightsName string = ''
param appServicePlanId string
param stytchPublicToken string
param sentryDsn string

module web '../core/host/appservice.bicep' = {
  name: '${name}-deployment'
  params: {
    name: name
    location: location
    appCommandLine: appCommandLine
    applicationInsightsName: applicationInsightsName
    appServicePlanId: appServicePlanId
    runtimeName: 'node'
    runtimeVersion: '20-lts'
    tags: union(tags, { 'azd-service-name': serviceName })
    appSettings: {
      STYTCH_PUBLIC_TOKEN: stytchPublicToken
      SENTRY_DSN: sentryDsn
    }
  }
}

output SERVICE_WEB_IDENTITY_PRINCIPAL_ID string = web.outputs.identityPrincipalId
output SERVICE_WEB_NAME string = web.outputs.name
output SERVICE_WEB_URI string = web.outputs.uri
