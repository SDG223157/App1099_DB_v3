document.addEventListener('DOMContentLoaded', function() {
    // Original ticker search functionality
    const form = document.getElementById('analysis-form');
    const tickerInput = document.getElementById('ticker');
    if (tickerInput) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'suggestions';
        tickerInput.parentNode.appendChild(suggestionsDiv);
        
        let debounceTimeout;

        function formatCompanyName(name) {
            return name.replace(/\\'/g, "'");
        }
        
        // Clear input on double click
        tickerInput.addEventListener('dblclick', function() {
            if (this.value) {
                this.value = '';
                suggestionsDiv.style.display = 'none';
            }
        });
        
        tickerInput.addEventListener('input', function() {
            clearTimeout(debounceTimeout);
            const query = this.value.trim();
            
            if (query.length < 1) {
                suggestionsDiv.style.display = 'none';
                return;
            }
            
            debounceTimeout = setTimeout(() => {
                fetch(`/search_ticker?query=${encodeURIComponent(query)}`)
                    .then(response => response.json())
                    .then(data => {
                        suggestionsDiv.innerHTML = '';
                        
                        if (data.length > 0) {
                            data.forEach(item => {
                                const div = document.createElement('div');
                                div.className = 'suggestion-item';
                                const formattedName = formatCompanyName(item.name);
                                
                                div.innerHTML = `
                                    <span class="symbol">${item.symbol}</span>
                                    <span class="name">${formattedName}</span>
                                `;
                                
                                div.addEventListener('click', function() {
                                    tickerInput.value = `${item.symbol}    ${formattedName}`;
                                    suggestionsDiv.style.display = 'none';
                                });
                                suggestionsDiv.appendChild(div);
                            });
                            suggestionsDiv.style.display = 'block';
                        } else {
                            suggestionsDiv.style.display = 'none';
                        }
                    })
                    .catch(error => {
                        console.error('Search error:', error);
                        suggestionsDiv.style.display = 'none';
                    });
            }, 300);
        });
    }

    // Password visibility toggle
    function togglePassword(button) {
        const input = button.closest('.input-with-icon').querySelector('input');
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        // Update eye icon
        const icon = button.querySelector('i');
        icon.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    }
    window.togglePassword = togglePassword;

    // Registration form validation
    const registerForm = document.querySelector('form.auth-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            const password = registerForm.querySelector('input[name="password"]');
            const confirmPassword = registerForm.querySelector('input[name="confirm_password"]');
            
            if (confirmPassword && password.value !== confirmPassword.value) {
                e.preventDefault();
                alert('Passwords do not match!');
                return;
            }

            // Password strength validation
            if (password && password.value.length < 8) {
                e.preventDefault();
                alert('Password must be at least 8 characters long!');
                return;
            }
        });
    }

    // Flash messages auto-hide
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                message.style.display = 'none';
            }, 300);
        }, 5000);
    });

    // Profile form validation
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            const username = profileForm.querySelector('input[name="username"]');
            if (username && username.value.trim().length < 3) {
                e.preventDefault();
                alert('Username must be at least 3 characters long!');
                return;
            }
        });
    }

    // Password change form validation
    const passwordForm = document.querySelector('.password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            const newPassword = passwordForm.querySelector('input[name="new_password"]');
            if (newPassword && newPassword.value.length < 8) {
                e.preventDefault();
                alert('New password must be at least 8 characters long!');
                return;
            }
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (tickerInput && !tickerInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.style.display = 'none';
        }
    });
});