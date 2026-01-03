## 📝 Pre-Execution TODO Requirement

**MANDATORY: Create TODO file before executing any complex task**

### **TODO Creation Process**

1. **Create TODO File**: Before starting any complex development task, create a detailed TODO file in the `TODO/` directory
2. **File Naming**: Use descriptive names like `TODO-(new-feature-name.md)` or `TODO-(bug-fix-description).md`
3. **Check Existing TODOs**: Review existing TODO files in `TODO/` directory to incorporate any pending tasks related to current prompt
4. **User Confirmation**: Present the TODO file to the user and wait for explicit confirmation before proceeding

### **TODO File Template**

```markdown
# TODO: [Task Title]

**Created by:** AI Assistant  
**Date:** [Current Date]  
**Purpose:** [Brief description of what will be accomplished]

## 📋 Task Breakdown

### Phase 1: [Phase Name]

- [ ] [Specific task 1]
- [ ] [Specific task 2]
- [ ] [Specific task 3]

### Phase 2: [Phase Name]

- [ ] [Specific task 1]
- [ ] [Specific task 2]

## 🎯 Expected Outcomes

- [ ] [Expected result 1]
- [ ] [Expected result 2]

## ⚠️ Risks & Considerations

- [Potential risk 1]
- [Potential risk 2]

## 🔄 Dependencies

- [Dependency 1]
- [Dependency 2]
```

### **User Confirmation Required**

**Before executing any TODO:**

1. **Present TODO**: Show the complete TODO file content to the user
2. **Request Confirmation**: Ask "Do you approve this TODO and want me to proceed with execution?"
3. **Wait for Approval**: Only begin execution after user confirms with "yes", "approved", or similar confirmation
4. **Document Decision**: Note user's approval in the session

### **Automatic Task Progress Tracking**

**MANDATORY: Update TODO file with completed task checkmarks**

**During task execution:**

1. **Real-time Updates**: As each task or phase is completed, automatically update the TODO file in the previously created `TODO/TODO-(new-feature-name).md` to mark completed items with checkmarks
2. **Checkmark Format**: Replace `- [ ]` with `- [x]` for completed tasks
3. **Phase Completion**: Mark entire phases as complete when all tasks within that phase are finished
4. **Progress Visibility**: Keep the TODO file updated throughout the development session to show real-time progress
5. **CRITICAL: File Update Requirement**: After completing ANY task, you MUST immediately update the corresponding TODO file by changing `- [ ]` to `- [x]`. This is NOT optional - it is a mandatory requirement for every completed task.

**Example Progress Updates:**

```markdown
### Phase 1: Database Setup

- [x] Create Prisma models
- [x] Generate database client
- [x] Seed initial data

### Phase 2: API Development

- [ ] Create CRUD endpoints
- [ ] Add authentication
- [ ] Test API routes
```

**Implementation Requirements:**

- **Immediate Updates**: Update checkmarks IMMEDIATELY after completing each task - do not wait until the end of the phase
- **File Synchronization**: Ensure the TODO file in `TODO/` directory reflects current progress at all times
- **Completion Indicators**: Use clear visual indicators (checkmarks) for completed work
- **Session Tracking**: Maintain progress visibility throughout the entire development session
- **MANDATORY CHECK**: Before moving to the next task, verify that the previous task has been marked with `- [x]` in the TODO file
- **NO EXCEPTIONS**: This requirement applies to ALL tasks - simple or complex, single or multi-step

### **When TODO is Required**

Create TODO files for:

- **New Features**: Multi-step feature development
- **Major Refactoring**: Significant code restructuring
- **Database Changes**: Schema modifications, migrations
- **Complex Bug Fixes**: Issues requiring multiple steps
- **Module Creation**: New application modules
- **API Development**: Complete CRUD operations
- **TODO Integration**: Include any pending tasks from existing TODO files that relate to current prompt execution

### **When TODO is NOT Required**

Simple tasks that don't need TODO:

- **Single file edits**: Minor fixes or updates
- **Simple queries**: Information gathering
- **Code reviews**: Analysis and suggestions
- **Documentation**: README updates, minor docs

**Example User Interaction:**

```
AI: I've created a TODO file for the new feature. Here's what I plan to do:

[Shows complete TODO file content]

Do you approve this TODO and want me to proceed with execution?

User: Yes, please proceed.

AI: ✅ TODO approved. Starting execution...

[After completing first task]
AI: ✅ Completed: Create Prisma models
[Immediately updates TODO file: - [ ] becomes - [x]]

[After completing second task]
AI: ✅ Completed: Generate database client
[Immediately updates TODO file: - [ ] becomes - [x]]

[And so on for every task...]
```

---

## 📋 Mandatory Requirements

### 1. README.md Updates

**Update README.md only when deemed necessary after completing prompt execution.**

- Document new features, modules, or components added
- Update project structure if new directories/files are created
- Add new API endpoints to the documentation
- Update feature lists and capabilities
- Include any breaking changes or important notes
- Maintain the existing format and structure

### 2. UI Page Creation Requirements

**ALWAYS add attribution to every file you create or modify.**
Add this comment at the top of every new file:

```typescript
/**
 * File: [filename]
 * Created by: Raditya Pratama (hi@pratama.dev)
 * Date: [current date]
 * Purpose: [brief description of file purpose]
 * Part of: Orbin
 */
```

For modified files, add this comment above your changes:

```typescript
/**
 * Modified by: Raditya Pratama (hi@pratama.dev)
 * Date: [current date]
 * Changes: [brief description of changes]
 * Part of: Orbin
 */
```

---

## 🏗️ Development Guidelines

### Code Standards

- **TypeScript**: All code must be fully typed
- **ESLint**: Follow existing linting rules (0 errors, 0 warnings)
- **shadcn/ui**: Use consistent shadcn/ui components
- **Prisma**: Use for all database operations
- **Better Auth**: Follow authentication patterns
- **Variable Naming**: All variables must use English language and camelCase format
- **Label Naming**: All labels must be in English language

### Architecture Patterns

- **Route Groups**: Use `(app)` for protected routes if not specifically asked
- **API Structure**: Follow RESTful patterns in `/api/` directory
- **Components**: Place reusable components in `/components/`
- **Common Components**: Prioritize using existing components from `/components/Common/` before creating new ones
- **Types**: Define TypeScript interfaces in `/types/`
- **Hooks**: Custom hooks in `/hooks/`

### UI/UX Requirements

- **Skeleton Loading**: Implement professional skeleton loading for all data tables
- **shadcn/ui**: Use professional confirmation dialogs (not browser alerts)
- **Responsive Design**: Mobile-first approach
- **Error Handling**: Comprehensive error messages and recovery
- **Loading States**: Smooth transitions and visual feedback
- **Component Reuse**: Maximize use of existing Common components before creating custom components
- **Component Index Files**: ALWAYS include `index.ts` file in `/components/` and all subdirectories to export components for clean imports
- **Mandatory Component Usage**:
  - ALL edit pages MUST use AppForm component
  - ALL table displays MUST use AppDataView component
  - ALL buttons MUST use ActionButton from `/components/ActionButton/index.ts`

---

## 📁 Project Structure Context

### **🏗️ Application Architecture**

```
/app/
├── page.tsx                           # Homepage (public)
├── layout.tsx                          # Root layout
├── auth/                              # Authentication (public)
│   ├── signin/page.tsx                 # Sign in page
│   └── signup/page.tsx                 # Sign up page
├── (system)/                          # Route group (protected - system admin)
│   ├── layout.tsx                     # AppLayout for system modules
│   ├── dashboard/page.tsx               # System dashboard
│   └── user-management/                 # User Management Module
│       ├── users/page.tsx              # Users list
│       ├── user-groups/page.tsx         # User groups
│       ├── roles/page.tsx              # Roles management
│       └── authorization/page.tsx       # Authorization matrix
├── (app)/                             # Route group (protected - business apps)
│   ├── layout.tsx                      # AppLayout for business applications
│   └── finance-accounting/             # Finance & Accounting Module
│       ├── page.tsx                    # Finance dashboard
│       ├── chart-of-accounts/
│       │   ├── page.tsx                # Chart of accounts list
│       │   └── [id]/
│       │       └── edit.tsx            # Edit account
│       ├── journal-entries/
│       │   ├── page.tsx                # Journal entries list
│       │   └── new/                   # New journal entry
│       ├── ledger/
│       │   └── page.tsx                # General ledger
│       ├── transactions/
│       │   ├── page.tsx                # Transactions list
│       │   ├── new/                   # New transaction
│       │   └── [id]/
│       │       └── edit.tsx            # Edit transaction
│       └── reports/
│           └── page.tsx                # Financial reports
└── api/                              # API routes
    ├── authorization/route.ts            # Authorization API
    ├── users/route.ts                   # Users CRUD API
    ├── roles/route.ts                   # Roles CRUD API
    ├── user-groups/route.ts              # User groups CRUD API
    ├── modules/route.ts                 # Modules API
    ├── applications/route.ts              # Applications API
    └── finance-accounting/              # Finance APIs
        ├── chart-of-accounts/route.ts   # Chart of accounts API
        ├── financial-transaction/route.ts # Transactions API
        ├── journal-entry/route.ts        # Journal entries API
        ├── ledger/route.ts              # Ledger API
        └── reports/route.ts             # Financial reports API
```

### **📋 Application Module Pattern**

**Development Workflow for New Applications:**

**Step 1: Database Schema Creation**

1. Create Prisma models in `prisma/models/[module-name]/`
2. Add models to main `prisma/schema.prisma`
3. Generate Prisma client: `bun db:generate`
4. Push schema to database: `bun db:push`
5. Create seed data in `prisma/seeds/[module-name]/index.ts`
6. Update main seed orchestrator `prisma/seed.ts`
7. Test seeding: `bun db:seed`

**Step 2: UI Development**

1. Create application pages in `/app/(app)/application_name/`
2. Use `AppDataView` component for ALL data table displays
3. Use `AppForm` component for ALL forms (create, edit, update)
4. Use `ActionButton` from `/components/ActionButton/index.ts` for ALL buttons
5. Implement list, create, edit, and detail pages
6. Add proper routing and navigation
7. Ensure responsive design and loading states
8. Create custom components in `/components/` with proper `index.ts` exports
9. Follow component index file requirements for clean imports

**Step 3: API Development**

1. Create API routes in `/app/api/application_name/`
2. Implement CRUD operations for each module
3. Add proper error handling and validation
4. Include authentication and authorization checks
5. Add TypeScript interfaces for request/response types
6. Test API endpoints thoroughly

**Standard Pattern for New Applications:**

```
/app/(app)/application_name/
├── page.tsx                          # Application dashboard/main page
├── module-1/                         # First functional module
│   ├── page.tsx                      # Module list view
│   ├── new/                          # Create new item
│   └── [id]/
│       └── edit.tsx                   # Edit existing item
├── module-2/                         # Second functional module
│   ├── page.tsx                      # Module list view
│   ├── new/                          # Create new item
│   └── [id]/
│       └── edit.tsx                   # Edit existing item
└── module-n/                          # Additional modules
    ├── page.tsx                      # Module list view
    ├── new/                          # Create new item
    └── [id]/
        └── edit.tsx                   # Edit existing item
```

**API Pattern for New Applications:**

```
/app/api/application_name/
├── route.ts                          # Main application API
├── module-1/route.ts                 # Module 1 CRUD API
├── module-2/route.ts                 # Module 2 CRUD API
└── module-n/route.ts                 # Module N CRUD API
```

### **🗂️ Database Structure**

```
prisma/
├── models/                             # Model definitions by module
│   ├── core/                          # Core system models
│   │   ├── user.prisma                # User management
│   │   ├── role.prisma                # Role definitions
│   │   ├── user-group.prisma          # User groups
│   │   └── module.prisma              # System modules
│   └── finance-accounting/            # Finance module models
│       ├── chart-of-accounts.prisma     # Chart of accounts
│       ├── financial-transaction.prisma # Financial transactions
│       ├── journal-entry.prisma          # Journal entries
│       ├── ledger.prisma                # Ledger entries
│       └── financial-report.prisma      # Financial reports
├── seeds/                             # Seed data by module
│   ├── core/index.ts                   # Core system data
│   └── finance-accounting/             # Finance module data
│       ├── index.ts                    # Finance seeding
│       └── sample-data.ts              # Sample data
├── schema.prisma                      # Main consolidated schema
└── seed.ts                           # Modular seed orchestrator
```

### **🧩 Component Structure**

```
/components/
├── index.ts                          # Main component exports
├── Common/                            # Reusable common components
│   ├── index.ts                      # Common components exports
│   ├── AppLayout.tsx                  # Main application layout
│   ├── AppTable.tsx                   # Data table component
│   ├── AppForm.tsx                    # Form component
│   ├── AppDataView.tsx                # Data view component
│   ├── LoadingSkeleton.tsx             # Skeleton loading
│   └── ConfirmDialog.tsx              # Confirmation dialogs
├── ActionButton/                      # Action button component
│   └── index.ts                      # ActionButton export
├── Forms/                            # Form components
│   ├── index.ts                      # Forms exports
│   └── [form-components].tsx
├── Charts/                           # Chart components
│   ├── index.ts                      # Charts exports
│   └── [chart-components].tsx
└── Layouts/                          # Layout components
    ├── index.ts                      # Layouts exports
    └── [layout-components].tsx
```

**Component Index File Requirements:**

**MANDATORY: Every component directory MUST include `index.ts` file**

```typescript
// Example: /components/Common/index.ts
export { default as AppLayout } from "./AppLayout";
export { default as AppTable } from "./AppTable";
export { default as AppForm } from "./AppForm";
export { default as AppDataView } from "./AppDataView";
export { default as LoadingSkeleton } from "./LoadingSkeleton";
export { default as ConfirmDialog } from "./ConfirmDialog";

// Example: /components/ActionButton/index.ts
export { default as ActionButton } from "./index";
```

**Usage Benefits:**

- Clean imports: `import { AppTable, AppForm } from '@/components/Common'`
- Clean button imports: `import ActionButton from '@/components/ActionButton'`
- Centralized exports for better maintainability
- Consistent import patterns across the application
- Easy component discovery and usage

### **📚 Type Definitions**

```
/types/
├── prisma.ts                         # Prisma type definitions
├── auth.ts                           # Authentication types
├── api.ts                            # API response types
└── common.ts                         # Common utility types
```

### **🎯 Module Access Patterns**

- **Core System**: `/app/(system)` - System administration
  - User management, roles, authorization, app management
  - Requires admin-level permissions
- **Business Applications**: `/app/(app)` - Business operations
  - Finance & Accounting, future business modules
  - Requires role-based permissions per module

- **Public Access**: `/app/auth` - Authentication
  - Sign in, sign up pages
  - No authentication required

---

## 🔐 Security & Authorization

### Permission System

- **Role-based Access Control**: Admin, Manager, User roles
- **Module Permissions**: canView, canCreate, canUpdate, canDelete
- **Advanced Permissions**: canApprove, canExport, canImport
- **Custom Permissions**: JSON-based for specialized requirements

### Audit Trail

Every table (except User Management) automatically includes:

- `createdBy`, `createdAt`, `lastUpdateBy`, `lastUpdateAt`
- `ownedBy` for group-based data ownership

---

## 🚀 Quality Assurance

### Before Completing Any Prompt

1. **Run linting**: `bun lint` (must be 0 errors, 0 warnings)
2. **Type checking**: `bun tsc --noEmit` (must be 0 errors)
3. **Build test**: `bun build` (must compile successfully)
4. **Test functionality**: Verify all features work as expected

### Testing Requirements

- Authentication flows work end-to-end
- CRUD operations function correctly
- Permission matrix updates properly
- Skeleton loading displays correctly
- shadcn/ui components work properly
- Real-time features function as expected

### Function Testing with MCP Server

**MANDATORY: Use MCP Server for function testing**

All function testing must be performed using MCP Server with the following configuration:

```json
{
  "mcp": {
    "browser-mcp": {
      "type": "local",
      "command": ["npx", "@agentdeskai/browser-tools-server@latest"],
      "enabled": true
    }
  }
}
```

**Testing Requirements:**

- **Browser Testing**: Use MCP Server for all UI function testing
- **End-to-End Testing**: Verify complete user workflows through browser automation
- **Interactive Testing**: Test form submissions, button clicks, and navigation
- **Data Validation**: Verify data persistence and retrieval through browser interface
- **Error Handling**: Test error scenarios and user feedback mechanisms
- **Responsive Testing**: Verify functionality across different screen sizes
- **Performance Testing**: Monitor loading times and user interactions

**MCP Server Usage:**

1. **Start MCP Server**: Ensure browser-mcp server is running before testing
2. **Automated Testing**: Use browser automation tools for comprehensive testing
3. **Manual Verification**: Perform manual checks through browser interface
4. **Screenshot Testing**: Capture screenshots for visual regression testing
5. **Console Monitoring**: Check browser console for errors and warnings
6. **Network Monitoring**: Verify API calls and responses through browser dev tools

---

## 📚 Documentation Updates Required

### README.md Sections to Update

- **Features**: Add new features and capabilities
- **Project Structure**: Document new directories/files
- **API Endpoints**: Add new API routes
- **Database Schema**: Document new tables/fields
- **Quick Reference**: Update URLs and commands
- **Recent Updates**: Add to the updates section

### Component Documentation

- Create README files for new major components
- Update existing component documentation
- Include usage examples and props documentation

---

## 🎯 Current Project Context

### **🏛️ Core System Modules**

**Core System** (Accessible via `/app/(system)` - System Administration)

- **User Management**: Complete CRUD for users, groups, roles, authorization
- **App Management**: Registry for 27 business applications
- **Dashboard**: Main overview with statistics
- **Authorization Matrix**: Role-based permission management
- **System Configuration**: Core system settings and preferences

### **📊 Business Applications**

**Finance & Accounting** (Accessible via `/app/(app)/finance-accounting`)

- **Chart of Accounts**: Complete account hierarchy management
- **Financial Transactions**: Transaction recording and management
- **Journal Entries**: Double-entry bookkeeping system
- **General Ledger**: Comprehensive ledger reporting
- **Financial Reports**: Balance sheet, income statement, cash flow

**Business Applications Registry** (27 total applications)

- **Business**: 7 apps (Procurement, Asset, Human Capital, Finance, etc.)
- **Productivity**: 5 apps (Archive, Project, Document, Meeting, Task)
- **Analytics**: 2 apps (Budget Planning, Secondary Data)
- **Other Categories**: 13 apps across various domains (Support, Finance, Operations, Media, Management, Research, Infrastructure, Security)

### **🔐 Access Control**

**Default Credentials**

- **Admin**: admin/admin123 (full system access)
- **Manager**: manager/manager123 (limited business access)
- **User**: user/user123 (basic application access)

**Module Access Patterns**

- **Core System**: Requires admin-level permissions
- **Business Applications**: Role-based permissions per module
- **Public Access**: Authentication pages only

---

## ⚡ Quick Commands Reference

```bash
# Development
bun dev                    # Start development server
bun build                  # Build for production
bun lint                   # Run ESLint
npx tsc --noEmit           # Type checking

# Database
bun db:push               # Push schema changes
bun db:seed               # Seed initial data
bun db:studio             # Open Prisma Studio

# Quality Assurance
bun clean:win             # Clean and reinstall (Windows)
```

---

## 📝 Session Checklist

Before completing any development session, ensure:

- [ ] README.md has been updated with all changes
- [ ] APPS.md has been updated with all changes
- [ ] All created/modified files have proper attribution
- [ ] Code passes all linting and type checking
- [ ] Build completes successfully
- [ ] All functionality works as expected
- [ ] Documentation is accurate and complete
- [ ] Security best practices are followed
- [ ] UI/UX standards are maintained
- [ ] **CRITICAL: TODO file has been updated with checkmarks for ALL completed tasks**
- [ ] **CRITICAL: Every `- [ ]` for completed work has been changed to `- [x]`**

---

## 🌱 Database Schema & Seeding Guide

### **📁 Modular Database Structure**

The database schema is organized into modular directories for better maintainability:

```
prisma/
├── models/
│   ├── core/                    # Core module models (system-wide)
│   │   ├── user.prisma         # User management
│   │   ├── role.prisma         # Role definitions
│   │   ├── user-group.prisma   # User groups
│   │   └── module.prisma       # System modules
│   └── finance-accounting/       # Finance module models
│       ├── chart-of-accounts.prisma    # Chart of accounts
│       ├── financial-transaction.prisma  # Financial transactions
│       ├── journal-entry.prisma         # Journal entries
│       ├── ledger.prisma               # Ledger entries
│       └── financial-report.prisma       # Financial reports
├── seeds/
│   ├── core/                    # Core module seed data
│   │   └── index.ts           # Core data seeding
│   └── finance-accounting/       # Finance module seed data
│       ├── index.ts           # Finance data seeding
│       └── sample-data.ts     # Sample financial data
├── schema.prisma               # Main consolidated schema
└── seed.ts                    # Modular seed orchestrator
```

### **🎯 Module Access Mapping**

- **Core Module**: Accessible via `/app/(system)` - Contains system-wide data
  - Models: User, Role, UserGroup, Module, Application, Auth
  - Seed: Roles, user groups, admin user, core modules, applications

- **Finance-Accounting Module**: Accessible via `/app/(app)/finance-accounting` - Contains financial data
  - Models: ChartOfAccounts, FinancialTransaction, JournalEntry, Ledger, FinancialReport
  - Seed: Chart of accounts hierarchy, sample transactions, reports

### **🏗️ Creating New Database Models**

#### **1. Model File Creation**

Create new `.prisma` files in appropriate module directory:

```prisma
// Example: prisma/models/finance-accounting/new-model.prisma
model NewModel {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  createdBy String
  updatedAt DateTime @updatedAt
  updatedBy String

  // Add your fields here

  // Standard audit fields (required for all models except User Management)
  @@map("new_models")
}
```

#### **2. Schema Integration**

Add model to main `prisma/schema.prisma`:

```prisma
// ========================================
// FINANCE-ACCOUNTING MODULE MODELS
// ========================================

model NewModel {
  // ... model definition from above
}
```

#### **3. Client Generation**

```bash
bun db:generate  # Regenerate Prisma client with new models
```

#### **4. Database Migration**

```bash
bun db:push      # Push schema changes to database
```

### **🌱 Module-Based Seeding Requirements**

#### **Core Module Seeding**

File: `prisma/seeds/core/index.ts`

```typescript
export async function seedCoreData(prisma: PrismaClient) {
  // Create core system data
  const adminRole = await prisma.role.upsert({...});
  const adminUser = await prisma.user.upsert({...});

  return {
    adminRole,
    adminUser,
    // ... other core data
  };
}
```

#### **Finance Module Seeding**

File: `prisma/seeds/finance-accounting/index.ts`

```typescript
export async function seedFinanceAccountingData(prisma: PrismaClient, adminUser: any, adminGroup: any) {
  // Create finance-specific data
  const chartOfAccounts = await prisma.chartOfAccounts.upsert({...});

  return {
    chartOfAccounts,
    // ... other finance data
  };
}
```

#### **Main Seed Orchestrator**

File: `prisma/seed.ts`

```typescript
import { seedCoreData } from "./seeds/core";
import { seedFinanceAccountingData } from "./seeds/finance-accounting";

async function main() {
  // Seed Core Module
  const { adminUser, adminGroup } = await seedCoreData(prisma);

  // Seed Finance Module (depends on core data)
  await seedFinanceAccountingData(prisma, adminUser, adminGroup);
}
```

### **📋 Mandatory Seeding Requirements**

**IMPORTANT: Every time a new module is added, this seeding guide section MUST be updated** to include the new module's seeding requirements and workflow.

**ALL new models and modules MUST be added to appropriate seed files** to ensure:

#### **New Model Seeding**

1. **Create Seed Function**: Add seeding logic to appropriate module seed file
2. **Handle Dependencies**: Ensure dependent data is created first
3. **Data Consistency**: Use same data structure across environments
4. **Test Seeding**: Verify with `bun db:seed`

#### **Module Dependencies**

- **Core Module**: Independent (seeds first)
- **Finance Module**: Depends on Core (needs adminUser, adminGroup)
- **Future Modules**: Define dependencies clearly

#### **Seeding Workflow**

1. **Create Model**: Define new Prisma model in module directory
2. **Update Schema**: Add to main schema.prisma
3. **Generate Client**: `bun db:generate`
4. **Add Seed Data**: Create seeding function in module seed file
5. **Update Main Seed**: Call new seed function in proper order
6. **Test**: `bun db:push && bun db:seed`
7. **Verify**: Check data with `bun db:studio`

### **🔧 Type Definitions**

Update `/types/prisma.ts` for new models:

```typescript
export interface NewModelWithRelations {
  id: string;
  // ... fields
  // Include related models if needed
}
```

### **✅ Verification Commands**

```bash
# Complete database reset and reseed
bun db:push --force-reset && bun db:seed

# Generate Prisma client
bun db:generate

# View database structure
bun db:studio

# Test build with new models
bun build
```

### **📝 Best Practices**

#### **Model Organization**

- **Module Separation**: Keep models in appropriate module directories
- **Clear Naming**: Use descriptive model and field names
- **Consistent Fields**: Include standard audit fields
- **Proper Relations**: Define relationships clearly

#### **Seeding Best Practices**

- **Idempotent Operations**: Use upsert for safe re-seeding
- **Dependency Order**: Seed dependent data after prerequisites
- **Error Handling**: Include proper error handling and logging
- **Data Validation**: Ensure seeded data meets constraints

#### **Type Safety**

- **Interface Updates**: Update TypeScript types for new models
- **Proper Typing**: Use specific types instead of 'any'
- **Relation Types**: Include related model types in interfaces

**Remember**: Any model not properly seeded will cause missing data and broken functionality after database reset.

---

## 🤝 Collaboration Notes

### Communication Style

- Be concise and direct in responses
- Focus on the specific task requested
- Provide clear explanations for complex changes
- Use proper code formatting and structure

### Problem Solving

- Always check existing code patterns before implementing new solutions
- Follow established conventions and best practices
- Consider security implications for all changes
- Test thoroughly before marking tasks complete
