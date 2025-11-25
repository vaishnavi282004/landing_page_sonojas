const courseSpecializations = {
  BA: ["General", "Economics", "History", "English Literature", "Hindi Literature", "Psychology", "Political Science", "Public Administration", "Geography", "Sociology"],
  BBA: ["General", "Business Analytics", "Finance & Marketing", "T & System Management", "International Business Management", "Human Resource Management", "Marketing Management"],
  BCA: ["General"],
  BJMC: ["Journalism & Mass Communication"],
  BCom: ["General"],
  MA: ["English", "Political Science", "Journalism & Mass Communication", "Education", "Public Administration", "Economics", "History", "Sociology"],
  MCom: ["General"],
  MCA: ["General", "Information Technology", "TCCON", "PG"],
  MBA: [
    "General",
    "Business Analytics",
    "Finance",
    "Marketing",
    "Human Resource Management (HRM)",
    "Operations Management",
    "Digital Marketing",
    "Financial Management",
    "International Business",
    "Operation & Production Management",
    "Strategic Management",
    "Entrepreneurship",
    "Supply Chain Management",
    "Applied Finance",
    "Business Management",
    "Leadership & Strategy",
    "Operation & Data Science",
    "Logistics, Material and Supply Chain Management",
    "Project Management",
    "Hospital Administration and Health Care Management",
    "Fintech Management",
    "Artificial Intelligence & Machine Learning",
    "Block Chain Management",
    "Agri Business Management",
    "Global Finance Market",
    "Hospitality Management",
    "Petroleum & Natural Gas Management",
    "IRP"
  ],
  BLIS: ["General"],
  DCA: ["General"],
  PGDCA: ["General"],
  PGDJMC: ["Journalism & Mass Communication"],
  PGDBM: ["Business Management"],
  CERTIFICATE: ["Cyber Security", "RFP"],
  PG: ["PG"]
};

document.addEventListener('DOMContentLoaded', () => {
  /* ---- DATA (uniData) yahi rakho – agar tumhare file me already hai to wahi use karo ---- */
  const uniData = {
    'Uttaranchal University': {
      BA:  ['General'],
      BBA: ['General'],
      BCA: ['General'],
      MBA: [
        'Marketing Management',
        'Digital Marketing',
        'Human Resource',
        'Business Analytics',
        'Financial Management',
        'International Business',
        'Information Technology'
      ],
      MCA: ['General']
    },
    'NMIMS University': {
      BBA: ['Business Analysis', 'Finance & Marketing'],
      MBA: [
        'General',
        'Business Management',
        'Finance',
        'HR (Human Resources)',
        'Marketing',
        'Operation & Data Science'
      ],
      'MBA (WX)': [
        'Marketing',
        'Leadership & Strategy',
        'Operation & Supply Chain',
        'Applied Finance',
        'Digital Marketing'
      ]
    },
    'Amity University': {
      BBA: ['General'],
      BCA: ['General'],
      BA:  ['General'],
      BCom: ['Vernac'],
      MA:  ['Vernac', 'YOGA'],
      MCA: ['General', 'FCCN', 'PFG'],
      MBA: [
        'Finance and Marketing',
        'General',
        'Marketing and Sales Management',
        'Entrepreneurship and Leadership Management',
        'Financial Management',
        'Human Resource Management',
        'Information Technology Management',
        'Operations Management',
        'Data Science',
        'International Business',
        'Retail Management',
        'Global Finance Market',
        'Hospitality Management',
        'Insurance Management',
        'Construction'
      ],
      MCom: ['Professional & Natural Gas Management']
    },
    'D.Y. Patil University': {
      BBA: [
        'Human Resource Management',
        'Finance Management',
        'IT & System Management',
        'International Business Management'
      ],
      MBA: [
        'Marketing Management',
        'Human Resource Management',
        'Finance Management',
        'IT Management',
        'Project Management',
        'Operations Management',
        'Hospital Administration and Health Care Management',
        'International Business Management',
        'Fintech Management',
        'Business Analytics',
        'Artificial Intelligence & Machine Learning',
        'Logistics, Material and Supply Chain Management',
        'Block Chain Management',
        'Digital Marketing Management',
        'Agri Business Management'
      ]
    },
    'Mangalayatan University': {
      BA:  ['Bachelor of Arts'],
      BBA: ['Bachelor of Business Administration'],
      BCA: ['Bachelor of Computer Application'],
      DCA: ['Diploma in Computer Application'],
      MA: [
        'English',
        'Political Science',
        'Journalism and Mass Communication',
        'Education',
        'Public Administration',
        'YOGA'
      ],
      MSc: ['Mathematics'],
      MCom: ['Master of Commerce'],
      MBA: [
        'Human Resource Management',
        'Marketing Management',
        'Operations Management',
        'Finance Management'
      ],
      MCA: ['Master of Computer Application']
    },
    'Suresh Gyan Vihar University': {
      BA:  ['General (select any 3 subjects)'],
      BCom:['General'],
      BBA: ['General'],
      BCA: ['General'],
      BJMC:['General'],
      BLIS:['General'],
      MA:  ['Economics', 'Mathematics'],
      MCom:['General'],
      MSc: ['Mathematics'],
      MBA: [
        'Marketing',
        'Finance',
        'Human Resource Management (HRM)',
        'Operation & Production Management',
        'Strategic Management',
        'Entrepreneurship',
        'Supply Chain Management',
        'International Business',
        'Branding & Advertising',
        'Foreign Trade / Global Business Management',
        'Project Leadership & Management'
      ]
    }
  };

  /* ---- ELEMENTS ---- */
  const form      = document.getElementById('inquireForm');
  const successEl = document.getElementById('success');
  const courseSel = document.getElementById('course');
  const specSel   = document.getElementById('specialization');
  const uniSel    = document.getElementById('university');
  const qualSel   = document.getElementById('qualification');

  /* ---- HELPERS ---- */
  function resetSelect(el, label){
    if (!el) return;
    el.innerHTML = '';
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = label;
    el.appendChild(opt);
  }
  function fillSelect(el, list){
    list.forEach(v => {
      const o = document.createElement('option');
      o.value = o.textContent = v;
      el.appendChild(o);
    });
  }

  /* initial state for spec + uni */
  if (specSel){
    resetSelect(specSel, 'All');   // default All
    specSel.disabled = true;
  }
  if (uniSel){
    resetSelect(uniSel, 'Select university');
    uniSel.disabled = true;
  }

  /* ---- COURSE CHANGE: enable BOTH spec + university ---- */
  courseSel?.addEventListener('change', () => {
    const course = courseSel.value;

    resetSelect(specSel, 'All');
    specSel.disabled = false;           // course choose होते ही enable

    resetSelect(uniSel, 'Select university');
    uniSel.disabled = false;           // course choose होते ही enable

    if (!course) {
      // no course ⇒ disable dono
      specSel.disabled = true;
      uniSel.disabled = true;
      return;
    }

    // 1) specialization list (union across universities)
    const specSet = new Set();
    Object.values(uniData).forEach(cObj => {
      if (cObj[course]) cObj[course].forEach(s => specSet.add(s));
    });
    if (specSet.size){
      fillSelect(specSel, [...specSet]);
    }

    // 2) universities jo ye course dete hain
    const uniList = Object.entries(uniData)
      .filter(([u, cObj]) => cObj[course])
      .map(([u]) => u);
    if (uniList.length){
      fillSelect(uniSel, uniList);
    } else {
      uniSel.disabled = true;
    }
  });

  /* ---- SPEC CHANGE: agar All nahi hai to universities aur filter ---- */
  specSel?.addEventListener('change', () => {
    const course = courseSel.value;
    const spec   = specSel.value;   // ""  => All

    if (!course){
      resetSelect(uniSel, 'Select university');
      uniSel.disabled = true;
      return;
    }

    resetSelect(uniSel, 'Select university');

    const uniList = Object.entries(uniData)
      .filter(([u, cObj]) => {
        if (!cObj[course]) return false;
        if (!spec) return true;            // All: sirf course check
        return cObj[course].includes(spec);
      })
      .map(([u]) => u);

    if (uniList.length){
      fillSelect(uniSel, uniList);
      uniSel.disabled = false;
    } else {
      uniSel.disabled = true;
    }
  });

  /* ---- SUBMIT: WhatsApp + backend ---- */
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const fd  = new FormData(form);
    const name  = (fd.get('name')  || '').toString().trim();
    const phone = (fd.get('phone') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const qualification = qualSel ? (qualSel.value || '') : '';
    const course = courseSel?.value || '';
    const uni    = uniSel?.value    || '';
    const spec   = specSel?.value ? specSel.value : 'All';  // default All

    const waMsg =
      `New Inquiry from Sonojas Landing Page:\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Qualification: ${qualification}\n` +
      `Course: ${course}\n` +
      `University: ${uni}\n` +
      `Specialization: ${spec}`;

    const waUrl = `https://wa.me/917248855566?text=${encodeURIComponent(waMsg)}`;
    window.open(waUrl, '_blank');

    try {
      await fetch('http://localhost:3000/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          qualification,
          course,
          university: uni,
          specialization: spec
        })
      });
    } catch (err) {
      console.error('Error saving inquiry', err);
    }

    if (successEl){
      successEl.hidden = false;
      successEl.textContent = 'Thanks, our team will connect with you shortly.';
      setTimeout(() => successEl.hidden = true, 6000);
    }

    form.reset();
    // reset dropdowns state
    resetSelect(specSel, 'All');
    specSel.disabled = true;
    resetSelect(uniSel, 'Select university');
    uniSel.disabled = true;
  });
});