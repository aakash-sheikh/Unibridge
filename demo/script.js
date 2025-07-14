// Global variables
let currentUser = null;
let currentUserType = null;

// Utility functions
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, duration);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateIUBId(id) {
    const re = /^\d{9}$/;
    return re.test(id);
}

function validatePhone(phone) {
    const re = /^(\+88)?01[3-9]\d{8}$/;
    return re.test(phone);
}

// Authentication functions
function showLogin() {
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('registerTab').classList.remove('active');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

function showRegister() {
    document.getElementById('registerTab').classList.add('active');
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
}

function toggleRegisterFields() {
    const userType = document.getElementById('registerUserType').value;

    // Hide all fields first
    document.getElementById('studentRegFields').classList.add('hidden');
    document.getElementById('alumniRegFields').classList.add('hidden');
    document.getElementById('orgRegFields').classList.add('hidden');

    // Show relevant fields
    if (userType === 'student') {
        document.getElementById('studentRegFields').classList.remove('hidden');
    } else if (userType === 'alumni') {
        document.getElementById('alumniRegFields').classList.remove('hidden');
    } else if (userType === 'organization') {
        document.getElementById('orgRegFields').classList.remove('hidden');
    }
}

function login(event) {
    event.preventDefault();

    const userType = document.getElementById('loginUserType').value;
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    // Simulate login validation
    if (simulateLogin(userType, email, password)) {
        currentUser = email;
        currentUserType = userType;

        showNotification(`Welcome ${userType}!`, 'success');

        // Redirect to appropriate portal
        setTimeout(() => {
            redirectToPortal(userType);
        }, 1000);
    } else {
        showNotification('Invalid credentials', 'error');
    }
}

function simulateLogin(userType, email, password) {
    // In a real application, this would make an API call
    return true;
}

function redirectToPortal(userType) {
    const portals = {
        'student': 'student.html',
        'alumni': 'alumni.html',
        'organization': 'organization.html',
        'admin': 'admin.html',
        'sod': 'sod.html'
    };

    if (portals[userType]) {
        window.location.href = portals[userType];
    }
}

function register(event) {
    event.preventDefault();

    const userType = document.getElementById('registerUserType').value;
    const password = document.getElementById('registerPassword').value;

    if (!password) {
        showNotification('Please enter a password', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    // Validate required fields based on user type
    let isValid = true;
    let message = '';

    if (userType === 'student') {
        const validation = validateStudentRegistration();
        isValid = validation.isValid;
        message = validation.message;
    } else if (userType === 'alumni') {
        const validation = validateAlumniRegistration();
        isValid = validation.isValid;
        message = validation.message;
    } else if (userType === 'organization') {
        const validation = validateOrganizationRegistration();
        isValid = validation.isValid;
        message = validation.message;
    }

    if (!isValid) {
        showNotification(message, 'error');
        return;
    }

    // Simulate registration
    const registrationData = collectRegistrationData(userType);

    if (simulateRegistration(userType, registrationData)) {
        const approvalMessage = (userType === 'alumni' || userType === 'organization') ?
            'Your profile is pending admin approval.' :
            'You can now login.';

        showNotification(`Registration successful! ${approvalMessage}`, 'success');
        showLogin();
        clearRegistrationForm();
    } else {
        showNotification('Registration failed. Please try again.', 'error');
    }
}

function validateStudentRegistration() {
    const name = document.getElementById('studentName').value.trim();
    const iubId = document.getElementById('studentIubId').value.trim();
    const email = document.getElementById('studentEmail').value.trim();
    const school = document.getElementById('studentSchool').value;
    const credits = document.getElementById('studentCredits').value;

    if (!name || !iubId || !email || !school || !credits) {
        return { isValid: false, message: 'Please fill in all student fields' };
    }

    if (!validateEmail(email)) {
        return { isValid: false, message: 'Please enter a valid email address' };
    }

    if (!validateIUBId(iubId)) {
        return { isValid: false, message: 'Please enter a valid IUB ID (9 digits)' };
    }

    if (credits < 0 || credits > 150) {
        return { isValid: false, message: 'Credits must be between 0 and 150' };
    }

    return { isValid: true, message: '' };
}

function validateAlumniRegistration() {
    const name = document.getElementById('alumniName').value.trim();
    const iubId = document.getElementById('alumniIubId').value.trim();
    const email = document.getElementById('alumniEmail').value.trim();
    const phone = document.getElementById('alumniPhone').value.trim();
    const gradYear = document.getElementById('alumniGradYear').value;

    if (!name || !iubId || !email) {
        return { isValid: false, message: 'Please fill in required alumni fields' };
    }

    if (!validateEmail(email)) {
        return { isValid: false, message: 'Please enter a valid email address' };
    }

    if (!validateIUBId(iubId)) {
        return { isValid: false, message: 'Please enter a valid IUB ID (9 digits)' };
    }

    if (phone && !validatePhone(phone)) {
        return { isValid: false, message: 'Please enter a valid phone number' };
    }

    if (gradYear && (gradYear < 2000 || gradYear > new Date().getFullYear())) {
        return { isValid: false, message: 'Please enter a valid graduation year' };
    }

    return { isValid: true, message: '' };
}

function validateOrganizationRegistration() {
    const orgName = document.getElementById('orgName').value.trim();
    const orgEmail = document.getElementById('orgEmail').value.trim();
    const personName = document.getElementById('orgPersonName').value.trim();
    const phone = document.getElementById('orgPhone').value.trim();

    if (!orgName || !orgEmail || !personName) {
        return { isValid: false, message: 'Please fill in required organization fields' };
    }

    if (!validateEmail(orgEmail)) {
        return { isValid: false, message: 'Please enter a valid email address' };
    }

    if (orgEmail.includes('gmail') || orgEmail.includes('yahoo') || orgEmail.includes('hotmail')) {
        return { isValid: false, message: 'Please use official organization email' };
    }

    if (phone && !validatePhone(phone)) {
        return { isValid: false, message: 'Please enter a valid phone number' };
    }

    return { isValid: true, message: '' };
}

function collectRegistrationData(userType) {
    const data = { userType };

    if (userType === 'student') {
        data.name = document.getElementById('studentName').value.trim();
        data.iubId = document.getElementById('studentIubId').value.trim();
        data.email = document.getElementById('studentEmail').value.trim();
        data.school = document.getElementById('studentSchool').value;
        data.credits = document.getElementById('studentCredits').value;
    } else if (userType === 'alumni') {
        data.name = document.getElementById('alumniName').value.trim();
        data.iubId = document.getElementById('alumniIubId').value.trim();
        data.email = document.getElementById('alumniEmail').value.trim();
        data.phone = document.getElementById('alumniPhone').value.trim();
        data.school = document.getElementById('alumniSchool').value;
        data.gradYear = document.getElementById('alumniGradYear').value;
        data.convocation = document.getElementById('alumniConvocation').value;
        data.position = document.getElementById('alumniPosition').value.trim();
    } else if (userType === 'organization') {
        data.orgName = document.getElementById('orgName').value.trim();
        data.personName = document.getElementById('orgPersonName').value.trim();
        data.designation = document.getElementById('orgPersonDesignation').value.trim();
        data.email = document.getElementById('orgEmail').value.trim();
        data.phone = document.getElementById('orgPhone').value.trim();
    }

    return data;
}

function simulateRegistration(userType, data) {
    console.log('Registration data:', data);
    return true;
}

function clearRegistrationForm() {
    const inputs = document.querySelectorAll('#registerForm input, #registerForm select');
    inputs.forEach(input => {
        input.value = '';
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    showLogin();
    toggleRegisterFields();
});


// Student portal functionality
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, duration);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logged out successfully', 'info');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1000);
    }
}

function showAlumniDirectory() {
    const modal = createModal('Alumni Directory', `
        <div style="margin-bottom: 20px;">
            <input type="text" class="form-input" placeholder="Search alumni..." style="margin-bottom: 15px;">
        </div>
        <div style="max-height: 300px; overflow-y: auto;">
            <div class="circular-item">
                <div class="circular-title">John Smith</div>
                <div class="circular-desc">Software Engineer at Google</div>
                <div style="font-size: 0.8rem; color: #666;">Class of 2020, CSE</div>
            </div>
            <div class="circular-item">
                <div class="circular-title">Sarah Johnson</div>
                <div class="circular-desc">Product Manager at Microsoft</div>
                <div style="font-size: 0.8rem; color: #666;">Class of 2019, BBA</div>
            </div>
            <div class="circular-item">
                <div class="circular-title">Mike Chen</div>
                <div class="circular-desc">Entrepreneur, GreenTech Solutions</div>
                <div style="font-size: 0.8rem; color: #666;">Class of 2018, EEE</div>
            </div>
        </div>
    `);

    document.body.appendChild(modal);
}

function showDirectory() {
    const modal = createModal('University Directory', `
        <div style="display: grid; gap: 15px;">
            <div class="circular-item">
                <div class="circular-title">Registrar Office</div>
                <div class="circular-desc">📞 +880-2-9291254</div>
                <div class="circular-desc">✉️ registrar@iub.edu.bd</div>
            </div>
            <div class="circular-item">
                <div class="circular-title">Career Services</div>
                <div class="circular-desc">📞 +880-2-9291255</div>
                <div class="circular-desc">✉️ career@iub.edu.bd</div>
            </div>
            <div class="circular-item">
                <div class="circular-title">Student Affairs</div>
                <div class="circular-desc">📞 +880-2-9291256</div>
                <div class="circular-desc">✉️ studentaffairs@iub.edu.bd</div>
            </div>
        </div>
    `);

    document.body.appendChild(modal);
}

function showCareerCounseling() {
    const modal = createModal('Career Counseling Appointment', `
        <form onsubmit="submitCareerCounseling(event)">
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Your Name" required>
            </div>
            <div class="form-group">
                <input type="text" class="form-input" placeholder="IUB ID" required>
            </div>
            <div class="form-group">
                <input type="email" class="form-input" placeholder="Email" required>
            </div>
            <div class="form-group">
                <textarea class="form-input" placeholder="Purpose of appointment" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <input type="date" class="form-input" required>
            </div>
            <div class="form-group">
                <select class="form-select" required>
                    <option value="">Select Time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                </select>
            </div>
            <button type="submit" class="btn" style="width: 100%; background: #6f42c1;">
                Book Appointment
            </button>
        </form>
    `);

    document.body.appendChild(modal);
}

function showAlumniShowcase() {
    const modal = createModal('Alumni Showcase', `
        <div style="max-height: 400px; overflow-y: auto;">
            <div class="circular-item">
                <div style="width: 100%; height: 80px; background: linear-gradient(135deg, #007bff, #6f42c1); border-radius: 8px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                    AI Research
                </div>
                <div class="circular-title">Machine Learning for Healthcare</div>
                <div class="circular-desc">By Sarah Johnson, Class of 2019</div>
            </div>
            <div class="circular-item">
                <div style="width: 100%; height: 80px; background: linear-gradient(135deg, #28a745, #20c997); border-radius: 8px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                    Startup
                </div>
                <div class="circular-title">GreenTech Solutions</div>
                <div class="circular-desc">By Mike Chen, Class of 2018</div>
            </div>
        </div>
    `);

    document.body.appendChild(modal);
}

function submitCareerCounseling(event) {
    event.preventDefault();
    showNotification('Career counseling appointment booked successfully!', 'success');
    closeModal();
}

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">${title}</h2>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div>${content}</div>
        </div>
    `;

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    return modal;
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.remove());
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Student portal loaded');
});

// Alumni portal functionality
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, duration);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logged out successfully', 'info');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1000);
    }
}

function showAlumniCardForm() {
    const modal = createModal('Alumni Card Application', `
        <div style="text-align: center; margin-bottom: 20px;">
            <p style="color: #666;">You will be redirected to the official alumni card application form.</p>
        </div>
        <button class="btn" onclick="window.open('#', '_blank')" style="width: 100%;">
            Go to Application Form
        </button>
    `);

    document.body.appendChild(modal);
}

function showAppointmentForm(userType) {
    const modal = createModal('Request Appointment', `
        <form onsubmit="submitAppointment(event, '${userType}')">
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Your Name" required>
            </div>
            <div class="form-group">
                <input type="text" class="form-input" placeholder="IUB ID" required>
            </div>
            <div class="form-group">
                <input type="email" class="form-input" placeholder="Email" required>
            </div>
            <div class="form-group">
                <textarea class="form-input" placeholder="Purpose of appointment" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <input type="date" class="form-input" required>
            </div>
            <div class="form-group">
                <select class="form-select" required>
                    <option value="">Select Time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                </select>
            </div>
            <button type="submit" class="btn" style="width: 100%;">
                Submit Request
            </button>
        </form>
    `);

    document.body.appendChild(modal);
}

function editAlumniProfile() {
    const modal = createModal('Edit Alumni Profile', `
        <form onsubmit="updateAlumniProfile(event)">
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Full Name" value="John Smith" required>
            </div>
            <div class="form-group">
                <input type="email" class="form-input" placeholder="Email" value="john@example.com" required>
            </div>
            <div class="form-group">
                <input type="tel" class="form-input" placeholder="Phone" value="+8801234567890">
            </div>
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Current Position" value="Software Engineer">
            </div>
            <div class="form-group">
                <textarea class="form-input" placeholder="Bio" rows="3">Experienced software engineer with expertise in web development.</textarea>
            </div>
            <button type="submit" class="btn" style="width: 100%; background: #6f42c1;">
                Update Profile
            </button>
        </form>
    `);

    document.body.appendChild(modal);
}

function showAlumniDirectory() {
    const modal = createModal('Alumni Directory', `
        <div style="margin-bottom: 20px;">
            <input type="text" class="form-input" placeholder="Search alumni..." style="margin-bottom: 15px;">
        </div>
        <div style="max-height: 300px; overflow-y: auto;">
            <div class="circular-item">
                <div class="circular-title">John Smith</div>
                <div class="circular-desc">Software Engineer at Google</div>
                <div style="font-size: 0.8rem; color: #666;">Class of 2020, CSE</div>
            </div>
            <div class="circular-item">
                <div class="circular-title">Sarah Johnson</div>
                <div class="circular-desc">Product Manager at Microsoft</div>
                <div style="font-size: 0.8rem; color: #666;">Class of 2019, BBA</div>
            </div>
            <div class="circular-item">
                <div class="circular-title">Mike Chen</div>
                <div class="circular-desc">Entrepreneur, GreenTech Solutions</div>
                <div style="font-size: 0.8rem; color: #666;">Class of 2018, EEE</div>
            </div>
        </div>
    `);

    document.body.appendChild(modal);
}

function submitAppointment(event, userType) {
    event.preventDefault();
    showNotification('Appointment request submitted successfully!', 'success');
    closeModal();
}

function updateAlumniProfile(event) {
    event.preventDefault();
    showNotification('Profile updated successfully!', 'success');
    closeModal();
}

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">${title}</h2>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div>${content}</div>
        </div>
    `;

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    return modal;
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.remove());
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Alumni portal loaded');
});


// Organization portal functionality
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, duration);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logged out successfully', 'info');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1000);
    }
}

function showPostCircularForm() {
    const modal = createModal('Post New Circular', `
        <form onsubmit="submitCircular(event)">
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Circular Title" required>
            </div>
            <div class="form-group">
                <textarea class="form-input" placeholder="Circular Description" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <select class="form-select" required>
                    <option value="">Select Category</option>
                    <option value="internship">Internship</option>
                    <option value="job">Job Opportunity</option>
                    <option value="workshop">Workshop</option>
                    <option value="event">Event</option>
                </select>
            </div>
            <div class="form-group">
                <input type="date" class="form-input" placeholder="Application Deadline" required>
            </div>
            <button type="submit" class="btn" style="width: 100%; background: #28a745;">
                Post Circular
            </button>
        </form>
    `);

    document.body.appendChild(modal);
}

function showAppointmentForm(userType) {
    const modal = createModal('Request Appointment', `
        <form onsubmit="submitAppointment(event, '${userType}')">
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Organization Name" required>
            </div>
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Representative Name" required>
            </div>
            <div class="form-group">
                <input type="email" class="form-input" placeholder="Organization Email" required>
            </div>
            <div class="form-group">
                <textarea class="form-input" placeholder="Purpose of appointment" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <input type="date" class="form-input" required>
            </div>
            <div class="form-group">
                <select class="form-select" required>
                    <option value="">Select Time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                </select>
            </div>
            <button type="submit" class="btn" style="width: 100%;">
                Submit Request
            </button>
        </form>
    `);

    document.body.appendChild(modal);
}

function editOrgProfile() {
    const modal = createModal('Edit Organization Profile', `
        <form onsubmit="updateOrgProfile(event)">
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Organization Name" value="TechCorp Bangladesh" required>
            </div>
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Representative Name" value="Jane Doe" required>
            </div>
            <div class="form-group">
                <input type="email" class="form-input" placeholder="Email" value="hr@techcorp.com" required>
            </div>
            <div class="form-group">
                <input type="tel" class="form-input" placeholder="Phone" value="+8801234567890">
            </div>
            <div class="form-group">
                <textarea class="form-input" placeholder="Company Description" rows="3">Leading technology company in Bangladesh.</textarea>
            </div>
            <button type="submit" class="btn" style="width: 100%; background: #28a745;">
                Update Profile
            </button>
        </form>
    `);

    document.body.appendChild(modal);
}

function viewApplications() {
    const modal = createModal('View Applications', `
        <div style="max-height: 400px; overflow-y: auto;">
            <div class="circular-item">
                <div class="circular-title">John Smith - Software Developer</div>
                <div class="circular-desc">Applied: Nov 22, 2024</div>
                <div style="margin-top: 10px;">
                    <button class="btn" style="background: #28a745; margin-right: 10px; padding: 5px 15px; font-size: 0.9rem;">Accept</button>
                    <button class="btn" style="background: #dc3545; padding: 5px 15px; font-size: 0.9rem;">Reject</button>
                </div>
            </div>
            <div class="circular-item">
                <div class="circular-title">Sarah Johnson - Marketing Intern</div>
                <div class="circular-desc">Applied: Nov 21, 2024</div>
                <div style="margin-top: 10px;">
                    <button class="btn" style="background: #28a745; margin-right: 10px; padding: 5px 15px; font-size: 0.9rem;">Accept</button>
                    <button class="btn" style="background: #dc3545; padding: 5px 15px; font-size: 0.9rem;">Reject</button>
                </div>
            </div>
        </div>
    `);

    document.body.appendChild(modal);
}

function showAlumniDirectory() {
    const modal = createModal('Alumni Directory', `
        <div style="margin-bottom: 20px;">
            <input type="text" class="form-input" placeholder="Search alumni..." style="margin-bottom: 15px;">
        </div>
        <div style="max-height: 300px; overflow-y: auto;">
            <div class="circular-item">
                <div class="circular-title">John Smith</div>
                <div class="circular-desc">Software Engineer at Google</div>
                <div style="font-size: 0.8rem; color: #666;">Class of 2020, CSE</div>
            </div>
            <div class="circular-item">
                <div class="circular-title">Sarah Johnson</div>
                <div class="circular-desc">Product Manager at Microsoft</div>
                <div style="font-size: 0.8rem; color: #666;">Class of 2019, BBA</div>
            </div>
        </div>
    `);

    document.body.appendChild(modal);
}

function submitCircular(event) {
    event.preventDefault();
    showNotification('Circular posted successfully!', 'success');
    closeModal();
}

function submitAppointment(event, userType) {
    event.preventDefault();
    showNotification('Appointment request submitted successfully!', 'success');
    closeModal();
}

function updateOrgProfile(event) {
    event.preventDefault();
    showNotification('Profile updated successfully!', 'success');
    closeModal();
}

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">${title}</h2>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div>${content}</div>
        </div>
    `;

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    return modal;
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.remove());
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Organization portal loaded');
});

/ Admin portal functionality

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, duration);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logged out successfully', 'info');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1000);
    }
}

function approveProfile(type, id) {
    if (confirm(`Are you sure you want to approve this ${type} profile?`)) {
        showNotification(`${type} profile approved successfully!`, 'success');
        // In real app, remove from pending list
    }
}

function rejectProfile(type, id) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason && reason.trim()) {
        showNotification(`${type} profile rejected.`, 'warning');
        // In real app, remove from pending list
    }
}

function showPostNoticeForm() {
    const modal = createModal('Post Notice', `
        <form onsubmit="submitNotice(event)">
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Notice Title" required>
            </div>
            <div class="form-group">
                <textarea class="form-input" placeholder="Notice Content" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <select class="form-select" required>
                    <option value="">Select Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>
            <button type="submit" class="btn" style="width: 100%;">
                Post Notice
            </button>
        </form>
    `);

    document.body.appendChild(modal);
}

function showPostEventForm() {
    const modal = createModal('Post Event', `
        <form onsubmit="submitEvent(event)">
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Event Title" required>
            </div>
            <div class="form-group">
                <textarea class="form-input" placeholder="Event Description" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <input type="date" class="form-input" placeholder="Event Date" required>
            </div>
            <div class="form-group">
                <input type="time" class="form-input" placeholder="Event Time" required>
            </div>
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Event Location" required>
            </div>
            <button type="submit" class="btn" style="width: 100%; background: #28a745;">
                Post Event
            </button>
        </form>
    `);

    document.body.appendChild(modal);
}

function viewReports() {
    const modal = createModal('System Reports', `
        <div style="display: grid; gap: 15px;">
            <div class="circular-item">
                <div class="circular-title">User Statistics</div>
                <div class="circular-desc">Students: 1,250 | Alumni: 850 | Organizations: 45</div>
            </div>
            <div class="circular-item">
                <div class="circular-title">Circular Statistics</div>
                <div class="circular-desc">Total Posted: 125 | Active: 45 | Expired: 80</div>
            </div>
            <div class="circular-item">
                <div class="circular-title">Application Statistics</div>
                <div class="circular-desc">Total Applications: 2,340 | Pending: 156 | Processed: 2,184</div>
            </div>
        </div>
    `);

    document.body.appendChild(modal);
}

function manageUsers() {
    const modal = createModal('Manage Users', `
        <div style="margin-bottom: 20px;">
            <input type="text" class="form-input" placeholder="Search users..." style="margin-bottom: 15px;">
        </div>
        <div style="max-height: 300px; overflow-y: auto;">
            <div class="circular-item">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div class="circular-title">John Smith (Student)</div>
                        <div class="circular-desc">john@student.iub.edu.bd</div>
                    </div>
                    <div>
                        <button class="btn" style="background: #dc3545; padding: 5px 10px; font-size: 0.8rem;">Suspend</button>
                    </div>
                </div>
            </div>
            <div class="circular-item">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div class="circular-title">TechCorp Bangladesh</div>
                        <div class="circular-desc">hr@techcorp.com</div>
                    </div>
                    <div>
                        <button class="btn" style="background: #dc3545; padding: 5px 10px; font-size: 0.8rem;">Suspend</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    document.body.appendChild(modal);
}

function submitNotice(event) {
    event.preventDefault();
    showNotification('Notice posted successfully!', 'success');
    closeModal();
}

function submitEvent(event) {
    event.preventDefault();
    showNotification('Event posted successfully!', 'success');
    closeModal();
}

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">${title}</h2>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div>${content}</div>
        </div>
    `;

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    return modal;
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.remove());
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin portal loaded');
});

/ Admin portal functionality

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, duration);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logged out successfully', 'info');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1000);
    }
}

function approveProfile(type, id) {
    if (confirm(`Are you sure you want to approve this ${type} profile?`)) {
        showNotification(`${type} profile approved successfully!`, 'success');
        // In real app, remove from pending list
    }
}

function rejectProfile(type, id) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason && reason.trim()) {
        showNotification(`${type} profile rejected.`, 'warning');
        // In real app, remove from pending list
    }
}

function showPostNoticeForm() {
    const modal = createModal('Post Notice', `
        <form onsubmit="submitNotice(event)">
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Notice Title" required>
            </div>
            <div class="form-group">
                <textarea class="form-input" placeholder="Notice Content" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <select class="form-select" required>
                    <option value="">Select Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>
            <button type="submit" class="btn" style="width: 100%;">
                Post Notice
            </button>
        </form>
    `);

    document.body.appendChild(modal);
}

function showPostEventForm() {
    const modal = createModal('Post Event', `
        <form onsubmit="submitEvent(event)">
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Event Title" required>
            </div>
            <div class="form-group">
                <textarea class="form-input" placeholder="Event Description" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <input type="date" class="form-input" placeholder="Event Date" required>
            </div>
            <div class="form-group">
                <input type="time" class="form-input" placeholder="Event Time" required>
            </div>
            <div class="form-group">
                <input type="text" class="form-input" placeholder="Event Location" required>
            </div>
            <button type="submit" class="btn" style="width: 100%; background: #28a745;">
                Post Event
            </button>
        </form>
    `);

    document.body.appendChild(modal);
}

function viewReports() {
    const modal = createModal('System Reports', `
        <div style="display: grid; gap: 15px;">
            <div class="circular-item">
                <div class="circular-title">User Statistics</div>
                <div class="circular-desc">Students: 1,250 | Alumni: 850 | Organizations: 45</div>
            </div>
            <div class="circular-item">
                <div class="circular-title">Circular Statistics</div>
                <div class="circular-desc">Total Posted: 125 | Active: 45 | Expired: 80</div>
            </div>
            <div class="circular-item">
                <div class="circular-title">Application Statistics</div>
                <div class="circular-desc">Total Applications: 2,340 | Pending: 156 | Processed: 2,184</div>
            </div>
        </div>
    `);

    document.body.appendChild(modal);
}

function manageUsers() {
    const modal = createModal('Manage Users', `
        <div style="margin-bottom: 20px;">
            <input type="text" class="form-input" placeholder="Search users..." style="margin-bottom: 15px;">
        </div>
        <div style="max-height: 300px; overflow-y: auto;">
            <div class="circular-item">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div class="circular-title">John Smith (Student)</div>
                        <div class="circular-desc">john@student.iub.edu.bd</div>
                    </div>
                    <div>
                        <button class="btn" style="background: #dc3545; padding: 5px 10px; font-size: 0.8rem;">Suspend</button>
                    </div>
                </div>
            </div>
            <div class="circular-item">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div class="circular-title">TechCorp Bangladesh</div>
                        <div class="circular-desc">hr@techcorp.com</div>
                    </div>
                    <div>
                        <button class="btn" style="background: #dc3545; padding: 5px 10px; font-size: 0.8rem;">Suspend</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    document.body.appendChild(modal);
}

function submitNotice(event) {
    event.preventDefault();
    showNotification('Notice posted successfully!', 'success');
    closeModal();
}

function submitEvent(event) {
    event.preventDefault();
    showNotification('Event posted successfully!', 'success');
    closeModal();
}

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">${title}</h2>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div>${content}</div>
        </div>
    `;

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    return modal;
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.remove());
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin portal loaded');
});