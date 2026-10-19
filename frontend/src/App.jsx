
import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api/leads';
const LOGIN_URL = 'http://localhost:5000/api/auth/login';

const emptyLead = {
  name: '',
  email: '',
  company: '',
  notes: '',
  followUpDate: '',
};

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(
  () => localStorage.getItem("token")
);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [newLead, setNewLead] = useState(emptyLead);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Every protected API request includes the login token.
  function authHeaders(extraHeaders = {}) {
    return {
      ...extraHeaders,
      Authorization: `Bearer ${token}`,
    };
  }

  // Log in through the backend.
  async function handleLogin(event) {
    event.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      if (!data.token) {
        throw new Error('The server did not return a login token.');
      }

      localStorage.setItem("token", data.token);
setToken(data.token);
      setLoginPassword('');
    } catch (error) {
      setLoginError(
        error.message ||
          'Could not connect to the server. Check that the backend is running.'
      );
    } finally {
      setLoggingIn(false);
    }
  }

  // Load leads only after a successful login.
  async function fetchLeads() {
    try {
      setLoading(true);
      setApiError('');

      const response = await fetch(API_URL, {
        headers: authHeaders(),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        setToken('');
        setLeads([]);
        setApiError('Your session has expired. Please log in again.');
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Could not load leads.');
      }

      setLeads(data);
    } catch (error) {
      console.error('Error loading leads:', error);
      setApiError(error.message || 'Could not connect to the backend.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchLeads();
    } else {
      setLeads([]);
      setLoading(false);
    }
  }, [token]);

  // Log out and discard the in-memory token.
  function handleLogout() {
    setToken('');
    setLeads([]);
    setSearch('');
    setStatusFilter('All');
    setShowForm(false);
    setEditingLeadId(null);
    setNewLead({ ...emptyLead });
    setApiError('');
    setSuccessMessage('');
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
  }

  // Search and filter leads.
  const filteredLeads = leads.filter((lead) => {
    const searchText = [
      lead.name,
      lead.email,
      lead.company || '',
      lead.notes || '',
    ]
      .join(' ')
      .toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Add a new lead or update an existing lead.
  async function addLead(event) {
    event.preventDefault();

    const leadDetails = {
      name: newLead.name.trim(),
      email: newLead.email.trim().toLowerCase(),
      company: newLead.company.trim(),
      notes: newLead.notes.trim(),
      followUpDate: newLead.followUpDate || null,
    };

    if (!leadDetails.name || !leadDetails.email) {
      setApiError('Please enter the lead name and email address.');
      return;
    }

    const duplicateEmail = leads.some(
      (lead) =>
        lead.email.toLowerCase() === leadDetails.email &&
        lead._id !== editingLeadId
    );

    if (duplicateEmail) {
      setApiError('A lead with this email address already exists.');
      return;
    }

    setSaving(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const isEditing = editingLeadId !== null;
      const url = isEditing
        ? `${API_URL}/${editingLeadId}`
        : API_URL;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: authHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(leadDetails),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        throw new Error('Your session expired. Please log in again.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Could not save the lead.');
      }

      if (isEditing) {
        setLeads((previous) =>
          previous.map((lead) =>
            lead._id === editingLeadId ? data : lead
          )
        );
        setSuccessMessage('Lead updated successfully!');
      } else {
        setLeads((previous) => [data, ...previous]);
        setSuccessMessage('Lead added successfully!');
      }

      setNewLead({ ...emptyLead });
      setEditingLeadId(null);
      setShowForm(false);
    } catch (error) {
      setApiError(error.message || 'Could not save the lead.');
    } finally {
      setSaving(false);
    }
  }

  // Open the form with the selected lead's details.
  function startEditing(lead) {
    setEditingLeadId(lead._id);

    setNewLead({
      name: lead.name || '',
      email: lead.email || '',
      company: lead.company || '',
      notes: lead.notes || '',
      followUpDate: lead.followUpDate
        ? new Date(lead.followUpDate).toISOString().slice(0, 10)
        : '',
    });

    setApiError('');
    setSuccessMessage('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update a lead's status.
  async function updateStatus(id, status) {
    setApiError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: authHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        throw new Error('Your session expired. Please log in again.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Could not update status.');
      }

      setLeads((previous) =>
        previous.map((lead) => (lead._id === id ? data : lead))
      );
      setSuccessMessage('Lead status updated successfully!');
    } catch (error) {
      setApiError(error.message || 'Could not update status.');
    }
  }

  // Delete a lead.
  async function deleteLead(id) {
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    setApiError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        throw new Error('Your session expired. Please log in again.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Could not delete the lead.');
      }

      setLeads((previous) =>
        previous.filter((lead) => lead._id !== id)
      );

      if (editingLeadId === id) {
        cancelForm();
      }

      setSuccessMessage('Lead deleted successfully!');
    } catch (error) {
      setApiError(error.message || 'Could not delete the lead.');
    }
  }

  function cancelForm() {
    setShowForm(false);
    setEditingLeadId(null);
    setNewLead({ ...emptyLead });
    setApiError('');
  }

  function openNewLeadForm() {
    setEditingLeadId(null);
    setNewLead({ ...emptyLead });
    setApiError('');
    setSuccessMessage('');
    setShowForm(true);
  }

  const newCount = leads.filter(
    (lead) => lead.status === 'New'
  ).length;

  const contactedCount = leads.filter(
    (lead) => lead.status === 'Contacted'
  ).length;

  const qualifiedCount = leads.filter(
    (lead) => lead.status === 'Qualified'
  ).length;

  // Show login before rendering the dashboard.
  if (!token) {
    return (
      <main className="login-page">
        <section className="login-card">
          <div className="brand login-brand">
            <div className="brand-icon">L</div>
            <span>LeadFlow</span>
          </div>

          <p className="eyebrow">ADMINISTRATOR ACCESS</p>
          <h1>Welcome back</h1>
          <p className="login-description">
            Sign in to manage your leads and opportunities.
          </p>

          {loginError && (
            <div className="login-error" role="alert">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <label>
              Admin email
              <input
                type="email"
                autoComplete="username"
                required
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                placeholder="Enter your admin email"
              />
            </label>

            
<div className="password-input-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    id="login-password"
    value={loginPassword}
    onChange={(e) => setLoginPassword(e.target.value)}
    placeholder="Enter your password"
    required
  />

  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword((previous) => !previous)}
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? "👁" : "👁️"}
  </button>
</div>


            <button
              className="primary-button login-button"
              type="submit"
              disabled={loggingIn}
            >
              {loggingIn ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="login-footer">LeadFlow CRM · Admin portal</p>
        </section>
      </main>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">L</div>
          <span>LeadFlow</span>
        </div>

        <p className="menu-label">WORKSPACE</p>

        <nav>
          <a className="nav-item active" href="#dashboard">
            <span>▦</span> Dashboard
          </a>
          <a className="nav-item" href="#leads">
            <span>♙</span> Leads
          </a>
          <a className="nav-item" href="#overview">
            <span>◷</span> Overview
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-avatar">AD</div>
          <div className="profile-info">
            <strong>Administrator</strong>
            <small>Signed in</small>
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">WORKSPACE / OVERVIEW</p>
            <h1>Lead Dashboard</h1>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              showForm ? cancelForm() : openNewLeadForm()
            }
          >
            {showForm ? '✕ Cancel' : '+ Add new lead'}
          </button>
        </header>

        <section className="welcome-banner">
          <div>
            <p className="banner-label">YOUR BUSINESS AT A GLANCE</p>
            <h2>Build better relationships.</h2>
            <p>
              Track prospects, manage conversations, and turn opportunities
              into customers.
            </p>
          </div>
          <div className="banner-decoration">↗</div>
        </section>

        {apiError && (
          <div className="notice-error" role="alert">
            {apiError}
          </div>
        )}

        {successMessage && (
          <div className="notice-success" role="status">
            {successMessage}
          </div>
        )}

        <section className="stats-grid" id="overview">
          <article className="stat-card">
            <div className="stat-top">
              <span>Total leads</span>
              <span className="stat-icon purple">♙</span>
            </div>
            <strong className="stat-number">{leads.length}</strong>
            <p className="stat-foot">All prospects in your workspace</p>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>New leads</span>
              <span className="stat-icon blue">✦</span>
            </div>
            <strong className="stat-number">{newCount}</strong>
            <p className="stat-foot">Waiting for first contact</p>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>Contacted</span>
              <span className="stat-icon orange">↗</span>
            </div>
            <strong className="stat-number">{contactedCount}</strong>
            <p className="stat-foot">Conversations started</p>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>Qualified</span>
              <span className="stat-icon green">✓</span>
            </div>
            <strong className="stat-number">{qualifiedCount}</strong>
            <p className="stat-foot">Potential opportunities</p>
          </article>
        </section>

        {showForm && (
          <section className="form-card">
            <div className="section-heading">
              <div>
                <h2>
                  {editingLeadId !== null ? 'Edit lead' : 'Add a new lead'}
                </h2>
                <p>Enter the prospect's details below.</p>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={cancelForm}
                aria-label="Close form"
              >
                ✕
              </button>
            </div>

            <form onSubmit={addLead}>
              <div className="form-grid">
                <label>
                  Full name
                  <input
                    required
                    value={newLead.name}
                    onChange={(event) =>
                      setNewLead({ ...newLead, name: event.target.value })
                    }
                    placeholder="e.g. Alex Morgan"
                  />
                </label>

                <label>
                  Email address
                  <input
                    required
                    type="email"
                    value={newLead.email}
                    onChange={(event) =>
                      setNewLead({ ...newLead, email: event.target.value })
                    }
                    placeholder="alex@company.com"
                  />
                </label>

                <label>
                  Company
                  <input
                    value={newLead.company}
                    onChange={(event) =>
                      setNewLead({ ...newLead, company: event.target.value })
                    }
                    placeholder="Company name"
                  />
                </label>

                <label>
                  Follow-up date
                  <input
                    type="date"
                    value={newLead.followUpDate}
                    onChange={(event) =>
                      setNewLead({
                        ...newLead,
                        followUpDate: event.target.value,
                      })
                    }
                  />
                </label>

                <label className="notes-field">
                  Notes
                  <textarea
                    rows="3"
                    value={newLead.notes}
                    onChange={(event) =>
                      setNewLead({ ...newLead, notes: event.target.value })
                    }
                    placeholder="Add notes about this prospect..."
                  />
                </label>
              </div>

              <button
                className="primary-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : editingLeadId !== null
                    ? 'Update lead'
                    : 'Save lead'}
              </button>
            </form>
          </section>
        )}

        <section className="leads-section" id="leads">
          <div className="section-heading">
            <div>
              <h2>Recent leads</h2>
              <p>Manage your prospects and track their progress.</p>
            </div>
            <span className="lead-count">{leads.length} leads</span>
          </div>

          <div className="table-toolbar">
            <input
              className="search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="⌕  Search leads..."
              aria-label="Search leads"
            />

            <select
              className="status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter leads by status"
            >
              <option value="All">All statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>CONTACT</th>
                  <th>COMPANY</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      Loading leads from MongoDB...
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead._id}>
                      <td>
                        <div className="contact-cell">
                          <div className="contact-avatar">
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{lead.name}</strong>
                            <small>{lead.email}</small>
                            {lead.followUpDate && (
                              <small>
                                Follow-up:{' '}
                                {new Date(
                                  lead.followUpDate
                                ).toLocaleDateString()}
                              </small>
                            )}
                            {lead.notes && (
                              <small title={lead.notes}>
                                Notes: {lead.notes}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>{lead.company || '—'}</td>

                      <td>
                        <span
                          className={`status status-${(
                            lead.status || 'New'
                          ).toLowerCase()}`}
                        >
                          {lead.status || 'New'}
                        </span>
                      </td>

                      <td>
                        <div className="action-cell">
                          <select
                            aria-label={`Update status for ${lead.name}`}
                            value={lead.status || 'New'}
                            onChange={(event) =>
                              updateStatus(lead._id, event.target.value)
                            }
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Lost">Lost</option>
                          </select>

                          <button
                            type="button"
                            className="edit-button"
                            onClick={() => startEditing(lead)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() => deleteLead(lead._id)}
                            aria-label={`Delete ${lead.name}`}
                            title="Delete lead"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}

                {!loading && filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      {search || statusFilter !== 'All'
                        ? 'No leads match your search or filter.'
                        : 'No leads yet. Click "+ Add new lead" to get started.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer>
          <span>LeadFlow CRM</span>
          <span>Built by Ayesha Siddiqa · Future Interns Task 2</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
