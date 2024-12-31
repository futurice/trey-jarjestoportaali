# Use Azure Blob Storage with SAS Links for Document Attachments

## Context and Problem Statement
We need a solution for storing and retrieving document attachments uploaded by users from different organizations. These documents are associated with various applications within their respective organizations. The solution should prioritize security, scalability, and cost-effectiveness while ensuring read-only access to retrieved documents.

## Considered Options
* Store documents in Azure Blob Storage and generate Shared Access Signature (SAS) links with read-only permissions for retrieval.
* Store documents in Azure Files and leverage Azure Active Directory for authentication and authorization.
* tore documents directly within the application database.

## Decision Outcome
Chosen option: Azure Blob Storage with SAS Links

We chose Azure Blob Storage with SAS links for several reasons. 
Firstly, SAS links offer fine-grained control over access permissions and can be set to expire, ensuring that only authorized users can read the documents. Secondly, it's a cost-effective solution with tiered storage options (hot, cool, and archive) that allow us to optimize costs based on how frequently the documents are accessed.
Finally, generating and managing SAS links is simpler than implementing and managing Azure AD authentication for file shares, making it a more straightforward solution for our needs.

If SAS links are inadvertently exposed or shared with unauthorized individuals, it could lead to unauthorized access to sensitive documents. Mitigations include:
* Implementing strict access controls and policies around SAS link generation and distribution.
* Using short expiry times and limiting the number of uses for each SAS link.
* Revoking SAS links when they are no longer needed.