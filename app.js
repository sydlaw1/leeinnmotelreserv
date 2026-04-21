/* ================================================
   Lee Inn & Suites — Motel Reservation System
   app.js
   ================================================ */

/* ─────────────────────────────────────────────
   1. ROOM DATA
   All 42 rooms across 2 floors
───────────────────────────────────────────── */
const FLOOR1 = [
  { n: 103, t: 'QQ' }, { n: 105, t: 'QQ' }, { n: 107, t: 'QQ' },
  { n: 111, t: 'K'  }, { n: 112, t: 'K'  }, { n: 114, t: 'K'  },
  { n: 115, t: 'QQ' }, { n: 116, t: 'Q'  }, { n: 117, t: 'K'  },
  { n: 118, t: 'K'  }, { n: 119, t: 'QQ' }, { n: 120, t: 'K'  },
  { n: 121, t: 'QQ' }, { n: 122, t: 'QQ' }, { n: 123, t: 'QQ' },
  { n: 124, t: 'Q'  }, { n: 125, t: 'Q'  }
];

const FLOOR2 = [
  { n: 201, t: 'Q'  }, { n: 202, t: 'QQ' }, { n: 203, t: 'QQ' },
  { n: 204, t: 'K'  }, { n: 205, t: 'QQ' }, { n: 206, t: 'K'  },
  { n: 207, t: 'QQ' }, { n: 208, t: 'K'  }, { n: 209, t: 'QQ' },
  { n: 210, t: 'K'  }, { n: 211, t: 'QQ' }, { n: 212, t: 'K'  },
  { n: 213, t: 'QQ' }, { n: 214, t: 'K'  }, { n: 215, t: 'QQ' },
  { n: 216, t: 'K'  }, { n: 217, t: 'QQ' }, { n: 218, t: 'K'  },
  { n: 219, t: 'QQ' }, { n: 220, t: 'K'  }, { n: 221, t: 'QQ' },
  { n: 222, t: 'Q'  }, { n: 223, t: 'QQ' }, { n: 224, t: 'Q'  }
];

const ALL_ROOMS = [...FLOOR1, ...FLOOR2];

/* ─────────────────────────────────────────────
   2. SEED DATA — 5 reservations pre-loaded
   Simulates what would come from SQL Server
───────────────────────────────────────────── */
let reservations = [
  {
    id: 'R1001', fn: 'John',   ln: 'Lee',
    room: 103, type: 'QQ',
    ci: '2025-06-01', co: '2025-06-03',
    addr: '100 Main St, Romulus, MI'
  },
  {
    id: 'R1002', fn: 'Sarah',  ln: 'Kim',
    room: 205, type: 'QQ',
    ci: '2025-06-05', co: '2025-06-07',
    addr: '42 Oak Ave, Detroit, MI'
  },
  {
    id: 'R1003', fn: 'Carlos', ln: 'Rivera',
    room: 111, type: 'K',
    ci: '2025-06-10', co: '2025-06-12',
    addr: '88 Pine Rd, Ann Arbor, MI'
  },
  {
    id: 'R1004', fn: 'Emily',  ln: 'Chen',
    room: 222, type: 'Q',
    ci: '2025-06-15', co: '2025-06-16',
    addr: '14 Elm St, Toledo, OH'
  },
  {
    id: 'R1005', fn: 'Mike',   ln: 'Johnson',
    room: 116, type: 'Q',
    ci: '2025-06-20', co: '2025-06-22',
    addr: '5 Maple Dr, Chicago, IL'
  }
];

/* ─────────────────────────────────────────────
   3. STATE VARIABLES
───────────────────────────────────────────── */
let selectedRoom = null;  // currently selected room object { n, t }
let latestId     = null;  // ID of the most recently added reservation
let nextNum      = 1006;  // auto-increment for new reservation IDs

/* ─────────────────────────────────────────────
   4. BUILD ROOM GRIDS
   Dynamically creates buttons for each room
───────────────────────────────────────────── */
function buildGrid(rooms, gridId) {
  const grid = document.getElementById(gridId);
  rooms.forEach(function(room) {
    const btn = document.createElement('button');
    btn.className = 'room-btn ' + room.t.toLowerCase(); // qq, k, or q class
    btn.id        = 'rb-' + room.n;
    btn.innerHTML =
      '<span class="room-num">'        + room.n + '</span>' +
      '<span class="room-type-label">' + room.t + '</span>';
    btn.onclick = function() { pickRoom(room); };
    grid.appendChild(btn);
  });
}

/* ─────────────────────────────────────────────
   5. ROOM SELECTION
───────────────────────────────────────────── */
function pickRoom(room) {
  // Deselect all buttons
  document.querySelectorAll('.room-btn').forEach(function(b) {
    b.classList.remove('selected');
  });
  // Select the clicked button
  document.getElementById('rb-' + room.n).classList.add('selected');
  selectedRoom = room;
  document.getElementById('err-room').style.display = 'none';
}

/* ─────────────────────────────────────────────
   6. STEPPER — update progress indicator
───────────────────────────────────────────── */
function updateStepper(step) {
  for (var i = 1; i <= 4; i++) {
    var circle = document.getElementById('sc' + i);
    if (i < step) {
      circle.className = 'step-circle done';
    } else if (i === step) {
      circle.className = 'step-circle active';
    } else {
      circle.className = 'step-circle idle';
    }
  }
  for (var j = 1; j <= 3; j++) {
    var line = document.getElementById('sl' + j);
    line.className = j < step ? 'step-line done-line' : 'step-line';
  }
}

/* ─────────────────────────────────────────────
   7. DATE HELPERS
───────────────────────────────────────────── */
// Format YYYY-MM-DD → MM/DD/YYYY for display
function fmtDate(d) {
  if (!d) return '—';
  var parts = d.split('-');
  return parts[1] + '/' + parts[2] + '/' + parts[0];
}

// Returns today's date as YYYY-MM-DD
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// Returns tomorrow's date as YYYY-MM-DD
function tomorrowStr() {
  var d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

// Calculate number of nights between two date strings
function calcNights(ci, co) {
  return Math.round((new Date(co) - new Date(ci)) / 86400000);
}

/* ─────────────────────────────────────────────
   8. ROOM TYPE HELPERS
───────────────────────────────────────────── */
function typeLabel(t) {
  if (t === 'QQ') return 'QQ — Two Queen Beds';
  if (t === 'K')  return 'K — King Bed';
  return 'Q — Queen Bed';
}

function typePill(t) {
  var cls = t === 'QQ' ? 'pill-qq' : t === 'K' ? 'pill-k' : 'pill-q';
  return '<span class="type-pill ' + cls + '">' + t + '</span>';
}

/* ─────────────────────────────────────────────
   9. SCREEN NAVIGATION — goTo(screenNumber)
   Validates data before advancing
───────────────────────────────────────────── */
function goTo(n) {

  /* ── Validate Screen 1 → 2 ── */
  if (n === 2) {
    if (!selectedRoom) {
      document.getElementById('err-room').style.display = 'block';
      return;
    }
    // Populate banners on screens 2 and 3
    var summary = 'Room <strong>' + selectedRoom.n + '</strong> &nbsp;|&nbsp; ' + typeLabel(selectedRoom.t);
    document.getElementById('banner2').innerHTML = summary;
    document.getElementById('banner3').innerHTML = summary;

    // Pre-fill today/tomorrow if dates not yet set
    if (!document.getElementById('checkin').value)  {
      document.getElementById('checkin').value  = todayStr();
    }
    if (!document.getElementById('checkout').value) {
      document.getElementById('checkout').value = tomorrowStr();
    }
  }

  /* ── Validate Screen 2 → 3 ── */
  if (n === 3) {
    var ci = document.getElementById('checkin').value;
    var co = document.getElementById('checkout').value;
    var valid = true;

    if (!ci) {
      document.getElementById('err-ci').style.display = 'block';
      valid = false;
    } else {
      document.getElementById('err-ci').style.display = 'none';
    }

    if (!co || co <= ci) {
      document.getElementById('err-co').style.display = 'block';
      valid = false;
    } else {
      document.getElementById('err-co').style.display = 'none';
    }

    if (!valid) return;
  }

  /* ── Validate Screen 3 → 4 ── */
  if (n === 4) {
    var fn = document.getElementById('fname').value.trim();
    var ln = document.getElementById('lname').value.trim();

    document.getElementById('err-fn').style.display = fn ? 'none' : 'block';
    document.getElementById('err-ln').style.display = ln ? 'none' : 'block';
    if (!fn || !ln) return;

    var ci2  = document.getElementById('checkin').value;
    var co2  = document.getElementById('checkout').value;
    var addr = [
      document.getElementById('address').value.trim(),
      document.getElementById('city').value.trim(),
      document.getElementById('state').value
    ].filter(Boolean).join(', ');

    // Create new reservation record
    var newId = 'R' + nextNum++;
    var record = {
      id:   newId,
      fn:   fn,
      ln:   ln,
      room: selectedRoom.n,
      type: selectedRoom.t,
      ci:   ci2,
      co:   co2,
      addr: addr
    };

    // Add to in-memory array (replace with fetch() POST to save to SQL Server)
    reservations.push(record);
    latestId = newId;

    // Populate confirmation card
    document.getElementById('conf-name').textContent   = fn + ' ' + ln;
    document.getElementById('conf-id').textContent     = newId;
    document.getElementById('conf-room').textContent   = selectedRoom.n;
    document.getElementById('conf-type').textContent   = typeLabel(selectedRoom.t);
    document.getElementById('conf-ci').textContent     = fmtDate(ci2);
    document.getElementById('conf-co').textContent     = fmtDate(co2);
    document.getElementById('conf-nights').textContent = calcNights(ci2, co2) + ' night(s)';
    document.getElementById('conf-addr').textContent   = addr || '—';

    // Re-render database tables to show new entry
    renderAll();
  }

  /* ── Switch visible screen ── */
  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
  });
  document.getElementById('screen' + n).classList.add('active');
  updateStepper(n);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─────────────────────────────────────────────
   10. NEW RESERVATION — reset entire form
───────────────────────────────────────────── */
function newRes() {
  selectedRoom = null;
  latestId     = null;

  // Clear all room selections
  document.querySelectorAll('.room-btn').forEach(function(b) {
    b.classList.remove('selected');
  });

  // Clear all form fields
  ['checkin', 'checkout', 'fname', 'lname', 'address', 'city'].forEach(function(id) {
    document.getElementById(id).value = '';
  });
  document.getElementById('state').value = '';

  goTo(1);
}

/* ─────────────────────────────────────────────
   11. TAB SWITCHING — DB viewer tabs
───────────────────────────────────────────── */
function switchTab(panelId, btn) {
  document.querySelectorAll('.tab-panel').forEach(function(p) {
    p.classList.remove('active');
  });
  document.querySelectorAll('.tab').forEach(function(t) {
    t.classList.remove('active');
  });
  document.getElementById(panelId).classList.add('active');
  btn.classList.add('active');
}

/* ─────────────────────────────────────────────
   12. RENDER DATABASE TABLES
   Applies current search filter and sort order
───────────────────────────────────────────── */
function renderAll() {
  var q    = (document.getElementById('q-search').value || '').toLowerCase();
  var sort = document.getElementById('q-sort').value;

  /* Filter reservations */
  var rows = reservations.filter(function(r) {
    if (!q) return true;
    return (r.fn + ' ' + r.ln).toLowerCase().indexOf(q) !== -1 ||
           String(r.room).indexOf(q) !== -1;
  });

  /* Sort reservations */
  rows.sort(function(a, b) {
    if (sort === 'name') {
      return a.ln.localeCompare(b.ln) || a.fn.localeCompare(b.fn);
    }
    if (sort === 'room') return a.room - b.room;
    if (sort === 'ci')   return a.ci.localeCompare(b.ci);
    return a.id.localeCompare(b.id); // default: Conf #
  });

  /* ── Reservations table ── */
  var rt = document.getElementById('tbl-res');
  rt.innerHTML =
    '<tr>' +
      '<th>Conf #</th><th>Last Name</th><th>First Name</th>' +
      '<th>Room #</th><th>Type</th><th>Check-in</th><th>Check-out</th><th>Nights</th>' +
    '</tr>';

  rows.forEach(function(r) {
    var tr = document.createElement('tr');
    if (r.id === latestId) tr.className = 'new-row';
    tr.innerHTML =
      '<td class="conf-id">' + r.id + '</td>' +
      '<td>' + r.ln + '</td>' +
      '<td>' + r.fn + '</td>' +
      '<td><strong>' + r.room + '</strong></td>' +
      '<td>' + typePill(r.type) + '</td>' +
      '<td>' + fmtDate(r.ci) + '</td>' +
      '<td>' + fmtDate(r.co) + '</td>' +
      '<td>' + calcNights(r.ci, r.co) + '</td>';
    rt.appendChild(tr);
  });

  /* ── Guests table ── */
  var gt = document.getElementById('tbl-guests');
  gt.innerHTML =
    '<tr>' +
      '<th>GuestID</th><th>Last Name</th><th>First Name</th>' +
      '<th>Address</th><th>City / State</th>' +
    '</tr>';

  reservations.forEach(function(r, i) {
    var parts = r.addr ? r.addr.split(',') : [];
    var city  = parts.length >= 2 ? parts.slice(-2).join(',').trim() : (r.addr || '—');
    var addr  = parts.length >= 2 ? parts.slice(0, -2).join(',').trim() : '—';
    var tr = document.createElement('tr');
    if (r.id === latestId) tr.className = 'new-row';
    tr.innerHTML =
      '<td>' + (i + 1) + '</td>' +
      '<td>' + r.ln   + '</td>' +
      '<td>' + r.fn   + '</td>' +
      '<td>' + addr   + '</td>' +
      '<td>' + city   + '</td>';
    gt.appendChild(tr);
  });

  /* ── Rooms table ── */
  var rmt = document.getElementById('tbl-rooms');
  rmt.innerHTML =
    '<tr>' +
      '<th>Room #</th><th>Floor</th><th>Type</th><th>Description</th>' +
    '</tr>';

  ALL_ROOMS.forEach(function(rm) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><strong>' + rm.n + '</strong></td>' +
      '<td>' + (rm.n < 200 ? 1 : 2) + '</td>' +
      '<td>' + typePill(rm.t) + '</td>' +
      '<td>' + (rm.t === 'QQ' ? 'Two Queen Beds' : rm.t === 'K' ? 'King Bed' : 'Queen Bed') + '</td>';
    rmt.appendChild(tr);
  });
}

/* ─────────────────────────────────────────────
   13. INITIALIZATION — runs on page load
───────────────────────────────────────────── */
buildGrid(FLOOR1, 'grid-floor1');
buildGrid(FLOOR2, 'grid-floor2');
renderAll();
