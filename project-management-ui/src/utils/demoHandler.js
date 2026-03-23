// Demo mode request interceptor — used when VITE_DEMO_MODE=true
// Matches URL patterns and returns static/mutable mock data instead of hitting a real API.

import {
  DEMO_TOKEN,
  DEMO_USER,
  DEMO_USERS,
  DEMO_UNITS,
  DEMO_TEAMS,
  DEMO_ORGANIZATION,
  nextDemoId,
  mutableProjects,
  mutableTasks,
  mutableCalendarEvents,
  mutableTimeLogs,
  mutableRisks,
  mutableBudgets,
} from './demoData';

// Simulate a small network delay so spinners are visible
const delay = (ms = 120) => new Promise(res => setTimeout(res, ms));

function parsePath(rawUrl) {
  // rawUrl is either a bare path ("/projects/1") or includes the API base
  try {
    const url = rawUrl.startsWith('http') ? new URL(rawUrl) : new URL(rawUrl, 'http://demo');
    return { path: url.pathname.replace(/\/api$/, '').replace(/\/$/, ''), search: url.search };
  } catch {
    return { path: rawUrl.split('?')[0], search: '' };
  }
}

function searchParams(search) {
  return new URLSearchParams(search);
}

export async function handleDemoRequest(rawUrl, options = {}) {
  await delay();
  const method = (options.method || 'GET').toUpperCase();
  const { path, search } = parsePath(rawUrl);

  // Normalise: strip /api prefix if present
  const p = path.replace(/^\/api/, '');

  // ── Auth ──────────────────────────────────────────────────────────────────
  if (p === '/auth/login' && method === 'POST') {
    return { access_token: DEMO_TOKEN, user: DEMO_USER };
  }
  if (p === '/auth/register' && method === 'POST') {
    return { message: 'Demo mode: registration is disabled.' };
  }

  // ── Current user ─────────────────────────────────────────────────────────
  if (p === '/user-management/me') {
    if (method === 'PATCH') return { ...DEMO_USER };
    return DEMO_USER;
  }

  // ── User management ───────────────────────────────────────────────────────
  if (p === '/user-management') {
    return DEMO_USERS;
  }
  if (p.startsWith('/user-management/')) {
    const uid = parseInt(p.split('/')[2]);
    return DEMO_USERS.find(u => u.userID === uid) || DEMO_USER;
  }

  // ── Organizations ─────────────────────────────────────────────────────────
  if (p === '/organizations' || p === '/organization') {
    return [DEMO_ORGANIZATION];
  }

  // ── Units ─────────────────────────────────────────────────────────────────
  if (p.startsWith('/units/organization/')) {
    return DEMO_UNITS;
  }
  if (p === '/units') {
    return DEMO_UNITS;
  }
  if (p.startsWith('/units/')) {
    const uid = parseInt(p.split('/')[2]);
    return DEMO_UNITS.find(u => u.unitID === uid) || DEMO_UNITS[0];
  }

  // ── Teams ─────────────────────────────────────────────────────────────────
  if (p === '/teams') {
    return DEMO_TEAMS;
  }
  if (p.startsWith('/teams/')) {
    const segments = p.split('/');
    const tid = parseInt(segments[2]);
    if (segments[3] === 'members') {
      const team = DEMO_TEAMS.find(t => t.teamID === tid);
      return team ? team.members : [];
    }
    return DEMO_TEAMS.find(t => t.teamID === tid) || DEMO_TEAMS[0];
  }

  // ── Team membership ───────────────────────────────────────────────────────
  if (p === '/team-membership') {
    if (method === 'POST') return { teamMembershipID: nextDemoId(), ...parseBody(options.body) };
    return DEMO_TEAMS.flatMap(t => t.members.map(m => ({ ...m, teamID: t.teamID })));
  }
  if (p.startsWith('/team-membership/')) {
    if (method === 'DELETE' || method === 'PATCH') return {};
    return {};
  }

  // ── Projects ──────────────────────────────────────────────────────────────
  if (p === '/projects') {
    if (method === 'POST') {
      const body = parseBody(options.body);
      const newProject = { projectID: nextDemoId(), tasks: [], stakeholders: [], health: { scope: 'GREEN', schedule: 'GREEN', cost: 'GREEN', resource: 'GREEN', overall: 'GREEN' }, budget: null, dates: {}, ...body };
      mutableProjects.push(newProject);
      return newProject;
    }
    return mutableProjects;
  }
  if (p.startsWith('/projects/')) {
    const segments = p.split('/');
    const pid = parseInt(segments[2]);

    // /projects/:id/stakeholders
    if (segments[3] === 'stakeholders') {
      const proj = mutableProjects.find(p => p.projectID === pid);
      if (method === 'POST') {
        const s = { stakeholderID: nextDemoId(), projectID: pid, ...parseBody(options.body) };
        if (proj) proj.stakeholders.push(s);
        return s;
      }
      if (method === 'DELETE') {
        const sid = parseInt(segments[4]);
        if (proj) proj.stakeholders = proj.stakeholders.filter(s => s.stakeholderID !== sid);
        return {};
      }
      return proj ? proj.stakeholders : [];
    }

    // /projects/:id (single)
    const proj = mutableProjects.find(p => p.projectID === pid);
    if (!proj) return mutableProjects[0];
    if (method === 'PUT' || method === 'PATCH') {
      const body = parseBody(options.body);
      Object.assign(proj, body);
      return proj;
    }
    if (method === 'DELETE') {
      const idx = mutableProjects.findIndex(p => p.projectID === pid);
      if (idx !== -1) mutableProjects.splice(idx, 1);
      return {};
    }
    return proj;
  }

  // ── Tasks ─────────────────────────────────────────────────────────────────
  if (p === '/tasks') {
    if (method === 'POST') {
      const body = parseBody(options.body);
      const newTask = { taskID: nextDemoId(), id: nextDemoId(), comments: [], ...body };
      mutableTasks.push(newTask);
      const proj = mutableProjects.find(pr => pr.projectID === newTask.projectID);
      if (proj) proj.tasks.push(newTask);
      return newTask;
    }
    return mutableTasks;
  }
  if (p.startsWith('/tasks/')) {
    const tid = parseInt(p.split('/')[2]);
    const task = mutableTasks.find(t => t.taskID === tid || t.id === tid);
    if (method === 'PATCH' || method === 'PUT') {
      if (task) Object.assign(task, parseBody(options.body));
      return task || {};
    }
    if (method === 'DELETE') {
      const idx = mutableTasks.findIndex(t => t.taskID === tid || t.id === tid);
      if (idx !== -1) mutableTasks.splice(idx, 1);
      return {};
    }
    // GET /tasks/:id — include comments
    return task ? { ...task, comments: task.comments || [] } : {};
  }

  // Old-style task route used by TaskList page
  if (p.match(/^\/api\/projects\/\d+\/tasks$/)) {
    const pid = parseInt(p.split('/')[3]);
    return mutableTasks.filter(t => t.projectID === pid);
  }

  // ── Budget ────────────────────────────────────────────────────────────────
  if (p === '/budget') {
    if (method === 'POST') {
      const body = parseBody(options.body);
      const b = { budgetID: nextDemoId(), ...body };
      mutableBudgets.push(b);
      return b;
    }
    return mutableBudgets;
  }
  if (p.startsWith('/budget/')) {
    const bid = parseInt(p.split('/')[2]);
    const budget = mutableBudgets.find(b => b.budgetID === bid);
    if (method === 'PUT' || method === 'PATCH') {
      if (budget) Object.assign(budget, parseBody(options.body));
      return budget || {};
    }
    if (method === 'DELETE') {
      const idx = mutableBudgets.findIndex(b => b.budgetID === bid);
      if (idx !== -1) mutableBudgets.splice(idx, 1);
      return {};
    }
    return budget || {};
  }

  // ── Health status ─────────────────────────────────────────────────────────
  if (p === '/health-status') return mutableProjects.map(p => p.health).filter(Boolean);
  if (p.startsWith('/health-status/')) {
    if (method === 'PUT' || method === 'PATCH') return {};
    return {};
  }

  // ── Risks ─────────────────────────────────────────────────────────────────
  if (p === '/risks') {
    if (method === 'POST') {
      const body = parseBody(options.body);
      const r = { riskID: String(nextDemoId()), ...body };
      mutableRisks.push(r);
      return r;
    }
    return mutableRisks;
  }
  if (p.startsWith('/risks/')) {
    const rid = p.split('/')[2];
    const risk = mutableRisks.find(r => r.riskID === rid);
    if (method === 'PUT' || method === 'PATCH') {
      if (risk) Object.assign(risk, parseBody(options.body));
      return risk || {};
    }
    if (method === 'DELETE') {
      const idx = mutableRisks.findIndex(r => r.riskID === rid);
      if (idx !== -1) mutableRisks.splice(idx, 1);
      return {};
    }
    return risk || {};
  }

  // ── Calendar events ───────────────────────────────────────────────────────
  if (p === '/calendar-events' || p === '/calendar-event') {
    if (method === 'POST') {
      const body = parseBody(options.body);
      const ev = { calendarEventID: nextDemoId(), ...body };
      mutableCalendarEvents.push(ev);
      return ev;
    }
    return mutableCalendarEvents;
  }
  if (p.startsWith('/calendar-events/') || p.startsWith('/calendar-event/')) {
    const eid = parseInt(p.split('/')[2]);
    if (method === 'DELETE') {
      const idx = mutableCalendarEvents.findIndex(e => e.calendarEventID === eid);
      if (idx !== -1) mutableCalendarEvents.splice(idx, 1);
      return {};
    }
    return mutableCalendarEvents.find(e => e.calendarEventID === eid) || {};
  }

  // ── Time tracking ─────────────────────────────────────────────────────────
  if (p === '/time-tracking') {
    if (method === 'POST') {
      const body = parseBody(options.body);
      const entry = { timeTrackingID: nextDemoId(), ...body };
      mutableTimeLogs.push(entry);
      return entry;
    }
    return mutableTimeLogs;
  }
  if (p.startsWith('/time-tracking/')) {
    if (method === 'DELETE' || method === 'PATCH') return {};
    return {};
  }

  // ── Comments ──────────────────────────────────────────────────────────────
  if (p === '/comments' || p.startsWith('/comments')) {
    if (method === 'POST') {
      const body = parseBody(options.body);
      return { commentID: nextDemoId(), createdAt: new Date().toISOString(), user: DEMO_USER, ...body };
    }
    return [];
  }

  // ── Search ────────────────────────────────────────────────────────────────
  if (p === '/search') {
    const term = searchParams(search).get('searchTerm')?.toLowerCase() || '';
    return {
      projects: mutableProjects.filter(p => p.title.toLowerCase().includes(term)),
      tasks: mutableTasks.filter(t => t.title.toLowerCase().includes(term)),
      users: DEMO_USERS.filter(u => `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(term)),
    };
  }

  // ── Requests (admin approval) ─────────────────────────────────────────────
  if (p === '/auth/requests' || p === '/requests') {
    if (method === 'POST') return { message: 'Demo mode: requests are disabled.' };
    return [];
  }

  // ── Export ────────────────────────────────────────────────────────────────
  if (p.startsWith('/export')) {
    return { message: 'Export is not available in demo mode.' };
  }

  // ── Password / forgot ─────────────────────────────────────────────────────
  if (p.startsWith('/auth/forgot') || p.startsWith('/auth/reset')) {
    return { message: 'Demo mode: password reset is disabled.' };
  }

  // ── Stakeholders (top-level) ──────────────────────────────────────────────
  if (p === '/stakeholders') {
    return mutableProjects.flatMap(p => p.stakeholders);
  }

  // Fallback — return empty array so pages don't crash
  console.warn('[demoHandler] Unhandled demo route:', method, p);
  return [];
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === 'string') {
    try { return JSON.parse(body); } catch { return {}; }
  }
  return body;
}
