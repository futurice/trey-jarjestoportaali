targetScope = 'resourceGroup'

@description('Whether to create ACS at all.')
param enabled bool = true

@description('ACS resource name.')
param communicationServiceName string

@description('ACS location (regional).')
param location string = 'global'

@description('Data residency geography (e.g., "Europe", "United States").')
param dataLocation string = 'Europe'

@description('ECS domain resource ID to link.')
param emailDomainId string

resource acs 'Microsoft.Communication/communicationServices@2025-09-01' = if (enabled) {
  name: communicationServiceName
  location: location
  properties: {
    dataLocation: dataLocation
    linkedDomains: [
      emailDomainId
    ]
  }
}

output acsId string = enabled ? acs.id : ''
output endpoint string = enabled ? acs.?properties.hostname : ''
