param keyVaultName string
param apiName string
param webUri string

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' existing = {
  name: keyVaultName
}

resource jwtSecret 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = {
  parent: keyVault
  name: 'JWT-SECRET'
  properties: {
    value: uniqueString(resourceGroup().id, 'jwt-secret')
  }
}

resource jwtIssuer 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = {
  parent: keyVault
  name: 'JWT-ISSUER'
  properties: {
    value: 'https://${apiName}.azurewebsites.net'
  }
}

resource jwtAudience 'Microsoft.KeyVault/vaults/secrets@2022-07-01' = {
  parent: keyVault
  name: 'JWT-AUDIENCE'
  properties: {
    value: webUri
  }
} 
