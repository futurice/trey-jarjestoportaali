param accountName string
param location string = resourceGroup().location
param tags object = {}

param containers array = [
  {
    name: 'Organization'
    id: 'Organization'
    partitionKey: '/id'
  }
  {
      name: 'Survey'
      id: 'Survey'
      partitionKey: '/id'
  }
  {
    name: 'SurveyResponse'
    id: 'SurveyResponse'
    partitionKey: '/id'
  }
]

param databaseName string = ''
param keyVaultName string
param principalIds array = []

// Because databaseName is optional in main.bicep, we make sure the database name is set here.
var defaultDatabaseName = 'TREY'
var actualDatabaseName = !empty(databaseName) ? databaseName : defaultDatabaseName

module cosmos '../core/database/cosmos/sql/cosmos-sql-db.bicep' = {
  name: 'cosmos-sql'
  params: {
    accountName: accountName
    location: location
    tags: tags
    containers: containers
    databaseName: actualDatabaseName
    keyVaultName: keyVaultName
    principalIds: principalIds
  }
}

output accountName string = cosmos.outputs.accountName
output connectionStringKey string = cosmos.outputs.connectionStringKey
output databaseName string = cosmos.outputs.databaseName
output endpoint string = cosmos.outputs.endpoint
output roleDefinitionId string = cosmos.outputs.roleDefinitionId
