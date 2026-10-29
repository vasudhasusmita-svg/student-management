/**
 * ============================================================================
 * CareerPulse AI - Application Logic & State Management
 * Project: AI-Powered Job Application Tracker (Freshers Edition)
 * Technologies: HTML5, CSS3, Vanilla JavaScript (No Frameworks)
 * Phase 2: All Working Features & Resilient LocalStorage State
 * ============================================================================
 */

// Global Storage Keys
const APP_STORAGE_KEY = 'careerpulse_apps_v1';
const PROFILE_STORAGE_KEY = 'careerpulse_profile_v1';

// Default Sample Applications for College Freshers & Grads
const DEFAULT_SAMPLE_APPLICATIONS = [
  {
    id: 'app-1',
    company: 'Google',
    role: 'Software Engineering Intern (Summer 2026)',
    location: 'Bengaluru, India',
    type: 'Internship',
    date: '2026-10-24',
    salary: '₹1,20,000/month',
    status: 'Interview',
    link: 'https://careers.google.com/jobs/results/12345',
    interviewDate: '2026-10-30T10:00',
    interviewRound: 'Round 1 - Technical (DSA & Trees)',
    notes: 'Round 1 Technical Screening (DSA & Problem Solving). Recruiter mentioned focus on Trees, Graphs, and DP.'
  },
  {
    id: 'app-2',
    company: 'Razorpay',
    role: 'Associate Frontend Engineer',
    location: 'Remote',
    type: 'Full-time',
    date: '2026-10-22',
    salary: '₹14,00,000/year (14 LPA)',
    status: 'Interview',
    link: 'https://razorpay.com/careers/associate-frontend',
    interviewDate: '2026-11-02T14:30',
    interviewRound: 'Round 2 - Frontend Architecture',
    notes: 'Technical discussion with Senior Frontend Architect. Reviewing React reconciliation, state management, and debounce hooks.'
  },
  {
    id: 'app-3',
    company: 'Microsoft',
    role: 'SDE Intern (Campus Placement)',
    location: 'Hyderabad, India',
    type: 'Internship',
    date: '2026-10-15',
    salary: '₹1,25,000/month',
    status: 'Selected',
    link: 'https://careers.microsoft.com/students',
    interviewDate: '',
    interviewRound: 'HR & Final Director Discussion',
    notes: 'Offer letter received! Acceptance confirmed for Summer 2026 batch. Campus placement cell notified.'
  },
  {
    id: 'app-4',
    company: 'Swiggy',
    role: 'Junior Data Analyst',
    location: 'Bengaluru, India',
    type: 'Full-time',
    date: '2026-10-20',
    salary: '₹9,50,000/year (9.5 LPA)',
    status: 'Applied',
    link: 'https://swiggy.com/careers/analytics',
    interviewDate: '',
    interviewRound: '',
    notes: 'Applied through alumni referral. Highlighted SQL, Tableau dashboard, and Python data visualization capstone project.'
  },
  {
    id: 'app-5',
    company: 'Atlassian',
    role: 'Graduate Software Engineer',
    location: 'Remote',
    type: 'Full-time',
    date: '2026-10-18',
    salary: '₹18,00,000/year (18 LPA)',
    status: 'Applied',
    link: 'https://atlassian.com/company/careers/graduates',
    interviewDate: '',
    interviewRound: '',
    notes: 'Submitted customized cover letter highlighting Git workflows and open source contributions.'
  },
  {
    id: 'app-6',
    company: 'Amazon',
    role: 'SDE-1 (Campus Drive)',
    location: 'Pune, India',
    type: 'Full-time',
    date: '2026-10-10',
    salary: '₹16,00,000/year (16 LPA)',
    status: 'Rejected',
    link: 'https://amazon.jobs/en/jobs/campus-sde',
    interviewDate: '',
    interviewRound: 'Round 2 - System Design',
    notes: 'Cleared online assessment round, but rejected after Round 2 System Design basics. Valuable feedback noted on scaling databases.'
  },
  {
    id: 'app-7',
    company: 'Zomato',
    role: 'React Developer Intern',
    location: 'Gurgaon, India',
    type: 'Internship',
    date: '2026-10-12',
    salary: '₹35,000/month',
    status: 'Selected',
    link: 'https://zomato.com/careers/intern',
    interviewDate: '',
    interviewRound: 'Practical Coding Assessment',
    notes: 'Received offer for winter internship! Flexible remote setup available.'
  },
  {
    id: 'app-8',
    company: 'Infosys',
    role: 'Specialist Programmer (Fresher)',
    location: 'Chennai, India',
    type: 'Full-time',
    date: '2026-10-05',
    salary: '₹9,50,000/year (9.5 LPA)',
    status: 'No Response',
    link: 'https://infosys.com/careers/hackwithinfy',
    interviewDate: '',
    interviewRound: '',
    notes: 'HackWithInfy fresher recruitment drive. Assessment completed 3 weeks ago; awaiting results announcement.'
  },
  {
    id: 'app-9',
    company: 'Adobe',
    role: 'Product Engineer Trainee',
    location: 'Noida, India',
    type: 'Full-time',
    date: '2026-10-01',
    salary: '₹14,50,000/year (14.5 LPA)',
    status: 'Interview',
    link: 'https://careers.adobe.com/fresher',
    interviewDate: '2026-10-20T11:00', // Past date to demonstrate Overdue Follow-up alert
    interviewRound: 'Round 1 - Coding & OOP',
    notes: 'Completed Round 1. Follow-up email needed regarding Round 2 shortlist status.'
  }
];

// Default Student Profile
const DEFAULT_PROFILE = {
  name: 'Alex Johnson',
  university: 'National Institute of Technology',
  degree: 'B.Tech Computer Science',
  gradYear: 2026,
  targetRoles: 'Frontend Developer, SDE-1, Full Stack Intern',
  email: 'alex.johnson@student.edu'
};

// Global Application State Object
let state = {
  applications: [],
  profile: { ...DEFAULT_PROFILE },
  currentSection: 'dashboard',
  filterStatus: 'ALL',
  filterType: 'ALL',
  filterLocation: 'ALL',
  searchQuery: '',
  sortOrder: 'date-desc',
  viewMode: 'table', // 'table' or 'kanban'
  interviewTab: 'upcoming', // 'upcoming' or 'all'
  pendingDeleteId: null,
  userSkills: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Git', 'Python', 'C++', 'SQL'],
  charts: {
    statusChart: null,
    activityChart: null,
    jobTypeChart: null,
    timelineChart: null
  }
};

/* ============================================================================
   Initialization & Storage Handlers
   ============================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initNavigation();
  initEventListeners();
  initGlobalSearch();
  initAIModules();
  renderApp();
});

/**
 * Load or seed data from LocalStorage with robust error recovery
 */
function initStorage() {
  const storedApps = localStorage.getItem(APP_STORAGE_KEY);
  if (storedApps) {
    try {
      const parsed = JSON.parse(storedApps);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sanitize and validate every record shape
        state.applications = parsed
          .filter(item => item && typeof item === 'object' && item.id && item.company && item.role)
          .map(item => ({
            id: String(item.id),
            company: String(item.company).trim(),
            role: String(item.role).trim(),
            location: String(item.location || 'Remote').trim(),
            type: String(item.type || 'Full-time').trim(),
            date: String(item.date || new Date().toISOString().split('T')[0]),
            salary: String(item.salary || 'Not Disclosed').trim(),
            status: ['Applied', 'Interview', 'Selected', 'Rejected', 'No Response'].includes(item.status) ? item.status : 'Applied',
            link: String(item.link || '').trim(),
            interviewDate: String(item.interviewDate || '').trim(),
            interviewRound: String(item.interviewRound || '').trim(),
            notes: String(item.notes || '').trim()
          }));

        // If corrupted array contained no valid objects, restore sample data
        if (state.applications.length === 0) {
          state.applications = JSON.parse(JSON.stringify(DEFAULT_SAMPLE_APPLICATIONS));
          saveApplicationsToStorage();
        }
      } else if (Array.isArray(parsed) && parsed.length === 0) {
        // Explicitly cleared by user, keep empty
        state.applications = [];
      } else {
        throw new Error('Stored data is not a valid array');
      }
    } catch (e) {
      console.warn('LocalStorage data was invalid or corrupted. Restoring default applications.', e);
      state.applications = JSON.parse(JSON.stringify(DEFAULT_SAMPLE_APPLICATIONS));
      saveApplicationsToStorage();
      showToast('Restored default application records (data recovered).', 'info');
    }
  } else {
    state.applications = JSON.parse(JSON.stringify(DEFAULT_SAMPLE_APPLICATIONS));
    saveApplicationsToStorage();
  }

  // Profile handling
  const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (storedProfile) {
    try {
      const parsedProfile = JSON.parse(storedProfile);
      if (parsedProfile && typeof parsedProfile === 'object') {
        state.profile = { ...DEFAULT_PROFILE, ...parsedProfile };
      }
    } catch (e) {
      state.profile = { ...DEFAULT_PROFILE };
    }
  }
  updateProfileUI();
}

function saveApplicationsToStorage() {
  try {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(state.applications));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
    showToast('Failed to persist to local storage. Storage might be full.', 'error');
  }
}

function saveProfileToStorage() {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(state.profile));
  } catch (err) {
    console.error('Failed to save profile to localStorage:', err);
  }
}

/* ============================================================================
   Navigation & Section Switching
   ============================================================================ */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  // Handle hash changes for direct linking
  window.addEventListener('hashchange', handleRouteFromHash);
  if (window.location.hash) {
    handleRouteFromHash();
  } else {
    navigateToSection('dashboard');
  }

  // Sidebar link clicks
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = item.getAttribute('data-section');
      if (targetSection) {
        navigateToSection(targetSection);
        window.location.hash = targetSection;
        closeMobileSidebar();
      }
    });
  });

  // Mobile drawer controls
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
      sidebarBackdrop.classList.add('active');
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  // Notification button toggle
  const btnNotifications = document.getElementById('btnNotifications');
  const notificationDropdown = document.getElementById('notificationDropdown');
  if (btnNotifications && notificationDropdown) {
    btnNotifications.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!notificationDropdown.contains(e.target) && !btnNotifications.contains(e.target)) {
        notificationDropdown.classList.remove('active');
      }
    });
  }

  // Shortcut links in Dashboard
  document.querySelectorAll('.ai-quick-link-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = link.getAttribute('data-section');
      if (sec) {
        navigateToSection(sec);
        window.location.hash = sec;
      }
    });
  });

  const btnViewAllApps = document.getElementById('btnViewAllApps');
  if (btnViewAllApps) {
    btnViewAllApps.addEventListener('click', () => {
      navigateToSection('applications');
      window.location.hash = 'applications';
    });
  }

  const btnGoToInterviews = document.getElementById('btnGoToInterviews');
  if (btnGoToInterviews) {
    btnGoToInterviews.addEventListener('click', () => {
      navigateToSection('interviews');
      window.location.hash = 'interviews';
    });
  }

  const btnHeroPrep = document.getElementById('btnHeroPrep');
  if (btnHeroPrep) {
    btnHeroPrep.addEventListener('click', () => {
      navigateToSection('ai-interview');
      window.location.hash = 'ai-interview';
    });
  }
}

function handleRouteFromHash() {
  const hash = window.location.hash.replace('#', '');
  const validSections = [
    'dashboard', 'applications', 'interviews',
    'ai-resume', 'ai-interview', 'ai-cover-letter',
    'ai-skills', 'analytics', 'settings'
  ];
  if (validSections.includes(hash)) {
    navigateToSection(hash);
  }
}

function navigateToSection(sectionId) {
  state.currentSection = sectionId;

  // Toggle sections
  document.querySelectorAll('.app-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const activeSec = document.getElementById(`section-${sectionId}`);
  if (activeSec) {
    activeSec.classList.add('active');
  }

  // Update navigation item active state
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-section') === sectionId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update Topbar Title & Subtitle
  updateTopbarTitle(sectionId);

  // Trigger charts re-render if switching to charts sections
  if (sectionId === 'dashboard') {
    renderDashboardCharts();
  } else if (sectionId === 'analytics') {
    renderAnalyticsCharts();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateTopbarTitle(sectionId) {
  const pageTitle = document.getElementById('pageTitle');
  const pageSubtitle = document.getElementById('pageSubtitle');
  if (!pageTitle || !pageSubtitle) return;

  const titles = {
    dashboard: {
      title: 'Dashboard',
      subtitle: `Welcome back, ${state.profile.name.split(' ')[0]}! Track your recruitment journey in real-time.`
    },
    applications: {
      title: 'My Applications',
      subtitle: 'Manage, track, and filter your campus and off-campus job applications.'
    },
    interviews: {
      title: 'Interview Tracker',
      subtitle: 'Organize upcoming rounds, capture notes, and track technical & HR interviews.'
    },
    'ai-resume': {
      title: 'AI Resume Analyzer',
      subtitle: 'ATS keyword scanner and format optimizer tailored for college freshers.'
    },
    'ai-interview': {
      title: 'AI Interview Coach',
      subtitle: 'Simulated practice questions with STAR evaluation and fresher model answers.'
    },
    'ai-cover-letter': {
      title: 'AI Cover Letter Generator',
      subtitle: 'Generate high-impact, tailored letters highlighting your college projects.'
    },
    'ai-skills': {
      title: 'AI Skill Gap Analyzer',
      subtitle: 'Find missing industry skills and follow a 4-week placement study roadmap.'
    },
    analytics: {
      title: 'Application Analytics',
      subtitle: 'Funnel progression, conversion rates, and recruitment pipeline charts.'
    },
    settings: {
      title: 'Settings & Data Management',
      subtitle: 'Student profile configuration, CSV/JSON backups, and sample data restoration.'
    }
  };

  const current = titles[sectionId] || titles.dashboard;
  pageTitle.textContent = current.title;
  pageSubtitle.textContent = current.subtitle;
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.remove('open');
  if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
}

/* ============================================================================
   Event Listeners (Modals, Filters, Forms)
   ============================================================================ */
function initEventListeners() {
  // Modal Triggers
  const openModalBtns = [
    document.getElementById('btnSidebarAdd'),
    document.getElementById('btnTopbarAdd'),
    document.getElementById('btnHeroAdd'),
    document.getElementById('btnAddNewApplication'),
    document.getElementById('btnScheduleInterviewModal')
  ];

  openModalBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        const isInterviewModal = btn.id === 'btnScheduleInterviewModal';
        openApplicationModal(null, isInterviewModal);
      });
    }
  });

  // Modal Close
  const btnModalClose = document.getElementById('btnModalClose');
  const btnModalCancel = document.getElementById('btnModalCancel');
  const modalBackdrop = document.getElementById('applicationModalBackdrop');

  if (btnModalClose) btnModalClose.addEventListener('click', closeApplicationModal);
  if (btnModalCancel) btnModalCancel.addEventListener('click', closeApplicationModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeApplicationModal();
    });
  }

  // Delete Confirmation Modal Listeners
  const btnDeleteModalClose = document.getElementById('btnDeleteModalClose');
  const btnDeleteModalCancel = document.getElementById('btnDeleteModalCancel');
  const btnDeleteModalConfirm = document.getElementById('btnDeleteModalConfirm');
  const deleteModalBackdrop = document.getElementById('deleteConfirmModalBackdrop');

  if (btnDeleteModalClose) btnDeleteModalClose.addEventListener('click', closeDeleteConfirmModal);
  if (btnDeleteModalCancel) btnDeleteModalCancel.addEventListener('click', closeDeleteConfirmModal);
  if (btnDeleteModalConfirm) btnDeleteModalConfirm.addEventListener('click', executeDeleteApplication);
  if (deleteModalBackdrop) {
    deleteModalBackdrop.addEventListener('click', (e) => {
      if (e.target === deleteModalBackdrop) closeDeleteConfirmModal();
    });
  }

  // Global Escape key handler for accessible modal closing
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeApplicationModal();
      closeDeleteConfirmModal();
    }
  });

  // Application Form Submit
  const appForm = document.getElementById('applicationForm');
  if (appForm) {
    appForm.addEventListener('submit', handleApplicationFormSubmit);
  }

  // Status change in form (toggle interview date highlight)
  const formStatus = document.getElementById('formStatus');
  const formInterviewGroup = document.getElementById('formInterviewGroup');
  if (formStatus && formInterviewGroup) {
    formStatus.addEventListener('change', () => {
      if (formStatus.value === 'Interview') {
        formInterviewGroup.style.display = 'grid';
      }
    });
  }

  // Applications Filters & Search
  const appSearchInput = document.getElementById('appSearchInput');
  const filterStatusSelect = document.getElementById('filterStatusSelect');
  const filterTypeSelect = document.getElementById('filterTypeSelect');
  const filterLocationSelect = document.getElementById('filterLocationSelect');
  const sortOrderSelect = document.getElementById('sortOrderSelect');
  const btnResetFilters = document.getElementById('btnResetFilters');
  const btnEmptyReset = document.getElementById('btnEmptyReset');

  if (appSearchInput) {
    appSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderApplicationsSection();
    });
  }

  if (filterStatusSelect) {
    filterStatusSelect.addEventListener('change', (e) => {
      state.filterStatus = e.target.value;
      renderApplicationsSection();
    });
  }

  if (filterTypeSelect) {
    filterTypeSelect.addEventListener('change', (e) => {
      state.filterType = e.target.value;
      renderApplicationsSection();
    });
  }

  if (filterLocationSelect) {
    filterLocationSelect.addEventListener('change', (e) => {
      state.filterLocation = e.target.value;
      renderApplicationsSection();
    });
  }

  if (sortOrderSelect) {
    sortOrderSelect.addEventListener('change', (e) => {
      state.sortOrder = e.target.value;
      renderApplicationsSection();
    });
  }

  const resetAction = () => {
    state.searchQuery = '';
    state.filterStatus = 'ALL';
    state.filterType = 'ALL';
    state.filterLocation = 'ALL';
    state.sortOrder = 'date-desc';
    if (appSearchInput) appSearchInput.value = '';
    if (filterStatusSelect) filterStatusSelect.value = 'ALL';
    if (filterTypeSelect) filterTypeSelect.value = 'ALL';
    if (filterLocationSelect) filterLocationSelect.value = 'ALL';
    if (sortOrderSelect) sortOrderSelect.value = 'date-desc';
    renderApplicationsSection();
    showToast('Filters reset to default view', 'info');
  };

  if (btnResetFilters) btnResetFilters.addEventListener('click', resetAction);
  if (btnEmptyReset) btnEmptyReset.addEventListener('click', resetAction);

  // View Mode Toggles (Table vs Kanban)
  const btnViewTable = document.getElementById('btnViewTable');
  const btnViewKanban = document.getElementById('btnViewKanban');

  if (btnViewTable && btnViewKanban) {
    btnViewTable.addEventListener('click', () => {
      state.viewMode = 'table';
      btnViewTable.classList.add('active');
      btnViewKanban.classList.remove('active');
      renderApplicationsSection();
    });

    btnViewKanban.addEventListener('click', () => {
      state.viewMode = 'kanban';
      btnViewKanban.classList.add('active');
      btnViewTable.classList.remove('active');
      renderApplicationsSection();
    });
  }

  // Interview Tracker Tab Toggles
  const interviewTabBtns = document.querySelectorAll('.tab-btn[data-tab]');
  interviewTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      interviewTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.interviewTab = btn.getAttribute('data-tab') || 'upcoming';
      renderInterviewTrackerSection();
    });
  });

  // CSV Export Buttons
  const btnExportCSV = document.getElementById('btnExportCSV');
  const btnExportDataCSV = document.getElementById('btnExportDataCSV');
  if (btnExportCSV) btnExportCSV.addEventListener('click', exportApplicationsToCSV);
  if (btnExportDataCSV) btnExportDataCSV.addEventListener('click', exportApplicationsToCSV);

  // Settings Profile Form
  const settingsProfileForm = document.getElementById('settingsProfileForm');
  if (settingsProfileForm) {
    settingsProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      state.profile.name = document.getElementById('setStudentName').value.trim() || 'Alex Johnson';
      state.profile.university = document.getElementById('setUniversity').value.trim() || 'NIT';
      state.profile.degree = document.getElementById('setDegree').value.trim() || 'B.Tech CS';
      state.profile.gradYear = parseInt(document.getElementById('setGradYear').value, 10) || 2026;
      state.profile.targetRoles = document.getElementById('setTargetRoles').value.trim();
      state.profile.email = document.getElementById('setEmail').value.trim();

      saveProfileToStorage();
      updateProfileUI();
      showToast('Profile details updated successfully! 🎉', 'success');
    });
  }

  // Backup & Reset Buttons
  const btnExportData = document.getElementById('btnExportData');
  if (btnExportData) {
    btnExportData.addEventListener('click', exportApplicationsToJSON);
  }

  const btnTriggerImport = document.getElementById('btnTriggerImport');
  const importFileInput = document.getElementById('importFileInput');
  if (btnTriggerImport && importFileInput) {
    btnTriggerImport.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', handleImportApplicationsJSON);
  }

  const btnResetSampleData = document.getElementById('btnResetSampleData');
  if (btnResetSampleData) {
    btnResetSampleData.addEventListener('click', () => {
      if (confirm('Restore default sample fresher applications? Any custom entries will be reset.')) {
        state.applications = JSON.parse(JSON.stringify(DEFAULT_SAMPLE_APPLICATIONS));
        saveApplicationsToStorage();
        renderApp();
        showToast('Sample fresher applications restored!', 'success');
      }
    });
  }

  const btnClearAllData = document.getElementById('btnClearAllData');
  if (btnClearAllData) {
    btnClearAllData.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete ALL applications? This action cannot be undone.')) {
        state.applications = [];
        saveApplicationsToStorage();
        renderApp();
        showToast('All job application records cleared.', 'warning');
      }
    });
  }
}

/**
 * Global Topbar Search
 */
function initGlobalSearch() {
  const globalSearchInput = document.getElementById('globalSearchInput');
  if (globalSearchInput) {
    globalSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = globalSearchInput.value.trim();
        if (query) {
          state.searchQuery = query.toLowerCase();
          const appSearchInput = document.getElementById('appSearchInput');
          if (appSearchInput) appSearchInput.value = query;
          navigateToSection('applications');
          window.location.hash = 'applications';
          renderApplicationsSection();
        }
      }
    });
  }
}

/* ============================================================================
   Profile UI Sync
   ============================================================================ */
function updateProfileUI() {
  const sidebarUserName = document.getElementById('sidebarUserName');
  const sidebarUserRole = document.getElementById('sidebarUserRole');
  const topbarUserName = document.getElementById('topbarUserName');

  if (sidebarUserName) sidebarUserName.textContent = state.profile.name;
  if (sidebarUserRole) {
    sidebarUserRole.textContent = `Class of ${state.profile.gradYear} • ${state.profile.degree}`;
  }
  if (topbarUserName) {
    const parts = state.profile.name.split(' ');
    topbarUserName.textContent = parts[0] + (parts[1] ? ` ${parts[1][0]}.` : '');
  }

  // Sync settings inputs if present
  const setStudentName = document.getElementById('setStudentName');
  const setUniversity = document.getElementById('setUniversity');
  const setDegree = document.getElementById('setDegree');
  const setGradYear = document.getElementById('setGradYear');
  const setTargetRoles = document.getElementById('setTargetRoles');
  const setEmail = document.getElementById('setEmail');

  if (setStudentName) setStudentName.value = state.profile.name;
  if (setUniversity) setUniversity.value = state.profile.university;
  if (setDegree) setDegree.value = state.profile.degree;
  if (setGradYear) setGradYear.value = state.profile.gradYear;
  if (setTargetRoles) setTargetRoles.value = state.profile.targetRoles;
  if (setEmail) setEmail.value = state.profile.email;
}

/* ============================================================================
   Application Modal Operations (Add / Edit)
   ============================================================================ */
function openApplicationModal(appId = null, prefillInterview = false) {
  const modalBackdrop = document.getElementById('applicationModalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const form = document.getElementById('applicationForm');

  // Clear previous errors
  document.querySelectorAll('.form-error').forEach(err => err.classList.remove('active'));

  if (appId) {
    // Edit Mode
    const app = state.applications.find(a => a.id === appId);
    if (!app) return;

    modalTitle.textContent = `Edit Application: ${app.company}`;
    document.getElementById('formAppId').value = app.id;
    document.getElementById('formCompany').value = app.company;
    document.getElementById('formRole').value = app.role;
    document.getElementById('formLocation').value = app.location;
    document.getElementById('formType').value = app.type;
    document.getElementById('formDate').value = app.date;
    document.getElementById('formSalary').value = app.salary;
    document.getElementById('formStatus').value = app.status;
    document.getElementById('formLink').value = app.link || '';
    document.getElementById('formInterviewDate').value = app.interviewDate || '';
    const formRound = document.getElementById('formInterviewRound');
    if (formRound) formRound.value = app.interviewRound || '';
    document.getElementById('formNotes').value = app.notes || '';

    // Show interview group if status is Interview or date is set
    const formInterviewGroup = document.getElementById('formInterviewGroup');
    if (formInterviewGroup) {
      formInterviewGroup.style.display = (app.status === 'Interview' || app.interviewDate) ? 'grid' : 'none';
    }
  } else {
    // Add Mode
    modalTitle.textContent = 'Add Job Application';
    form.reset();
    document.getElementById('formAppId').value = '';
    // Default today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('formDate').value = today;

    const formInterviewGroup = document.getElementById('formInterviewGroup');

    if (prefillInterview) {
      document.getElementById('formStatus').value = 'Interview';
      // Default interview date tomorrow at 10 AM
      const tmrw = new Date();
      tmrw.setDate(tmrw.getDate() + 1);
      tmrw.setHours(10, 0, 0, 0);
      const isoLocal = tmrw.toISOString().slice(0, 16);
      document.getElementById('formInterviewDate').value = isoLocal;
      const formRound = document.getElementById('formInterviewRound');
      if (formRound) formRound.value = 'Round 1 - Technical Screening';
      if (formInterviewGroup) formInterviewGroup.style.display = 'grid';
    } else {
      document.getElementById('formStatus').value = 'Applied';
      if (formInterviewGroup) formInterviewGroup.style.display = 'none';
    }
  }

  modalBackdrop.classList.add('active');
}

function closeApplicationModal() {
  const modalBackdrop = document.getElementById('applicationModalBackdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('active');
}

function handleApplicationFormSubmit(e) {
  e.preventDefault();

  const appId = document.getElementById('formAppId').value;
  const company = document.getElementById('formCompany').value.trim();
  const role = document.getElementById('formRole').value.trim();
  const location = document.getElementById('formLocation').value.trim() || 'Remote';
  const type = document.getElementById('formType').value;
  const date = document.getElementById('formDate').value;
  const salary = document.getElementById('formSalary').value.trim() || 'Not Disclosed';
  const status = document.getElementById('formStatus').value;
  let link = document.getElementById('formLink').value.trim();
  const interviewDate = document.getElementById('formInterviewDate').value;
  const formRoundEl = document.getElementById('formInterviewRound');
  const interviewRound = formRoundEl ? formRoundEl.value.trim() : '';
  const notes = document.getElementById('formNotes').value.trim();

  // Basic Validation
  let hasError = false;
  if (!company) {
    document.getElementById('errCompany').classList.add('active');
    hasError = true;
  } else {
    document.getElementById('errCompany').classList.remove('active');
  }

  if (!role) {
    document.getElementById('errRole').classList.add('active');
    hasError = true;
  } else {
    document.getElementById('errRole').classList.remove('active');
  }

  if (!date) {
    document.getElementById('errDate').classList.add('active');
    hasError = true;
  } else {
    document.getElementById('errDate').classList.remove('active');
  }

  // URL Format Validation
  const errLink = document.getElementById('errLink');
  if (link) {
    let testUrl = link;
    if (!/^https?:\/\//i.test(testUrl)) {
      testUrl = 'https://' + testUrl;
    }
    try {
      new URL(testUrl);
      link = testUrl; // Store normalized URL
      if (errLink) errLink.classList.remove('active');
    } catch (urlErr) {
      if (errLink) errLink.classList.add('active');
      hasError = true;
    }
  } else {
    if (errLink) errLink.classList.remove('active');
  }

  if (hasError) return;

  // Duplicate Check for New Applications
  if (!appId) {
    const duplicate = state.applications.find(a => 
      a.company.toLowerCase() === company.toLowerCase() && 
      a.role.toLowerCase() === role.toLowerCase()
    );

    if (duplicate) {
      const confirmAdd = confirm(
        `An application for "${company} - ${role}" already exists in your tracker (applied on ${formatDate(duplicate.date)}).\n\nDo you still want to create another record?`
      );
      if (!confirmAdd) return;
    }
  }

  if (appId) {
    // Update existing
    const index = state.applications.findIndex(a => a.id === appId);
    if (index !== -1) {
      state.applications[index] = {
        ...state.applications[index],
        company,
        role,
        location,
        type,
        date,
        salary,
        status,
        link,
        interviewDate,
        interviewRound,
        notes
      };
      showToast(`Updated application for ${company}`, 'success');
    }
  } else {
    // Create new
    const newApp = {
      id: 'app-' + Date.now(),
      company,
      role,
      location,
      type,
      date,
      salary,
      status,
      link,
      interviewDate,
      interviewRound,
      notes
    };
    state.applications.unshift(newApp);
    showToast(`Application for ${company} added! 🚀`, 'success');
  }

  saveApplicationsToStorage();
  closeApplicationModal();
  renderApp();
}

/**
 * Accessible Custom Confirmation Dialog for Application Deletion
 */
function confirmDeleteApplication(id) {
  const app = state.applications.find(a => a.id === id);
  if (!app) return;

  state.pendingDeleteId = id;
  const modalBackdrop = document.getElementById('deleteConfirmModalBackdrop');
  const messageEl = document.getElementById('deleteModalMessage');

  if (messageEl) {
    messageEl.innerHTML = `Are you sure you want to delete the application for <strong>${escapeHtml(app.company)} — ${escapeHtml(app.role)}</strong>?<br><br>This will permanently remove the record from your tracker.`;
  }

  if (modalBackdrop) {
    modalBackdrop.classList.add('active');
    const confirmBtn = document.getElementById('btnDeleteModalConfirm');
    if (confirmBtn) confirmBtn.focus();
  }
}

function closeDeleteConfirmModal() {
  state.pendingDeleteId = null;
  const modalBackdrop = document.getElementById('deleteConfirmModalBackdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('active');
}

function executeDeleteApplication() {
  if (!state.pendingDeleteId) return;
  const id = state.pendingDeleteId;
  const app = state.applications.find(a => a.id === id);
  const companyName = app ? app.company : 'Selected';

  state.applications = state.applications.filter(a => a.id !== id);
  saveApplicationsToStorage();
  closeDeleteConfirmModal();
  renderApp();
  showToast(`Deleted application for ${companyName}`, 'info');
}

// Global hook for HTML onclick handlers
window.deleteApplication = confirmDeleteApplication;
window.openApplicationModal = openApplicationModal;

/* ============================================================================
   Render Orchestration
   ============================================================================ */
function renderApp() {
  updateBadges();
  renderDashboard();
  renderApplicationsSection();
  renderInterviewTrackerSection();
  renderAnalyticsSection();
}

/**
 * Update Sidebar counts & badges
 */
function updateBadges() {
  const badgeApplicationsCount = document.getElementById('badgeApplicationsCount');
  const badgeInterviewsCount = document.getElementById('badgeInterviewsCount');

  const total = state.applications.length;
  const interviewsCount = state.applications.filter(a => a.status === 'Interview').length;

  if (badgeApplicationsCount) badgeApplicationsCount.textContent = total;
  if (badgeInterviewsCount) badgeInterviewsCount.textContent = interviewsCount;

  // Hero card stats
  const heroTotalCount = document.getElementById('heroTotalCount');
  const heroInterviewsCount = document.getElementById('heroInterviewsCount');
  const heroOfferCount = document.getElementById('heroOfferCount');

  const offersCount = state.applications.filter(a => a.status === 'Selected').length;

  if (heroTotalCount) heroTotalCount.textContent = total;
  if (heroInterviewsCount) heroInterviewsCount.textContent = `${interviewsCount} ${interviewsCount === 1 ? 'interview' : 'interviews'}`;
  if (heroOfferCount) heroOfferCount.textContent = offersCount;
}

/* ============================================================================
   Dashboard Rendering (KPIs, Recent Table, Interviews)
   ============================================================================ */
function renderDashboard() {
  const total = state.applications.length;
  const interviews = state.applications.filter(a => a.status === 'Interview').length;
  const offers = state.applications.filter(a => a.status === 'Selected').length;
  const rejections = state.applications.filter(a => a.status === 'Rejected' || a.status === 'No Response').length;

  // Update KPI Elements
  const kpiTotal = document.getElementById('kpiTotalApplications');
  const kpiInterviews = document.getElementById('kpiInterviews');
  const kpiOffers = document.getElementById('kpiOffers');
  const kpiRejections = document.getElementById('kpiRejections');

  if (kpiTotal) kpiTotal.textContent = total;
  if (kpiInterviews) kpiInterviews.textContent = interviews;
  if (kpiOffers) kpiOffers.textContent = offers;
  if (kpiRejections) kpiRejections.textContent = rejections;

  // Render Recent Applications Table (Top 5)
  const recentTableBody = document.getElementById('dashboardRecentBody');
  if (recentTableBody) {
    if (state.applications.length === 0) {
      recentTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 24px; color: var(--text-muted);">
            No applications added yet. Click <strong>+ Add Application</strong> to begin!
          </td>
        </tr>
      `;
    } else {
      const recentApps = state.applications.slice(0, 5);
      recentTableBody.innerHTML = recentApps.map(app => `
        <tr>
          <td>
            <div class="table-company-cell">
              <div class="cell-avatar">${escapeHtml(app.company.charAt(0))}</div>
              <div>
                <strong>${escapeHtml(app.company)}</strong>
                ${app.link ? `<a href="${escapeHtml(app.link)}" target="_blank" rel="noopener noreferrer" style="display:block; font-size:0.72rem; color: #6366f1;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Portal</a>` : ''}
              </div>
            </div>
          </td>
          <td>${escapeHtml(app.role)}</td>
          <td>${escapeHtml(app.location)}</td>
          <td>${formatDate(app.date)}</td>
          <td>
            <span class="status-badge ${getStatusBadgeClass(app.status)}">
              <span class="status-dot ${getStatusDotClass(app.status)}"></span>
              ${escapeHtml(app.status)}
            </span>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn-table-action" onclick="openApplicationModal('${app.id}')" title="Edit Application">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-table-action btn-del" onclick="deleteApplication('${app.id}')" title="Delete Application">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  // Render Upcoming Interviews Widget
  const dashboardInterviewsList = document.getElementById('dashboardInterviewsList');
  if (dashboardInterviewsList) {
    const interviewApps = state.applications
      .filter(a => a.status === 'Interview')
      .sort((a, b) => new Date(a.interviewDate || '9999-12-31') - new Date(b.interviewDate || '9999-12-31'));

    if (interviewApps.length === 0) {
      dashboardInterviewsList.innerHTML = `
        <div style="text-align: center; padding: 20px 10px; color: var(--text-muted); font-size: 0.82rem;">
          <i class="fa-regular fa-calendar-check" style="font-size: 1.8rem; margin-bottom: 8px; display: block; color: #cbd5e1;"></i>
          No interviews currently scheduled. Keep applying!
        </div>
      `;
    } else {
      dashboardInterviewsList.innerHTML = interviewApps.slice(0, 3).map(app => {
        const isOverdue = app.interviewDate && new Date(app.interviewDate) < new Date();
        const timeBadge = isOverdue
          ? '<span style="color:#ef4444; font-weight:700;"><i class="fa-solid fa-triangle-exclamation"></i> Follow-up Due</span>'
          : `<span class="comp-time"><i class="fa-regular fa-clock"></i> ${formatDateTime(app.interviewDate)}</span>`;

        return `
          <div class="compact-interview-item ${isOverdue ? 'card-overdue' : ''}" onclick="openApplicationModal('${app.id}')" style="cursor: pointer;">
            <div class="comp-avatar">${escapeHtml(app.company.charAt(0))}</div>
            <div class="comp-details">
              <h4 class="comp-company">${escapeHtml(app.company)}</h4>
              <p class="comp-role">${escapeHtml(app.role)}</p>
              ${timeBadge}
            </div>
            <i class="fa-solid fa-chevron-right text-muted" style="font-size: 0.75rem;"></i>
          </div>
        `;
      }).join('');
    }
  }

  renderDashboardCharts();
}

/**
 * Chart.js: Dashboard Status & Activity Charts with graceful fallback
 */
function renderDashboardCharts() {
  if (typeof Chart === 'undefined') return;

  const statusCanvas = document.getElementById('dashboardStatusChart');
  const activityCanvas = document.getElementById('dashboardActivityChart');

  // Count by status
  const statuses = ['Applied', 'Interview', 'Selected', 'Rejected', 'No Response'];
  const statusCounts = statuses.map(s => state.applications.filter(a => a.status === s).length);

  // Status Donut Chart
  if (statusCanvas) {
    if (state.charts.statusChart) state.charts.statusChart.destroy();

    const ctx = statusCanvas.getContext('2d');
    state.charts.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: statuses,
        datasets: [{
          data: statusCounts,
          backgroundColor: [
            '#0284c7', // Applied (Blue)
            '#9333ea', // Interview (Purple)
            '#16a34a', // Selected (Green)
            '#ef4444', // Rejected (Red)
            '#64748b'  // No Response (Slate)
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.label}: ${context.raw} applications`
            }
          }
        }
      }
    });

    // Custom Legend
    const legendContainer = document.getElementById('dashboardChartLegend');
    if (legendContainer) {
      legendContainer.innerHTML = statuses.map((s, i) => `
        <div class="legend-item">
          <span class="legend-color" style="background-color: ${state.charts.statusChart.data.datasets[0].backgroundColor[i]};"></span>
          <span>${s} (${statusCounts[i]})</span>
        </div>
      `).join('');
    }
  }

  // Weekly Activity Bar Chart
  if (activityCanvas) {
    if (state.charts.activityChart) state.charts.activityChart.destroy();

    const ctx = activityCanvas.getContext('2d');
    state.charts.activityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Wk 1 (Sep)', 'Wk 2 (Sep)', 'Wk 3 (Sep)', 'Wk 4 (Sep)', 'Wk 1 (Oct)', 'Wk 2 (Oct)', 'Wk 3 (Oct)', 'This Week'],
        datasets: [{
          label: 'Applications Submitted',
          data: [2, 3, 5, 4, 6, 7, 5, state.applications.length > 5 ? 8 : state.applications.length],
          backgroundColor: '#8b5cf6',
          borderRadius: 6,
          hoverBackgroundColor: '#7c3aed'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0, font: { family: 'Plus Jakarta Sans', size: 11 } },
            grid: { color: '#f1f5f9' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Plus Jakarta Sans', size: 10 } }
          }
        }
      }
    });
  }
}

/* ============================================================================
   Applications Section Rendering (Table & Kanban)
   ============================================================================ */
function populateLocationFilterOptions() {
  const select = document.getElementById('filterLocationSelect');
  if (!select) return;

  const currentSelection = state.filterLocation || 'ALL';
  const locations = Array.from(new Set(state.applications.map(a => (a.location || 'Remote').trim()))).sort();

  select.innerHTML = '<option value="ALL">All Locations</option>' +
    locations.map(loc => `
      <option value="${escapeHtml(loc)}"${loc.toLowerCase() === currentSelection.toLowerCase() ? ' selected' : ''}>
        ${escapeHtml(loc)}
      </option>
    `).join('');
}

function renderApplicationsSection() {
  populateLocationFilterOptions();

  // Apply Search (Company and Role), Status Filter, Job Type Filter, and Location Filter
  let filtered = state.applications.filter(app => {
    // Search query matches company or role
    const matchSearch = state.searchQuery === '' ||
      app.company.toLowerCase().includes(state.searchQuery) ||
      app.role.toLowerCase().includes(state.searchQuery);

    // Status filter
    const matchStatus = state.filterStatus === 'ALL' || app.status === state.filterStatus;

    // Type filter
    const matchType = state.filterType === 'ALL' || app.type === state.filterType;

    // Location filter
    const matchLocation = state.filterLocation === 'ALL' || app.location.toLowerCase() === state.filterLocation.toLowerCase();

    return matchSearch && matchStatus && matchType && matchLocation;
  });

  // Sort by Application Date or Company Name
  filtered.sort((a, b) => {
    switch (state.sortOrder) {
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'company-asc':
        return a.company.localeCompare(b.company);
      case 'company-desc':
        return b.company.localeCompare(a.company);
      case 'date-desc':
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  // Update counter
  const filterCountDisplay = document.getElementById('filterCountDisplay');
  if (filterCountDisplay) {
    filterCountDisplay.textContent = `Showing ${filtered.length} of ${state.applications.length} applications`;
  }

  // Toggle Table vs Kanban views
  const tableView = document.getElementById('applicationsTableView');
  const kanbanView = document.getElementById('applicationsKanbanView');
  const emptyState = document.getElementById('appsEmptyState');
  const tableBody = document.getElementById('fullApplicationsBody');

  if (state.viewMode === 'table') {
    if (tableView) tableView.style.display = 'block';
    if (kanbanView) kanbanView.style.display = 'none';

    if (filtered.length === 0) {
      if (tableBody) tableBody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      if (tableBody) {
        tableBody.innerHTML = filtered.map(app => `
          <tr>
            <td>
              <div class="table-company-cell">
                <div class="cell-avatar">${escapeHtml(app.company.charAt(0))}</div>
                <div>
                  <strong>${escapeHtml(app.company)}</strong>
                  ${app.link ? `<a href="${escapeHtml(app.link)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:4px; font-size:0.72rem; color: #4f46e5; margin-top:2px;" title="Open link in new tab"><i class="fa-solid fa-arrow-up-right-from-square"></i> Portal</a>` : ''}
                </div>
              </div>
            </td>
            <td>
              <strong>${escapeHtml(app.role)}</strong>
              ${app.interviewRound ? `<span style="display:block; font-size:0.72rem; color:#7c3aed;"><i class="fa-solid fa-layer-group"></i> ${escapeHtml(app.interviewRound)}</span>` : ''}
              ${app.notes ? `<p style="font-size:0.74rem; color:var(--text-muted); max-width:240px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(app.notes)}</p>` : ''}
            </td>
            <td><i class="fa-solid fa-location-dot" style="font-size:0.75rem; color:#94a3b8;"></i> ${escapeHtml(app.location)}</td>
            <td><span class="badge badge-outline">${escapeHtml(app.type)}</span></td>
            <td>${formatDate(app.date)}</td>
            <td style="font-weight:600; color:#334155;">${escapeHtml(app.salary)}</td>
            <td>
              <span class="status-badge ${getStatusBadgeClass(app.status)}">
                <span class="status-dot ${getStatusDotClass(app.status)}"></span>
                ${escapeHtml(app.status)}
              </span>
            </td>
            <td>
              ${app.interviewDate ? `<span style="font-weight:600; color:#7c3aed; font-size:0.78rem;"><i class="fa-regular fa-clock"></i> ${formatDateTime(app.interviewDate)}</span>` : '<span style="color:#cbd5e1;">—</span>'}
            </td>
            <td class="text-right">
              <div class="table-actions">
                <button class="btn-table-action" onclick="openApplicationModal('${app.id}')" title="Edit Application">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-table-action btn-del" onclick="deleteApplication('${app.id}')" title="Delete Application">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        `).join('');
      }
    }
  } else {
    // Kanban View
    if (tableView) tableView.style.display = 'none';
    if (kanbanView) kanbanView.style.display = 'block';

    const statuses = ['Applied', 'Interview', 'Selected', 'Rejected', 'No Response'];

    statuses.forEach(st => {
      const colCardsWrapper = document.getElementById(`kanbanCards${st.replace(/\s+/g, '')}`);
      const colBadge = document.getElementById(`countKanban${st.replace(/\s+/g, '')}`);
      const colApps = filtered.filter(a => a.status === st);

      if (colBadge) colBadge.textContent = colApps.length;

      if (colCardsWrapper) {
        if (colApps.length === 0) {
          colCardsWrapper.innerHTML = `
            <div style="text-align: center; padding: 24px 8px; color: var(--text-muted); font-size: 0.78rem;">
              No applications
            </div>
          `;
        } else {
          colCardsWrapper.innerHTML = colApps.map(app => `
            <div class="kanban-card">
              <div class="kanban-card-top">
                <h4 class="kb-company">${escapeHtml(app.company)}</h4>
                <span class="badge badge-outline">${escapeHtml(app.type)}</span>
              </div>
              <p class="kb-role">${escapeHtml(app.role)}</p>
              
              <div class="kb-meta">
                <div><i class="fa-solid fa-location-dot"></i> ${escapeHtml(app.location)}</div>
                <div><i class="fa-regular fa-calendar"></i> Applied: ${formatDate(app.date)}</div>
                ${app.interviewRound ? `<div><i class="fa-solid fa-layer-group"></i> ${escapeHtml(app.interviewRound)}</div>` : ''}
                ${app.interviewDate ? `<div style="color:#7c3aed; font-weight:600;"><i class="fa-regular fa-clock"></i> ${formatDateTime(app.interviewDate)}</div>` : ''}
                ${app.link ? `<div style="margin-top:2px;"><a href="${escapeHtml(app.link)}" target="_blank" rel="noopener noreferrer" style="color:#4f46e5; text-decoration:underline;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Job Link</a></div>` : ''}
              </div>

              <div class="kb-actions">
                <span style="font-weight:700; font-size:0.75rem; color:#475569;">${escapeHtml(app.salary)}</span>
                <div>
                  <button class="btn-table-action" onclick="openApplicationModal('${app.id}')" title="Edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="btn-table-action btn-del" onclick="deleteApplication('${app.id}')" title="Delete">
                    <i class="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          `).join('');
        }
      }
    });
  }
}

/* ============================================================================
   Interview Tracker Section Rendering (Highlight Overdue & Upcoming)
   ============================================================================ */
function renderInterviewTrackerSection() {
  const container = document.getElementById('interviewsCardsGrid');
  const countUpcoming = document.getElementById('tabCountUpcoming');
  const countAll = document.getElementById('tabCountAll');

  const now = new Date();
  const allInterviews = state.applications.filter(a => a.status === 'Interview' || a.interviewDate);

  // Distinguish Upcoming (interview date >= now) vs Overdue / Past
  const upcomingInterviews = allInterviews.filter(a => {
    if (!a.interviewDate) return a.status === 'Interview';
    return new Date(a.interviewDate) >= now;
  });

  if (countUpcoming) countUpcoming.textContent = upcomingInterviews.length;
  if (countAll) countAll.textContent = allInterviews.length;

  if (!container) return;

  const displayList = state.interviewTab === 'upcoming' ? upcomingInterviews : allInterviews;

  if (displayList.length === 0) {
    container.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 48px 20px;">
        <i class="fa-solid fa-calendar-xmark" style="font-size: 2.5rem; color: #cbd5e1; margin-bottom: 12px;"></i>
        <h3>${state.interviewTab === 'upcoming' ? 'No Upcoming Interviews' : 'No Interviews Recorded'}</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">
          ${state.interviewTab === 'upcoming' 
            ? 'You have no interviews scheduled in the future. Check "All Interviews" or log a new round!' 
            : 'When you receive an interview call, click "Schedule / Update Interview" to track it here.'}
        </p>
        <button class="btn btn-primary btn-sm mt-3" onclick="openApplicationModal(null, true)">
          <i class="fa-solid fa-plus"></i> Schedule Interview
        </button>
      </div>
    `;
    return;
  }

  // Sort chronologically
  displayList.sort((a, b) => new Date(a.interviewDate || '9999-12-31') - new Date(b.interviewDate || '9999-12-31'));

  container.innerHTML = displayList.map(app => {
    const isOverdue = app.status === 'Interview' && app.interviewDate && new Date(app.interviewDate) < now;
    const countdown = getCountdownString(app.interviewDate);

    let statusPill = '';
    let cardClass = 'interview-card';

    if (isOverdue) {
      cardClass += ' card-overdue';
      statusPill = `<span class="iv-countdown-badge badge-overdue"><i class="fa-solid fa-triangle-exclamation"></i> Follow-up Overdue</span>`;
    } else if (app.interviewDate && new Date(app.interviewDate) >= now) {
      cardClass += ' card-upcoming';
      statusPill = `<span class="iv-countdown-badge badge-upcoming"><i class="fa-regular fa-clock"></i> ${countdown}</span>`;
    } else {
      statusPill = `<span class="iv-countdown-badge">${escapeHtml(app.status)}</span>`;
    }

    return `
      <div class="${cardClass}">
        <div class="interview-card-header">
          <div class="iv-avatar">${escapeHtml(app.company.charAt(0))}</div>
          <div class="iv-info">
            <h3 class="iv-company">${escapeHtml(app.company)}</h3>
            <p class="iv-role">${escapeHtml(app.role)}</p>
          </div>
          ${statusPill}
        </div>

        <div class="interview-details-box">
          <div class="iv-detail-row">
            <i class="fa-regular fa-calendar-check"></i>
            <span><strong>Date & Time:</strong> ${formatDateTime(app.interviewDate)}</span>
          </div>
          <div class="iv-detail-row">
            <i class="fa-solid fa-layer-group"></i>
            <span><strong>Interview Round:</strong> ${escapeHtml(app.interviewRound || 'Round 1 / Technical')}</span>
          </div>
          <div class="iv-detail-row">
            <i class="fa-solid fa-location-dot"></i>
            <span><strong>Location / Platform:</strong> ${escapeHtml(app.location)}</span>
          </div>
          <div class="iv-detail-row">
            <i class="fa-solid fa-indian-rupee-sign"></i>
            <span><strong>Compensation:</strong> ${escapeHtml(app.salary)}</span>
          </div>
        </div>

        <div class="iv-notes-box">
          <strong>Prep Notes:</strong>
          <p>${escapeHtml(app.notes || 'No specific notes recorded. Review technical project architecture and prepare 2 reverse questions.')}</p>
        </div>

        ${isOverdue ? `
          <div style="background-color: #fee2e2; border-radius: 6px; padding: 8px 12px; margin-bottom: 12px; font-size: 0.76rem; color: #991b1b;">
            <i class="fa-solid fa-bell"></i> <strong>Follow-up Action:</strong> This interview date has passed. Send a thank-you note or follow up with your recruiter, then update the status below.
          </div>
        ` : ''}

        <div class="iv-card-actions">
          <button class="btn btn-outline btn-sm" onclick="openApplicationModal('${app.id}')">
            <i class="fa-solid fa-pen-to-square"></i> Edit Details
          </button>
          <button class="btn btn-primary btn-sm" onclick="quickUpdateInterviewStatus('${app.id}')">
            <i class="fa-solid fa-circle-check"></i> Update Status
          </button>
          <button class="btn btn-outline btn-sm" onclick="deleteApplication('${app.id}')" title="Delete Interview Record" style="color: #ef4444;">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function quickUpdateInterviewStatus(id) {
  const app = state.applications.find(a => a.id === id);
  if (!app) return;

  const choices = ['Selected', 'Rejected', 'Interview', 'No Response'];
  const userChoice = prompt(
    `Update status for ${app.company} (${app.role}):\n\nEnter one of the following:\n- Selected (Offer received)\n- Rejected\n- Interview (Still in rounds)\n- No Response`,
    app.status === 'Interview' ? 'Selected' : app.status
  );

  if (userChoice) {
    const matched = choices.find(c => c.toLowerCase() === userChoice.trim().toLowerCase());
    if (matched) {
      app.status = matched;
      saveApplicationsToStorage();
      renderApp();
      showToast(`Status updated to "${matched}" for ${app.company}! 🎉`, 'success');
    } else {
      showToast('Invalid status entered. Must be Selected, Rejected, Interview, or No Response.', 'warning');
    }
  }
}
window.quickUpdateInterviewStatus = quickUpdateInterviewStatus;

/* ============================================================================
   Analytics Section Rendering
   ============================================================================ */
function renderAnalyticsSection() {
  const total = state.applications.length;
  const interviews = state.applications.filter(a => a.status === 'Interview').length;
  const offers = state.applications.filter(a => a.status === 'Selected').length;
  const rejections = state.applications.filter(a => a.status === 'Rejected').length;
  const noResponse = state.applications.filter(a => a.status === 'No Response').length;
  const activePipeline = state.applications.filter(a => a.status === 'Applied' || a.status === 'Interview').length;

  const interviewRate = total > 0 ? ((interviews + offers) / total * 100).toFixed(1) : 0;
  const offerRate = total > 0 ? (offers / total * 100).toFixed(1) : 0;
  const responseRate = total > 0 ? (((total - noResponse) / total) * 100).toFixed(1) : 0;

  // KPI Metrics
  const elInterviewRate = document.getElementById('analyticsInterviewRate');
  const elOfferRate = document.getElementById('analyticsOfferRate');
  const elResponseRate = document.getElementById('analyticsResponseRate');
  const elActivePipeline = document.getElementById('analyticsActivePipeline');

  if (elInterviewRate) elInterviewRate.textContent = `${interviewRate}%`;
  if (elOfferRate) elOfferRate.textContent = `${offerRate}%`;
  if (elResponseRate) elResponseRate.textContent = `${responseRate}%`;
  if (elActivePipeline) elActivePipeline.textContent = activePipeline;

  // Placement Funnel
  const funnelContainer = document.getElementById('analyticsFunnelContainer');
  if (funnelContainer) {
    const steps = [
      { label: '1. Applications Submitted', count: total, percent: 100, color: 'linear-gradient(90deg, #3b82f6, #2563eb)' },
      { label: '2. Under Review & Callbacks', count: Math.max(0, total - noResponse), percent: total > 0 ? Math.round(((total - noResponse) / total) * 100) : 0, color: 'linear-gradient(90deg, #6366f1, #8b5cf6)' },
      { label: '3. Technical & HR Interviews', count: (interviews + offers), percent: total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0, color: 'linear-gradient(90deg, #a855f7, #7c3aed)' },
      { label: '4. Final Offers (Selected)', count: offers, percent: total > 0 ? Math.round((offers / total) * 100) : 0, color: 'linear-gradient(90deg, #22c55e, #16a34a)' }
    ];

    funnelContainer.innerHTML = steps.map(st => `
      <div class="funnel-step">
        <div class="funnel-step-label">
          <span>${st.label}</span>
          <span><strong>${st.count}</strong> (${st.percent}%)</span>
        </div>
        <div class="funnel-bar-bg">
          <div class="funnel-bar-fill" style="width: ${st.percent}%; background: ${st.color};"></div>
        </div>
      </div>
    `).join('');
  }

  renderAnalyticsCharts();
}

function renderAnalyticsCharts() {
  if (typeof Chart === 'undefined') return;

  // Job Type Chart
  const jobTypeCanvas = document.getElementById('analyticsJobTypeChart');
  if (jobTypeCanvas) {
    if (state.charts.jobTypeChart) state.charts.jobTypeChart.destroy();

    const types = ['Full-time', 'Internship', 'Remote'];
    const typeCounts = types.map(t => state.applications.filter(a => a.type === t).length);

    const ctx = jobTypeCanvas.getContext('2d');
    state.charts.jobTypeChart = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: types,
        datasets: [{
          data: typeCounts,
          backgroundColor: [
            'rgba(59, 130, 246, 0.75)',
            'rgba(147, 51, 234, 0.75)',
            'rgba(16, 185, 129, 0.75)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'Plus Jakarta Sans', size: 11 } } }
        }
      }
    });
  }

  // Monthly Timeline Chart
  const timelineCanvas = document.getElementById('analyticsTimelineChart');
  if (timelineCanvas) {
    if (state.charts.timelineChart) state.charts.timelineChart.destroy();

    const ctx = timelineCanvas.getContext('2d');
    state.charts.timelineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['June', 'July', 'August', 'September', 'October (Current)'],
        datasets: [{
          label: 'Cumulative Applications',
          data: [1, 3, 5, 6, state.applications.length],
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124, 58, 237, 0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 5,
          pointBackgroundColor: '#7c3aed'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0, font: { family: 'Plus Jakarta Sans' } },
            grid: { color: '#f1f5f9' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Plus Jakarta Sans' } }
          }
        }
      }
    });
  }
}

/* ============================================================================
   CSV Export Engine (RFC-4180 Compliant)
   ============================================================================ */
function exportApplicationsToCSV() {
  if (state.applications.length === 0) {
    showToast('No applications found to export.', 'warning');
    return;
  }

  const btnExport = document.getElementById('btnExportCSV');
  const btnExportData = document.getElementById('btnExportDataCSV');
  if (btnExport) btnExport.classList.add('btn-loading');
  if (btnExportData) btnExportData.classList.add('btn-loading');

  setTimeout(() => {
    try {
      const headers = [
        'Application ID',
        'Company Name',
        'Job Role',
        'Location',
        'Job Type',
        'Application Date',
        'Salary / Stipend',
        'Status',
        'Interview Date',
        'Interview Round',
        'Job Link',
        'Notes'
      ];

      const rows = state.applications.map(app => [
        escapeCSVCell(app.id),
        escapeCSVCell(app.company),
        escapeCSVCell(app.role),
        escapeCSVCell(app.location),
        escapeCSVCell(app.type),
        escapeCSVCell(app.date),
        escapeCSVCell(app.salary),
        escapeCSVCell(app.status),
        escapeCSVCell(app.interviewDate || ''),
        escapeCSVCell(app.interviewRound || ''),
        escapeCSVCell(app.link || ''),
        escapeCSVCell(app.notes || '')
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      
      // UTF-8 BOM for perfect Excel support
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', url);
      const dateStr = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute('download', `CareerPulse_Job_Applications_${dateStr}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(url);

      showToast(`Exported ${state.applications.length} applications to CSV! 📊`, 'success');
    } catch (err) {
      console.error('Error generating CSV:', err);
      showToast('Error exporting CSV file.', 'error');
    } finally {
      if (btnExport) btnExport.classList.remove('btn-loading');
      if (btnExportData) btnExportData.classList.remove('btn-loading');
    }
  }, 250);
}

function escapeCSVCell(value) {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/* ============================================================================
   JSON Backup & Restore Utilities
   ============================================================================ */
function exportApplicationsToJSON() {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    version: '2.0',
    profile: state.profile,
    applications: state.applications
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `CareerPulse_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast('Applications backup exported successfully as JSON file!', 'success');
}

function handleImportApplicationsJSON(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      if (imported && Array.isArray(imported.applications)) {
        state.applications = imported.applications.map(item => ({
          id: item.id || 'app-' + Date.now(),
          company: item.company || 'Unknown',
          role: item.role || 'Role',
          location: item.location || 'Remote',
          type: item.type || 'Full-time',
          date: item.date || new Date().toISOString().split('T')[0],
          salary: item.salary || 'Not Disclosed',
          status: item.status || 'Applied',
          link: item.link || '',
          interviewDate: item.interviewDate || '',
          interviewRound: item.interviewRound || '',
          notes: item.notes || ''
        }));

        if (imported.profile) {
          state.profile = { ...state.profile, ...imported.profile };
        }

        saveApplicationsToStorage();
        saveProfileToStorage();
        updateProfileUI();
        renderApp();
        showToast(`Successfully imported ${imported.applications.length} applications!`, 'success');
      } else {
        showToast('Invalid backup file format. Expected applications array.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error parsing JSON backup file.', 'error');
    }
  };
  reader.readAsText(file);
}

/* ============================================================================
   AI Modules (Interactive Phase 1/2 Previews)
   ============================================================================ */
function initAIModules() {
  initResumeAnalyzer();
  initInterviewCoach();
  initCoverLetterGenerator();
  initSkillGapAnalyzer();
}

/**
 * 1. AI Resume Analyzer
 */
function initResumeAnalyzer() {
  const btnLoadSampleResume = document.getElementById('btnLoadSampleResume');
  const resumeText = document.getElementById('aiResumeText');
  const jobDesc = document.getElementById('aiJobDescription');
  const btnRunAnalysis = document.getElementById('btnRunResumeAnalysis');
  const resumeDropzone = document.getElementById('resumeDropzone');
  const resumeFileInput = document.getElementById('resumeFileInput');
  const dropzoneFileName = document.getElementById('dropzoneFileName');

  const sampleResume = `ALEX JOHNSON
Email: alex.johnson@student.edu | GitHub: github.com/alex-dev | LinkedIn: linkedin.com/in/alex-cs

EDUCATION:
B.Tech in Computer Science & Engineering | Expected: 2026 | CGPA: 8.8 / 10.0

TECHNICAL SKILLS:
- Languages: JavaScript (ES6+), TypeScript, Python, HTML5, CSS3, SQL, C++
- Frameworks & Libraries: React.js, Node.js, Express, Tailwind CSS, Redux Toolkit
- Developer Tools: Git, GitHub, VS Code, Postman, Linux, Vercel

PROJECTS:
1. CampusHub - Full-Stack Collaboration Platform
   - Built a real-time discussion forum using React.js and Node.js with RESTful APIs.
   - Reduced database query latency by 40% through indexing and MongoDB aggregations.
   - Used by 1,200+ students during campus hackathons.

2. CodeTrack - Algorithm Visualizer Web App
   - Developed interactive sorting & pathfinding visualization using JavaScript Canvas.
   - Deployed live on Vercel with over 5,000 unique monthly visitors.`;

  const sampleJD = `Software Engineer Intern / Associate Frontend Engineer
Requirements:
- Strong knowledge of modern JavaScript (ES6+), React.js, and CSS3.
- Familiarity with REST APIs, Git version control, and responsive design.
- Basic understanding of TypeScript, Docker, SQL databases, and Unit Testing (Jest).
- Excellent problem-solving skills and eager fresher mindset.`;

  if (btnLoadSampleResume) {
    btnLoadSampleResume.addEventListener('click', () => {
      if (resumeText) resumeText.value = sampleResume;
      if (jobDesc) jobDesc.value = sampleJD;
      if (dropzoneFileName) dropzoneFileName.textContent = 'Alex_Johnson_Fresher_Resume.pdf (Loaded)';
      showToast('Loaded sample fresher resume and target job description!', 'info');
    });
  }

  if (resumeDropzone && resumeFileInput) {
    resumeDropzone.addEventListener('click', () => resumeFileInput.click());
    resumeFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        dropzoneFileName.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        if (!resumeText.value) {
          resumeText.value = `[Extracted text from ${file.name}]\n` + sampleResume;
        }
        showToast(`Uploaded ${file.name}`, 'success');
      }
    });
  }

  if (btnRunAnalysis) {
    btnRunAnalysis.addEventListener('click', () => {
      const text = (resumeText.value || sampleResume).toLowerCase();
      const jd = (jobDesc.value || sampleJD).toLowerCase();

      // Scan keywords
      const commonTechKeywords = [
        'javascript', 'react', 'html', 'css', 'git', 'sql', 'python',
        'typescript', 'docker', 'jest', 'rest api', 'node', 'mongodb', 'data structures'
      ];

      const matched = [];
      const missing = [];

      commonTechKeywords.forEach(kw => {
        const inJD = jd.includes(kw);
        const inResume = text.includes(kw);

        if (inJD && inResume) matched.push(kw);
        else if (inJD && !inResume) missing.push(kw);
        else if (inResume) matched.push(kw);
      });

      // Calculate dynamic score
      const totalKey = matched.length + missing.length;
      const score = totalKey > 0 ? Math.min(95, Math.max(55, Math.round((matched.length / totalKey) * 100))) : 82;

      // Update Gauge
      const scoreCircleValue = document.getElementById('scoreCircleValue');
      const scoreCirclePath = document.getElementById('scoreCirclePath');
      const scoreBadge = document.getElementById('resumeScoreBadge');

      if (scoreCircleValue) scoreCircleValue.textContent = `${score}%`;
      if (scoreCirclePath) scoreCirclePath.setAttribute('stroke-dasharray', `${score}, 100`);

      if (scoreBadge) {
        if (score >= 80) {
          scoreBadge.textContent = 'Strong ATS Match';
          scoreBadge.className = 'badge badge-success';
        } else {
          scoreBadge.textContent = 'Moderate Match';
          scoreBadge.className = 'badge badge-warning';
        }
      }

      // Update matched skills tags
      const matchedContainer = document.getElementById('matchedSkillsTags');
      if (matchedContainer && matched.length > 0) {
        matchedContainer.innerHTML = matched.slice(0, 8).map(m => `
          <span class="skill-tag match"><i class="fa-solid fa-check"></i> ${capitalize(m)}</span>
        `).join('');
      }

      // Update missing skills tags
      const missingContainer = document.getElementById('missingSkillsTags');
      if (missingContainer && missing.length > 0) {
        missingContainer.innerHTML = missing.slice(0, 6).map(m => `
          <span class="skill-tag missing"><i class="fa-solid fa-plus"></i> ${capitalize(m)}</span>
        `).join('');
      }

      showToast(`Resume ATS match calculated: ${score}% match!`, 'success');
    });
  }
}

/**
 * 2. AI Interview Coach
 */
function initInterviewCoach() {
  const coachQuestions = {
    frontend: [
      {
        q: "Explain how React's Virtual DOM works and why it is more performant than direct DOM manipulation for freshers building UI?",
        model: "The Virtual DOM is an in-memory representation of the real DOM. When a component's state changes, React creates a new virtual DOM tree and compares it with the previous snapshot using its reconciliation (diffing) algorithm. Instead of repainting the entire document, React calculates the minimal number of mutations and batches them together. This drastically reduces expensive browser reflows and repaints."
      },
      {
        q: "What is event bubbling in JavaScript, and how do you stop it using event.stopPropagation()?",
        model: "Event bubbling is the phase in JavaScript where an event triggered on a deeply nested child element propagates upward through its parent hierarchy until it reaches the root document. You can stop this bubbling propagation by calling event.stopPropagation() inside the child event listener."
      }
    ],
    behavioral: [
      {
        q: "Tell me about a challenging bug or roadblock you encountered in your college semester project. How did you resolve it?",
        model: "In our final year capstone project, our React app suffered severe input latency when searching through 5,000 items. Using Chrome DevTools Performance Profiler, I discovered redundant re-renders. I implemented useMemo, debounced search keystrokes, and virtualized the list using react-window, slashing re-render latency from 420ms to under 16ms."
      },
      {
        q: "Describe a situation where you had a disagreement with a team member during a hackathon or group project. How did you handle it?",
        model: "During a 24-hour campus hackathon, my teammate and I disagreed on whether to use SQL or Firebase. Rather than arguing, I scheduled a 10-minute whiteboard session where we mapped out our immediate schema needs. We concluded Firebase enabled faster prototyping for the demo, and we successfully submitted the working MVP on time."
      }
    ],
    technical: [
      {
        q: "What is the difference between synchronous and asynchronous execution in JavaScript? How does the Event Loop manage them?",
        model: "JavaScript is single-threaded. Synchronous code executes line-by-line on the Call Stack. Asynchronous tasks (like fetch or setTimeout) are delegated to browser Web APIs. Once completed, their callbacks are pushed to the Task or Microtask Queue. The Event Loop monitors the Call Stack and, once empty, pushes the queued callbacks onto the stack for execution."
      }
    ]
  };

  const coachQuestionText = document.getElementById('coachQuestionText');
  const btnNextQuestion = document.getElementById('btnNextQuestion');
  const coachAnswerInput = document.getElementById('coachAnswerInput');
  const coachCharCount = document.getElementById('coachCharCount');
  const btnRecordMockup = document.getElementById('btnRecordMockup');
  const btnEvaluateAnswer = document.getElementById('btnEvaluateAnswer');
  const coachModelAnswer = document.getElementById('coachModelAnswer');
  const coachStrengthText = document.getElementById('coachStrengthText');
  const coachImprovementText = document.getElementById('coachImprovementText');

  let currentCategory = 'behavioral';
  let currentIndex = 0;

  function loadQuestion() {
    const list = coachQuestions[currentCategory] || coachQuestions.behavioral;
    const item = list[currentIndex % list.length];
    if (coachQuestionText) coachQuestionText.textContent = `"${item.q}"`;
    if (coachModelAnswer) coachModelAnswer.textContent = item.model;
  }

  if (btnNextQuestion) {
    btnNextQuestion.addEventListener('click', () => {
      currentIndex++;
      loadQuestion();
      if (coachAnswerInput) coachAnswerInput.value = '';
      if (coachCharCount) coachCharCount.textContent = '0 characters';
    });
  }

  if (coachAnswerInput && coachCharCount) {
    coachAnswerInput.addEventListener('input', () => {
      coachCharCount.textContent = `${coachAnswerInput.value.length} characters`;
    });
  }

  // Simulated Voice Dictation
  if (btnRecordMockup && coachAnswerInput) {
    btnRecordMockup.addEventListener('click', () => {
      const sampleSpoken = "In my 3rd year web dev project, our authentication system failed due to expired JWT tokens not refreshing silently. I researched the problem, implemented an Axios interceptor to catch 401 errors, and called the refresh endpoint to obtain a new token without logging users out. This made our application seamless for over 500 test users.";
      coachAnswerInput.value = sampleSpoken;
      coachCharCount.textContent = `${sampleSpoken.length} characters`;
      showToast('Simulated speech transcription loaded!', 'info');
    });
  }

  // Evaluate Answer
  if (btnEvaluateAnswer) {
    btnEvaluateAnswer.addEventListener('click', () => {
      const answer = (coachAnswerInput ? coachAnswerInput.value : '').trim();

      if (answer.length < 20) {
        showToast('Please type a more detailed answer to evaluate (at least 20 chars).', 'warning');
        return;
      }

      // Check STAR keywords
      const hasAction = /built|implemented|created|developed|fixed|debugged|used/i.test(answer);
      const hasMetric = /\d+|%|users|seconds|ms|improved/i.test(answer);

      const clarityScore = answer.length > 120 ? '92%' : '78%';
      const starScore = (hasAction && hasMetric) ? 'Strong STAR' : 'Partial STAR';
      const depthScore = answer.length > 200 ? 'High' : 'Moderate';

      const elClarity = document.getElementById('fbClarityScore');
      const elStar = document.getElementById('fbStarScore');
      const elDepth = document.getElementById('fbDepthScore');

      if (elClarity) elClarity.textContent = clarityScore;
      if (elStar) elStar.textContent = starScore;
      if (elDepth) elDepth.textContent = depthScore;

      if (coachStrengthText) {
        coachStrengthText.textContent = hasAction
          ? "Great use of strong action verbs! You articulated your individual technical contributions clearly."
          : "Good conceptual overview. Your communication is easy to follow.";
      }

      if (coachImprovementText) {
        coachImprovementText.textContent = hasMetric
          ? "Excellent inclusion of quantitative results! Practice speaking this at a natural, measured pace."
          : "Try adding a concrete number or metric (e.g., 'reduced load time by 30%', 'served 200 users') to prove impact.";
      }

      showToast('Answer evaluation complete! Check insights on the right.', 'success');
    });
  }
}

/**
 * 3. AI Cover Letter Generator
 */
function initCoverLetterGenerator() {
  const btnGenerate = document.getElementById('btnGenerateCoverLetter');
  const clCompany = document.getElementById('clCompanyName');
  const clRole = document.getElementById('clJobRole');
  const clTone = document.getElementById('clTone');
  const clDegree = document.getElementById('clStudentDegree');
  const clProject = document.getElementById('clTopProject');
  const output = document.getElementById('coverLetterOutput');
  const btnCopy = document.getElementById('btnCopyCoverLetter');
  const btnDownload = document.getElementById('btnDownloadCoverLetter');

  function generateLetter() {
    const company = clCompany.value.trim() || 'Your Company';
    const role = clRole.value.trim() || 'Software Engineer Intern';
    const degree = clDegree.value.trim() || 'B.Tech in Computer Science';
    const project = clProject.value.trim() || 'academic and personal full-stack software projects';
    const studentName = state.profile.name || 'Alex Johnson';
    const email = state.profile.email || 'alex.johnson@student.edu';

    let toneIntro = `I am writing to express my eager interest in the ${role} position at ${company}.`;
    if (clTone && clTone.value === 'enthusiastic') {
      toneIntro = `I was thrilled to come across the ${role} opening at ${company}! As an ambitious developer who closely follows ${company}'s innovations, I am excited to apply.`;
    } else if (clTone && clTone.value === 'startup') {
      toneIntro = `I am writing to apply for the ${role} role at ${company}. Having built scalable web projects from scratch, I thrive in high-ownership, fast-moving teams.`;
    }

    const template = `Dear Hiring Team at ${company},

${toneIntro}

Currently pursuing my ${degree} (Class of ${state.profile.gradYear}) at ${state.profile.university}, I have cultivated a strong foundation in Data Structures, modern web architecture, and clean coding standards. 

During my academic tenure, I focused heavily on hands-on software development. For example:
- ${project}
- Maintained strict Git version control and collaborated with peers using Agile development sprints.
- Continuously tested, debugged, and optimized application performance for optimal end-user experience.

What attracts me most to ${company} is your engineering culture and commitment to building world-class products. As a fresher, I bring not only relevant technical skills in JavaScript, React, and REST APIs, but also high learnability, curiosity, and dedication to contributing to your sprint goals from day one.

Thank you for your time and consideration. I would welcome the opportunity to discuss how my academic background and project experience align with ${company}'s vision.

Warm regards,

${studentName}
${degree} • ${state.profile.university}
Email: ${email}
GitHub: github.com/alex-dev | LinkedIn: linkedin.com/in/alex-cs`;

    if (output) output.value = template;
  }

  // Pre-generate once
  generateLetter();

  if (btnGenerate) {
    btnGenerate.addEventListener('click', () => {
      generateLetter();
      showToast('Cover letter generated and tailored to application!', 'success');
    });
  }

  if (btnCopy && output) {
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(output.value).then(() => {
        showToast('Cover letter copied to clipboard! 📋', 'success');
      }).catch(() => {
        output.select();
        document.execCommand('copy');
        showToast('Cover letter copied!', 'success');
      });
    });
  }

  if (btnDownload && output) {
    btnDownload.addEventListener('click', () => {
      const company = (clCompany.value.trim() || 'Company').replace(/\s+/g, '_');
      const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Cover_Letter_${company}_Alex_Johnson.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Cover letter downloaded as .txt file', 'info');
    });
  }
}

/**
 * 4. AI Skill Gap Analyzer
 */
function initSkillGapAnalyzer() {
  const container = document.getElementById('userSkillsTagContainer');
  const input = document.getElementById('skillNewInput');
  const btnAdd = document.getElementById('btnAddSkillTag');
  const btnRunAnalysis = document.getElementById('btnRunSkillAnalysis');
  const targetRoleSelect = document.getElementById('skillTargetRoleSelect');
  const roadmapContainer = document.getElementById('skillRoadmapTimeline');

  function renderSkillsTags() {
    if (!container) return;
    container.innerHTML = state.userSkills.map((sk, idx) => `
      <span class="skill-tag-editable">
        ${escapeHtml(sk)}
        <i class="fa-solid fa-xmark" onclick="removeSkillTag(${idx})" title="Remove skill"></i>
      </span>
    `).join('');
  }

  window.removeSkillTag = (index) => {
    state.userSkills.splice(index, 1);
    renderSkillsTags();
  };

  function addSkillFromInput() {
    if (!input) return;
    const val = input.value.trim();
    if (val && !state.userSkills.includes(val)) {
      state.userSkills.push(val);
      input.value = '';
      renderSkillsTags();
    }
  }

  if (btnAdd) btnAdd.addEventListener('click', addSkillFromInput);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSkillFromInput();
      }
    });
  }

  renderSkillsTags();

  // Role expectations benchmark
  const roleBenchmarks = {
    frontend: {
      required: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Git', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Unit Testing (Jest)'],
      roadmap: [
        { week: 1, title: 'TypeScript Fundamentals', desc: 'Interfaces, Generics, and typing React Props & State hooks.' },
        { week: 2, title: 'State Management & Performance', desc: 'Zustand or Redux Toolkit, useMemo, and lazy loading.' },
        { week: 3, title: 'Testing with Jest & React Testing Library', desc: 'Writing unit tests for user interactions and custom hooks.' },
        { week: 4, title: 'Deployment & Portfolio Polish', desc: 'Deploy 2 full-stack projects on Vercel with Lighthouse score > 90.' }
      ]
    },
    backend: {
      required: ['JavaScript', 'Node.js', 'Express', 'SQL', 'Git', 'PostgreSQL', 'Docker Basics', 'Redis', 'Authentication (JWT)'],
      roadmap: [
        { week: 1, title: 'PostgreSQL & Relational Schemas', desc: 'Mastering Joins, Aggregations, and Prisma / TypeORM.' },
        { week: 2, title: 'RESTful API Architecture & Validation', desc: 'Zod schema validation, error handling middleware, and JWT cookies.' },
        { week: 3, title: 'Caching & Background Jobs', desc: 'Redis caching and message queues for asynchronous tasks.' },
        { week: 4, title: 'Docker Containerization', desc: 'Creating Dockerfiles and docker-compose for multi-container apps.' }
      ]
    },
    fullstack: {
      required: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Node.js', 'SQL', 'Git', 'TypeScript', 'Docker Basics', 'MongoDB'],
      roadmap: [
        { week: 1, title: 'Full Stack TypeScript Monorepo', desc: 'End-to-end type safety between React frontend and Node backend.' },
        { week: 2, title: 'Database Optimization', desc: 'Indexing, connection pooling, and ACID transaction safety.' },
        { week: 3, title: 'CI/CD Pipelines with GitHub Actions', desc: 'Automated linting, tests, and cloud deployments on git push.' },
        { week: 4, title: 'System Design for Freshers', desc: 'Load balancing, rate limiting, and caching fundamentals.' }
      ]
    },
    data: {
      required: ['Python', 'SQL', 'Git', 'Pandas', 'NumPy', 'Tableau', 'Scikit-Learn', 'Statistics'],
      roadmap: [
        { week: 1, title: 'Advanced SQL for Analytics', desc: 'Window functions, CTEs, and cohort retention queries.' },
        { week: 2, title: 'Exploratory Data Analysis with Pandas', desc: 'Data cleaning, imputation, and feature engineering workflows.' },
        { week: 3, title: 'Interactive BI Dashboards', desc: 'Building Tableau / PowerBI dashboards with business KPIs.' },
        { week: 4, title: 'Applied Machine Learning', desc: 'Supervised classification models and ROC-AUC evaluation.' }
      ]
    },
    devops: {
      required: ['Linux', 'Git', 'Python', 'Docker Basics', 'Kubernetes Basics', 'AWS / Cloud', 'CI/CD Pipelines'],
      roadmap: [
        { week: 1, title: 'Linux System Administration & Bash', desc: 'Cron jobs, systemd services, SSH keys, and networking basics.' },
        { week: 2, title: 'Docker Container Best Practices', desc: 'Multi-stage builds and container security scanning.' },
        { week: 3, title: 'GitHub Actions CI/CD', desc: 'Automated test runners and container registry publishing.' },
        { week: 4, title: 'Cloud Infrastructure (AWS EC2 / S3)', desc: 'Deploying robust microservices with Nginx reverse proxies.' }
      ]
    }
  };

  function runSkillAnalysis() {
    const roleKey = (targetRoleSelect ? targetRoleSelect.value : 'frontend') || 'frontend';
    const benchmark = roleBenchmarks[roleKey] || roleBenchmarks.frontend;

    const userLower = state.userSkills.map(s => s.toLowerCase());
    const ready = [];
    const missing = [];

    benchmark.required.forEach(skill => {
      if (userLower.some(u => u.includes(skill.toLowerCase()) || skill.toLowerCase().includes(u))) {
        ready.push(skill);
      } else {
        missing.push(skill);
      }
    });

    const total = benchmark.required.length;
    const matchPercent = Math.min(100, Math.round((ready.length / total) * 100));

    // Update UI elements
    const matchLabel = document.getElementById('skillMatchLabel');
    const matchBar = document.getElementById('skillProgressBar');
    const matchBadge = document.getElementById('skillMatchPercentBadge');

    if (matchLabel) matchLabel.textContent = `${matchPercent}% Ready`;
    if (matchBar) matchBar.style.width = `${matchPercent}%`;
    if (matchBadge) matchBadge.textContent = `${matchPercent}% Match`;

    const readyList = document.getElementById('readySkillsList');
    if (readyList) {
      readyList.innerHTML = ready.map(s => `<span class="skill-tag match"><i class="fa-solid fa-check"></i> ${s}</span>`).join('') || '<span style="color:#94a3b8; font-size:0.8rem;">Add more skills to see matches</span>';
    }

    const gapList = document.getElementById('gapSkillsList');
    if (gapList) {
      gapList.innerHTML = missing.map(s => `<span class="skill-tag missing"><i class="fa-solid fa-plus"></i> ${s}</span>`).join('') || '<span style="color:#16a34a; font-size:0.8rem;">All required skills matched! Excellent work!</span>';
    }

    // Render Roadmap
    if (roadmapContainer) {
      roadmapContainer.innerHTML = benchmark.roadmap.map(item => `
        <div class="roadmap-week-item">
          <div class="week-badge">${item.week}</div>
          <div class="week-content">
            <h5>Week ${item.week}: ${item.title}</h5>
            <p>${item.desc}</p>
          </div>
        </div>
      `).join('');
    }

    showToast(`Skill gap analysis complete for ${capitalize(roleKey)} track!`, 'success');
  }

  if (btnRunAnalysis) {
    btnRunAnalysis.addEventListener('click', runSkillAnalysis);
  }
}

/* ============================================================================
   Toast Notification System
   ============================================================================ */
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: 'fa-solid fa-circle-check',
    warning: 'fa-solid fa-triangle-exclamation',
    error: 'fa-solid fa-circle-xmark',
    info: 'fa-solid fa-circle-info'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="toast-icon ${icons[type] || icons.info}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}

/* ============================================================================
   Helper Formatting Functions
   ============================================================================ */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return 'TBD / Not Scheduled';
  try {
    const d = new Date(dateTimeStr);
    if (isNaN(d.getTime())) return dateTimeStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateTimeStr;
  }
}

function getCountdownString(dateStr) {
  if (!dateStr) return 'Scheduled';
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  const diffHours = Math.round((target - now) / (1000 * 60 * 60));

  if (diffHours < 0) return 'Past Date';
  if (diffHours < 24) return `In ${diffHours}h`;
  const diffDays = Math.round(diffHours / 24);
  return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Applied': return 'status-applied';
    case 'Interview': return 'status-interview';
    case 'Selected': return 'status-selected';
    case 'Rejected': return 'status-rejected';
    case 'No Response': return 'status-no-response';
    default: return 'status-applied';
  }
}

function getStatusDotClass(status) {
  switch (status) {
    case 'Applied': return 'dot-applied';
    case 'Interview': return 'dot-interview';
    case 'Selected': return 'dot-selected';
    case 'Rejected': return 'dot-rejected';
    case 'No Response': return 'dot-no-response';
    default: return 'dot-applied';
  }
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
