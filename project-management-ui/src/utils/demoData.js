// Demo mode static data — used when VITE_DEMO_MODE=true (GitHub Pages deployment)
// No backend is contacted; all API calls are intercepted and resolved from this file.

export const DEMO_TOKEN = 'demo-jwt-token';

export const DEMO_USER = {
  userID: 1,
  firstName: 'Alex',
  lastName: 'Demo',
  email: 'demo@plump.dev',
  phone: '+1 555-0100',
  address: '1 Demo Street',
  primaryRole: 'ADMIN',
  role: 'ADMIN',
  active: true,
  type: 'INTERNAL',
  unit: {
    unitID: 1,
    name: 'Product',
    organizationID: 1,
  },
};

export const DEMO_ORGANIZATION = {
  organizationID: 1,
  name: 'Acme Corp',
  createdAt: '2024-01-01T00:00:00.000Z',
};

export const DEMO_USERS = [
  DEMO_USER,
  { userID: 2, firstName: 'Jordan', lastName: 'Smith', email: 'jordan@plump.dev', primaryRole: 'USER', active: true, type: 'INTERNAL', unit: { unitID: 1, name: 'Product', organizationID: 1 } },
  { userID: 3, firstName: 'Morgan', lastName: 'Lee',   email: 'morgan@plump.dev', primaryRole: 'USER', active: true, type: 'INTERNAL', unit: { unitID: 1, name: 'Product', organizationID: 1 } },
  { userID: 4, firstName: 'Casey',  lastName: 'Kim',   email: 'casey@plump.dev',  primaryRole: 'USER', active: true, type: 'INTERNAL', unit: { unitID: 2, name: 'Engineering', organizationID: 1 } },
  { userID: 5, firstName: 'Riley',  lastName: 'Park',  email: 'riley@plump.dev',  primaryRole: 'USER', active: true, type: 'INTERNAL', unit: { unitID: 2, name: 'Engineering', organizationID: 1 } },
  { userID: 6, firstName: 'Sam',    lastName: 'Chen',  email: 'sam@plump.dev',    primaryRole: 'USER', active: true, type: 'EXTERNAL', unit: null },
];

export const DEMO_UNITS = [
  {
    unitID: 1,
    name: 'Product',
    description: 'Product management and design',
    organizationID: 1,
    manager: DEMO_USERS[0],
    teams: [
      { teamID: 1, name: 'Alpha Team' },
      { teamID: 2, name: 'Beta Team' },
    ],
  },
  {
    unitID: 2,
    name: 'Engineering',
    description: 'Software development',
    organizationID: 1,
    manager: DEMO_USERS[3],
    teams: [
      { teamID: 3, name: 'Platform Team' },
    ],
  },
];

export const DEMO_TEAMS = [
  { teamID: 1, name: 'Alpha Team',    unitID: 1, members: [{ userID: 1, teamRole: 'TEAM_LEAD', accessLevel: 'FULL_ACCESS', user: DEMO_USERS[0] }, { userID: 2, teamRole: 'TEAM_MEMBER', accessLevel: 'READ_WRITE', user: DEMO_USERS[1] }] },
  { teamID: 2, name: 'Beta Team',     unitID: 1, members: [{ userID: 3, teamRole: 'TEAM_LEAD', accessLevel: 'FULL_ACCESS', user: DEMO_USERS[2] }, { userID: 4, teamRole: 'TEAM_MEMBER', accessLevel: 'READ_WRITE', user: DEMO_USERS[3] }] },
  { teamID: 3, name: 'Platform Team', unitID: 2, members: [{ userID: 5, teamRole: 'TEAM_LEAD', accessLevel: 'FULL_ACCESS', user: DEMO_USERS[4] }, { userID: 6, teamRole: 'TEAM_MEMBER', accessLevel: 'READ_ONLY',  user: DEMO_USERS[5] }] },
];

const TASKS_BY_PROJECT = {
  1: [
    { taskID: 101, title: 'Design new checkout flow',      details: 'Redesign the multi-step checkout for mobile-first experience', status: 'Completed',   priority: 'High',   percentageComplete: 100, startDate: '2025-01-05', targetDate: '2025-01-20', projectID: 1 },
    { taskID: 102, title: 'Implement cart persistence',    details: 'Store cart in localStorage and sync with backend',              status: 'In Progress', priority: 'High',   percentageComplete: 60,  startDate: '2025-01-21', targetDate: '2025-02-05', projectID: 1 },
    { taskID: 103, title: 'A/B test product page layout',  details: 'Run two-week test on new vs. current layout',                   status: 'Pending',     priority: 'Medium', percentageComplete: 0,   startDate: '2025-02-10', targetDate: '2025-03-01', projectID: 1 },
    { taskID: 104, title: 'Performance audit',             details: 'Lighthouse audit and fix Core Web Vitals regressions',          status: 'Pending',     priority: 'Low',    percentageComplete: 0,   startDate: '2025-03-01', targetDate: '2025-03-15', projectID: 1 },
  ],
  2: [
    { taskID: 201, title: 'Define v2.0 feature scope',    details: 'Stakeholder interviews and requirements doc',                   status: 'Completed',   priority: 'High',   percentageComplete: 100, startDate: '2025-02-01', targetDate: '2025-02-14', projectID: 2 },
    { taskID: 202, title: 'Wireframe onboarding screens', details: 'Low-fi wireframes for the new onboarding flow',                 status: 'In Progress', priority: 'High',   percentageComplete: 40,  startDate: '2025-02-15', targetDate: '2025-03-01', projectID: 2 },
    { taskID: 203, title: 'Set up CI/CD pipeline',        details: 'GitHub Actions → TestFlight and Play Store internal track',     status: 'Pending',     priority: 'Medium', percentageComplete: 0,   startDate: '2025-03-05', targetDate: '2025-03-20', projectID: 2 },
  ],
  3: [
    { taskID: 301, title: 'ETL pipeline setup',           details: 'Ingest raw events into warehouse via Fivetran',                 status: 'Completed',   priority: 'High',   percentageComplete: 100, startDate: '2024-10-01', targetDate: '2024-10-20', projectID: 3 },
    { taskID: 302, title: 'Build KPI dashboard',          details: 'Recharts-based dashboard with DAU, revenue, churn metrics',    status: 'Completed',   priority: 'High',   percentageComplete: 100, startDate: '2024-10-21', targetDate: '2024-11-15', projectID: 3 },
    { taskID: 303, title: 'User access control',          details: 'Role-based views for analyst vs. exec audience',               status: 'Completed',   priority: 'Medium', percentageComplete: 100, startDate: '2024-11-16', targetDate: '2024-12-01', projectID: 3 },
  ],
  4: [
    { taskID: 401, title: 'Inventory current infra',      details: 'Document all EC2, RDS, and S3 resources',                      status: 'In Progress', priority: 'High',   percentageComplete: 50,  startDate: '2025-03-01', targetDate: '2025-03-15', projectID: 4 },
    { taskID: 402, title: 'Select cloud provider',        details: 'Evaluate AWS vs. GCP vs. Azure costs and SLAs',                status: 'Pending',     priority: 'High',   percentageComplete: 0,   startDate: '2025-03-16', targetDate: '2025-04-01', projectID: 4 },
  ],
  5: [
    { taskID: 501, title: 'Customer auth integration',    details: 'OAuth 2.0 SSO with the main product',                          status: 'In Progress', priority: 'High',   percentageComplete: 70,  startDate: '2025-01-10', targetDate: '2025-02-01', projectID: 5 },
    { taskID: 502, title: 'Self-service billing portal',  details: 'Stripe-powered subscription management UI',                    status: 'In Progress', priority: 'High',   percentageComplete: 35,  startDate: '2025-02-01', targetDate: '2025-03-01', projectID: 5 },
    { taskID: 503, title: 'Help centre & search',         details: 'Full-text search over knowledge base articles',                status: 'Pending',     priority: 'Medium', percentageComplete: 0,   startDate: '2025-03-01', targetDate: '2025-04-01', projectID: 5 },
  ],
};

const ALL_TASKS = Object.values(TASKS_BY_PROJECT).flat();

export const DEMO_PROJECTS = [
  {
    projectID: 1,
    title: 'E-Commerce Platform Redesign',
    status: 'IN_PROGRESS',
    phase: 'EXECUTING',
    team: { teamID: 1, name: 'Alpha Team' },
    dates: { startDate: '2025-01-05T00:00:00.000Z', targetDate: '2025-04-30T00:00:00.000Z', actualCompletion: null },
    budget: { budgetID: 1, projectID: 1, totalBudget: 120000, actualCost: 54000, forecastCost: 110000 },
    health: { scope: 'GREEN', schedule: 'YELLOW', cost: 'GREEN', resource: 'GREEN', overall: 'GREEN' },
    tasks: TASKS_BY_PROJECT[1],
    stakeholders: [{ stakeholderID: 1, name: 'Head of Product', projectID: 1 }, { stakeholderID: 2, name: 'CTO', projectID: 1 }],
  },
  {
    projectID: 2,
    title: 'Mobile App v2.0',
    status: 'APPROVED',
    phase: 'PLANNING',
    team: { teamID: 2, name: 'Beta Team' },
    dates: { startDate: '2025-02-01T00:00:00.000Z', targetDate: '2025-06-30T00:00:00.000Z', actualCompletion: null },
    budget: { budgetID: 2, projectID: 2, totalBudget: 85000, actualCost: 18000, forecastCost: 80000 },
    health: { scope: 'GREEN', schedule: 'GREEN', cost: 'GREEN', resource: 'YELLOW', overall: 'GREEN' },
    tasks: TASKS_BY_PROJECT[2],
    stakeholders: [{ stakeholderID: 3, name: 'VP Engineering', projectID: 2 }],
  },
  {
    projectID: 3,
    title: 'Data Analytics Dashboard',
    status: 'COMPLETED',
    phase: 'MONITORING_CONTROLLING',
    team: { teamID: 3, name: 'Platform Team' },
    dates: { startDate: '2024-10-01T00:00:00.000Z', targetDate: '2024-12-15T00:00:00.000Z', actualCompletion: '2024-12-10T00:00:00.000Z' },
    budget: { budgetID: 3, projectID: 3, totalBudget: 60000, actualCost: 57000, forecastCost: 57000 },
    health: { scope: 'GREEN', schedule: 'GREEN', cost: 'GREEN', resource: 'GREEN', overall: 'GREEN' },
    tasks: TASKS_BY_PROJECT[3],
    stakeholders: [{ stakeholderID: 4, name: 'Data Lead', projectID: 3 }, { stakeholderID: 5, name: 'CFO', projectID: 3 }],
  },
  {
    projectID: 4,
    title: 'Cloud Infrastructure Migration',
    status: 'PROPOSED',
    phase: 'INITIATING',
    team: { teamID: 3, name: 'Platform Team' },
    dates: { startDate: '2025-03-01T00:00:00.000Z', targetDate: '2025-09-01T00:00:00.000Z', actualCompletion: null },
    budget: { budgetID: 4, projectID: 4, totalBudget: 200000, actualCost: 5000, forecastCost: 195000 },
    health: { scope: 'GREEN', schedule: 'GREEN', cost: 'GREEN', resource: 'RED', overall: 'YELLOW' },
    tasks: TASKS_BY_PROJECT[4],
    stakeholders: [{ stakeholderID: 6, name: 'CTO', projectID: 4 }],
  },
  {
    projectID: 5,
    title: 'Customer Portal',
    status: 'IN_PROGRESS',
    phase: 'EXECUTING',
    team: { teamID: 1, name: 'Alpha Team' },
    dates: { startDate: '2025-01-10T00:00:00.000Z', targetDate: '2025-05-15T00:00:00.000Z', actualCompletion: null },
    budget: { budgetID: 5, projectID: 5, totalBudget: 75000, actualCost: 31000, forecastCost: 72000 },
    health: { scope: 'YELLOW', schedule: 'GREEN', cost: 'GREEN', resource: 'GREEN', overall: 'GREEN' },
    tasks: TASKS_BY_PROJECT[5],
    stakeholders: [{ stakeholderID: 7, name: 'Head of CS', projectID: 5 }, { stakeholderID: 8, name: 'Sales Director', projectID: 5 }],
  },
];

export const DEMO_BUDGETS = DEMO_PROJECTS.map(p => p.budget);

export const DEMO_RISKS = [
  { riskID: '1', title: 'Key engineer departure',        description: 'Single point of knowledge for the payment module', probability: 'Low',    impact: 'High',   responsePlan: 'Document all payment integration flows; cross-train one other engineer.', owner: 'Alex Demo',   status: 'Open' },
  { riskID: '2', title: 'Third-party API deprecation',   description: 'Shipping carrier API v1 EOL announced for Q3',     probability: 'High',   impact: 'Medium', responsePlan: 'Migrate to v2 API by end of Q1.',                                         owner: 'Jordan Smith', status: 'Open' },
  { riskID: '3', title: 'Budget overrun on mobile app',  description: 'Scope creep in v2.0 feature requests',             probability: 'Medium', impact: 'Medium', responsePlan: 'Enforce change-control board approval for new scope items.',               owner: 'Morgan Lee',   status: 'Mitigated' },
  { riskID: '4', title: 'Cloud migration downtime',      description: 'Zero-downtime migration requires careful cutover',  probability: 'Medium', impact: 'High',   responsePlan: 'Blue-green deployment with instant rollback capability.',                  owner: 'Casey Kim',    status: 'Open' },
];

export const DEMO_CALENDAR_EVENTS = [
  { calendarEventID: 1, title: 'E-Commerce Kickoff Review',    type: 'MEETING',      description: 'Sprint 8 planning session', date: '2025-03-05T10:00:00.000Z' },
  { calendarEventID: 2, title: 'Mobile App v2 Stakeholder',    type: 'MEETING',      description: 'Present wireframes to stakeholders', date: '2025-03-12T14:00:00.000Z' },
  { calendarEventID: 3, title: 'Cloud Migration Planning',     type: 'APPOINTMENT',  description: 'Vendor selection meeting', date: '2025-03-18T09:00:00.000Z' },
  { calendarEventID: 4, title: 'Customer Portal Demo',         type: 'MEETING',      description: 'Live demo to CS team', date: '2025-03-25T11:00:00.000Z' },
  { calendarEventID: 5, title: 'Q1 Portfolio Review',          type: 'MEETING',      description: 'Exec portfolio health review', date: '2025-03-31T15:00:00.000Z' },
];

export const DEMO_TIME_LOGS = [
  { timeTrackingID: 1, userID: 1, projectID: 1, dateWorked: '2025-03-10T00:00:00.000Z', hoursSpent: 6, role: 'Developer', user: DEMO_USERS[0], project: { title: 'E-Commerce Platform Redesign' } },
  { timeTrackingID: 2, userID: 2, projectID: 1, dateWorked: '2025-03-10T00:00:00.000Z', hoursSpent: 8, role: 'Designer',  user: DEMO_USERS[1], project: { title: 'E-Commerce Platform Redesign' } },
  { timeTrackingID: 3, userID: 3, projectID: 2, dateWorked: '2025-03-11T00:00:00.000Z', hoursSpent: 5, role: 'Analyst',  user: DEMO_USERS[2], project: { title: 'Mobile App v2.0' } },
  { timeTrackingID: 4, userID: 4, projectID: 5, dateWorked: '2025-03-11T00:00:00.000Z', hoursSpent: 7, role: 'Developer', user: DEMO_USERS[3], project: { title: 'Customer Portal' } },
  { timeTrackingID: 5, userID: 1, projectID: 5, dateWorked: '2025-03-12T00:00:00.000Z', hoursSpent: 4, role: 'PM',       user: DEMO_USERS[0], project: { title: 'Customer Portal' } },
  { timeTrackingID: 6, userID: 5, projectID: 4, dateWorked: '2025-03-12T00:00:00.000Z', hoursSpent: 8, role: 'Architect', user: DEMO_USERS[4], project: { title: 'Cloud Infrastructure Migration' } },
];

// In-memory store for mutations during the demo session
let _nextId = 1000;
export const nextDemoId = () => ++_nextId;

// Mutable copies so demo-mode mutations (add/delete tasks etc.) work within the session
export let mutableProjects = DEMO_PROJECTS.map(p => ({ ...p, tasks: [...p.tasks] }));
export let mutableTasks = [...ALL_TASKS];
export let mutableCalendarEvents = [...DEMO_CALENDAR_EVENTS];
export let mutableTimeLogs = [...DEMO_TIME_LOGS];
export let mutableRisks = [...DEMO_RISKS];
export let mutableBudgets = [...DEMO_BUDGETS];
