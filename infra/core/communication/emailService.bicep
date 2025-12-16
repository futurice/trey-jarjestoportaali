targetScope = 'resourceGroup'

@description('Email Communication Service (ECS) name')
param emailServiceName string

@description('ECS location. ECS is commonly created in the global region.')
param ecsLocation string = 'global'

@description('Data residency geography for ECS/ACS data at rest (e.g., "Europe", "United States").')
param dataLocation string = 'Europe'

@allowed([
  'AzureManaged'
  'CustomerManaged'
  'CustomerManagedInExchangeOnline'
])
param domainManagement string = 'AzureManaged'

@description('Required when domainManagement is CustomerManaged / CustomerManagedInExchangeOnline. Example: "contoso.com".')
param customDomainName string = ''

@allowed([
  'Disabled'
  'Enabled'
])
param userEngagementTracking string = 'Disabled'

@description('Sender username resource name (a key for the resource). Example: "donotreply".')
param senderUsernameName string = 'donotreply'

@description('The sender username value. Example: "DoNotReply".')
param senderUsername string = 'DoNotReply'

@description('Optional display name for the sender.')
param senderDisplayName string = 'DoNotReply'

resource emailService 'Microsoft.Communication/emailServices@2025-09-01' = {
  name: emailServiceName
  location: ecsLocation
  properties: {
    dataLocation: dataLocation
  }
}

var domainResourceName = domainManagement == 'AzureManaged'
  ? 'AzureManagedDomain'
  : customDomainName

resource emailDomain 'Microsoft.Communication/emailServices/domains@2025-09-01' = {
  parent: emailService
  name: domainResourceName
  location: ecsLocation
  properties: {
    domainManagement: domainManagement
    userEngagementTracking: userEngagementTracking
  }
}

resource sender 'Microsoft.Communication/emailServices/domains/senderUsernames@2025-09-01' = {
  parent: emailDomain
  name: senderUsernameName
  properties: {
    username: senderUsername
    displayName: senderDisplayName
  }
}

output emailServiceId string = emailService.id
output emailDomainId string = emailDomain.id
output senderId string = sender.id
