metadata description = 'Creates a role assignment for a service principal on a specific resource.'
param principalId string

@allowed([
  'Device'
  'ForeignGroup'
  'Group'
  'ServicePrincipal'
  'User'
])
param principalType string = 'ServicePrincipal'
param roleDefinitionId string
param resourceId string

var fullRoleDefinitionId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', roleDefinitionId)

resource existingResource 'Microsoft.KeyVault/vaults@2022-07-01' existing = {
  name: last(split(resourceId, '/'))
}

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(subscription().id, resourceGroup().id, principalId, roleDefinitionId, resourceId)
  scope: existingResource
  properties: {
    principalId: principalId
    principalType: principalType
    roleDefinitionId: fullRoleDefinitionId
  }
} 