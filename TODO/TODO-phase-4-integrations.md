# TODO: Phase 4 - Integrations

**Created by:** AI Assistant  
**Date:** January 3, 2025  
**Purpose:** Connect external services (Slack, GitHub, Salesforce) with OAuth and credential management

## 📋 Task Breakdown

### Phase 4.1: Integration Framework

- [ ] Create convex/integrations.ts
  - [ ] create mutation
  - [ ] list query (by organization)
  - [ ] getByProvider query
  - [ ] update mutation
  - [ ] updateStatus mutation
  - [ ] disconnect mutation
  - [ ] testConnection action
- [ ] Create convex/lib/encryption.ts
  - [ ] Encrypt credentials before storage
  - [ ] Decrypt credentials for use
  - [ ] Key rotation support
- [ ] Define integration provider interface
- [ ] Create provider registry

### Phase 4.2: OAuth Flow Infrastructure

- [ ] Create app/api/integrations/[provider]/callback/route.ts
- [ ] Create app/api/integrations/[provider]/authorize/route.ts
- [ ] Implement OAuth state management (CSRF protection)
- [ ] Handle token exchange
- [ ] Store encrypted tokens in Convex
- [ ] Implement token refresh logic

### Phase 4.3: Slack Integration

- [ ] Create lib/integrations/slack.ts
  - [ ] OAuth authorization URL generation
  - [ ] Token exchange handling
  - [ ] API client wrapper
- [ ] Implement Slack actions:
  - [ ] Send message to channel
  - [ ] Send DM to user
  - [ ] Post to thread
  - [ ] Add reaction
- [ ] Add Slack as workflow step type
- [ ] Test connection functionality

### Phase 4.4: GitHub Integration

- [ ] Create lib/integrations/github.ts
  - [ ] OAuth authorization URL generation
  - [ ] Token exchange handling
  - [ ] API client wrapper (Octokit)
- [ ] Implement GitHub actions:
  - [ ] Create issue
  - [ ] Create pull request comment
  - [ ] Trigger workflow dispatch
  - [ ] Create/update file
- [ ] Implement GitHub webhooks receiver
- [ ] Add GitHub as workflow step type

### Phase 4.5: Custom Webhook Integration

- [ ] Create generic webhook sender
  - [ ] HTTP method selection
  - [ ] Custom headers
  - [ ] Body template with variables
  - [ ] Authentication options (API key, Bearer, Basic)
- [ ] Add retry configuration
- [ ] Add response handling
- [ ] Add timeout configuration

### Phase 4.6: Integrations UI

- [ ] Create integrations/page.tsx
- [ ] Implement integration-card.tsx
  - [ ] Provider logo and name
  - [ ] Connection status indicator
  - [ ] Last sync timestamp
  - [ ] Connect/Disconnect button
- [ ] Implement oauth-button.tsx
  - [ ] Initiate OAuth flow
  - [ ] Handle popup/redirect
- [ ] Create integrations/[provider]/page.tsx (config page)
- [ ] Implement integration-form.tsx
  - [ ] Provider-specific configuration
  - [ ] Test connection button
  - [ ] Save settings

### Phase 4.7: Integration in Workflow Editor

- [ ] Add integration step type to editor
- [ ] Create step configuration UI for each provider
- [ ] Add credential selection dropdown
- [ ] Add action selection for each provider
- [ ] Add input mapping for action parameters

## 🎯 Expected Outcomes

- [ ] Users can connect Slack workspace
- [ ] Users can connect GitHub repository
- [ ] Custom webhooks can be configured
- [ ] Integrations appear as workflow step options
- [ ] Credentials are securely encrypted
- [ ] Connection status is visible on integrations page
- [ ] Test connection verifies credentials work

## ⚠️ Risks & Considerations

- OAuth tokens expire and need refresh handling
- Credentials must never be logged or exposed
- Rate limits vary by provider (implement backoff)
- Slack/GitHub may revoke tokens - handle gracefully
- Encryption key management is critical for security

## 🔄 Dependencies

- Phase 2 complete (workflow editor, steps)
- Slack App created in Slack API console
- GitHub OAuth App created in GitHub settings
- Encryption key configured in environment
