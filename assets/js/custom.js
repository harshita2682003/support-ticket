// Support Ticket Form JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                mobileMenuButton.innerHTML = '<i class="fas fa-times text-2xl"></i>';
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
            }
        });
    }
    
    // Form validation
    const form = document.querySelector('form');
    if (form) {
        // Set form validation attributes
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.setAttribute('pattern', '^[A-Za-z\\s]{2,50}$');
            nameInput.setAttribute('title', 'Name should contain only letters and spaces (2-50 characters)');
        }

        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.setAttribute('pattern', '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
            emailInput.setAttribute('title', 'Please enter a valid email address');
        }

        const subjectInput = document.getElementById('subject');
        if (subjectInput) {
            subjectInput.setAttribute('minlength', '5');
            subjectInput.setAttribute('maxlength', '100');
            subjectInput.setAttribute('title', 'Subject should be between 5 and 100 characters');
        }

        const descriptionTextarea = document.getElementById('description');
        if (descriptionTextarea) {
            descriptionTextarea.setAttribute('minlength', '20');
            descriptionTextarea.setAttribute('title', 'Please provide a detailed description (minimum 20 characters)');
        }

        // Form submission handler
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Enhanced validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                // Check if field is empty
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                    showError(field, 'This field is required');
                } 
                // Check if field meets pattern/constraint validation
                else if (field.validity && !field.validity.valid) {
                    isValid = false;
                    field.classList.add('border-red-500');
                    showError(field, field.title || 'Please enter a valid value');
                } 
                else {
                    field.classList.remove('border-red-500');
                    // Remove error message if it exists
                    const errorMsg = document.getElementById(`${field.id}-error`);
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
            
            // Show success message if form is valid
            if (isValid) {
                // Show loading state for submit button
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
                
                // Simulate form submission (in a real app, this would be an API call)
                setTimeout(() => {
                    // Show upload progress for file uploads if files are selected
                    const fileUpload = document.getElementById('file-upload');
                    const progressContainer = document.getElementById('upload-progress-container');
                    const progressBar = document.getElementById('upload-progress');
                    const uploadStatus = document.getElementById('upload-status');
                    
                    if (fileUpload && fileUpload.files.length > 0 && progressContainer && progressBar && uploadStatus) {
                        progressContainer.classList.remove('hidden');
                        uploadStatus.textContent = 'Uploading files...';
                        
                        // Simulate file upload progress
                        let progress = 0;
                        const uploadInterval = setInterval(() => {
                            progress += 10;
                            progressBar.classList.add('uploading');
                            progressBar.style.width = `${progress}%`;
                            
                            if (progress >= 100) {
                                clearInterval(uploadInterval);
                                progressBar.classList.remove('uploading');
                                progressBar.classList.add('complete');
                                uploadStatus.textContent = 'Upload complete!';
                                
                                // Show success message after upload is complete
                                setTimeout(() => showSuccessMessage(form), 500);
                            }
                        }, 300);
                    } else {
                        // Show success message immediately if no files to upload
                        showSuccessMessage(form);
                    }
                    
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }, 1000);
            }
        });
        
        // Helper function to show field-specific error message
        function showError(field, message) {
            // Add error message if it doesn't exist
            const errorId = `${field.id}-error`;
            if (!document.getElementById(errorId)) {
                const errorMsg = document.createElement('p');
                errorMsg.id = errorId;
                errorMsg.className = 'text-red-500 text-sm mt-1 animate-fadeIn';
                errorMsg.innerText = message;
                field.parentNode.appendChild(errorMsg);
            }
        }
        
        // Helper function to show success message
        function showSuccessMessage(form) {
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'fixed inset-0 flex items-center justify-center z-50';
            successMsg.innerHTML = `
                <div class="absolute inset-0 bg-black bg-opacity-50"></div>
                <div class="bg-white p-8 rounded-lg shadow-xl z-10 max-w-md mx-auto relative animate-fadeIn">
                    <div class="text-center">
                        <div class="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-check text-green-500 text-4xl"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Ticket Submitted!</h2>
                        <p class="text-gray-600 mb-6">Your support ticket has been submitted successfully. Our team will review it and get back to you soon.</p>
                        <p class="text-sm text-gray-500 mb-6">Ticket reference: #${generateTicketRef()}</p>
                        <button class="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-all duration-300" id="close-success">
                            Close
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(successMsg);
            
            // Handle close button
            document.getElementById('close-success').addEventListener('click', function() {
                successMsg.remove();
                form.reset();
                
                // Reset custom elements
                const prioritySlider = document.getElementById('priority-level');
                const priorityValue = document.getElementById('priority-value');
                if (prioritySlider && priorityValue) {
                    prioritySlider.value = 2;
                    priorityValue.textContent = 'Medium';
                    priorityValue.className = 'font-semibold text-lg text-yellow-500';
                }
                
                // Reset file upload elements
                const fileChosen = document.getElementById('file-chosen');
                const progressContainer = document.getElementById('upload-progress-container');
                if (fileChosen) {
                    fileChosen.textContent = 'No file chosen';
                    fileChosen.classList.remove('text-primary');
                }
                if (progressContainer) {
                    progressContainer.classList.add('hidden');
                }
                
                // Remove any dynamic icons
                const dynamicIcons = document.querySelectorAll('.dynamic-icon');
                dynamicIcons.forEach(icon => icon.remove());
            });
        }
        
        // Generate a random ticket reference
        function generateTicketRef() {
            const prefix = 'TKT';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = prefix + '-';
            for (let i = 0; i < 8; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }
        
        // Real-time validation on input
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', function() {
                validateFieldOnChange(this);
            });
            
            field.addEventListener('blur', function() {
                validateFieldOnChange(this, true);
            });
        });
        
        function validateFieldOnChange(field, isBlur = false) {
            // Clear previous error styles
            field.classList.remove('border-red-500');
            const errorMsg = document.getElementById(`${field.id}-error`);
            if (errorMsg) {
                errorMsg.remove();
            }
            
            // Get the success/error icons if they exist
            const parentContainer = field.parentNode;
            const successIcon = parentContainer.querySelector('.input-success-icon');
            const errorIcon = parentContainer.querySelector('.input-error-icon');
            
            // Hide both icons initially
            if (successIcon) successIcon.classList.add('hidden');
            if (errorIcon) errorIcon.classList.add('hidden');
            
            // Only validate non-empty fields or on blur
            if (field.value.trim() === '' && !isBlur) {
                return;
            }
            
            // Check validity
            if (!field.validity.valid) {
                field.classList.add('border-red-500');
                showError(field, field.title || 'Please enter a valid value');
                
                // Show error icon
                if (errorIcon) {
                    errorIcon.classList.remove('hidden');
                    // Add a subtle shake animation
                    errorIcon.classList.add('animate-shake');
                    setTimeout(() => {
                        errorIcon.classList.remove('animate-shake');
                    }, 500);
                }
            } else {
                // Add success indicator
                field.classList.add('border-green-500');
                
                // Show success icon with fade in effect
                if (successIcon) {
                    successIcon.classList.remove('hidden');
                    successIcon.classList.add('animate-fadeIn');
                }
                
                setTimeout(() => {
                    field.classList.remove('border-green-500');
                }, 2000);
            }
        }
    }
    
    // File upload functionality
    const fileUpload = document.getElementById('file-upload');
    const fileChosen = document.getElementById('file-chosen');
    const dropArea = document.querySelector('.border-dashed');
    const progressContainer = document.getElementById('upload-progress-container');
    
    if (fileUpload && fileChosen && dropArea) {
        fileUpload.addEventListener('change', function(e) {
            handleFiles(this.files);
        });
        
        // Drag and drop functionality
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropArea.classList.add('dragover');
        }
        
        function unhighlight() {
            dropArea.classList.remove('dragover');
        }
        
        dropArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            fileUpload.files = files;
            handleFiles(files);
        }
        
        function handleFiles(files) {
            if (files.length > 0) {
                // Check file types and sizes
                let validFiles = true;
                let totalSize = 0;
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
                
                Array.from(files).forEach(file => {
                    totalSize += file.size;
                    if (!allowedTypes.includes(file.type)) {
                        validFiles = false;
                    }
                });
                
                // 10MB max total size
                if (totalSize > 10 * 1024 * 1024) {
                    fileChosen.textContent = 'Error: Total file size exceeds 10MB';
                    fileChosen.classList.add('text-red-500');
                    fileChosen.classList.remove('text-primary');
                    return;
                }
                
                if (!validFiles) {
                    fileChosen.textContent = 'Error: Invalid file type(s)';
                    fileChosen.classList.add('text-red-500');
                    fileChosen.classList.remove('text-primary');
                    return;
                }
                
                // Valid files
                if (files.length === 1) {
                    fileChosen.textContent = `Selected: ${files[0].name}`;
                } else {
                    fileChosen.textContent = `Selected: ${files.length} files`;
                }
                fileChosen.classList.add('text-primary');
                fileChosen.classList.remove('text-red-500');
                
                // Show preview for images
                const previewContainer = document.getElementById('file-preview');
                if (previewContainer) {
                    previewContainer.innerHTML = '';
                    previewContainer.classList.remove('hidden');
                    
                    Array.from(files).forEach(file => {
                        if (file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                const preview = document.createElement('div');
                                preview.className = 'relative group';
                                preview.innerHTML = `
                                    <img src="${e.target.result}" class="h-16 w-16 object-cover rounded border border-gray-300" alt="${file.name}">
                                    <span class="text-xs text-gray-500 mt-1 block truncate max-w-[4rem]">${file.name}</span>
                                `;
                                previewContainer.appendChild(preview);
                            }
                            reader.readAsDataURL(file);
                        } else {
                            // For non-image files (like PDF)
                            const preview = document.createElement('div');
                            preview.className = 'relative group';
                            preview.innerHTML = `
                                <div class="h-16 w-16 flex items-center justify-center bg-gray-100 rounded border border-gray-300">
                                    <i class="fas fa-file-pdf text-red-500 text-2xl"></i>
                                </div>
                                <span class="text-xs text-gray-500 mt-1 block truncate max-w-[4rem]">${file.name}</span>
                            `;
                            previewContainer.appendChild(preview);
                        }
                    });
                }
            } else {
                fileChosen.textContent = 'No file chosen';
                fileChosen.classList.remove('text-primary', 'text-red-500');
                
                const previewContainer = document.getElementById('file-preview');
                if (previewContainer) {
                    previewContainer.innerHTML = '';
                    previewContainer.classList.add('hidden');
                }
            }
        }
    }
    
    // Rich text editor functionality
    const toolbar = document.querySelector('.rich-text-toolbar');
    const description = document.getElementById('description');
    
    if (toolbar && description) {
        // Basic rich text editing functionality
        toolbar.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get the command from button data attribute or title
                const command = this.dataset.command || this.title;
                
                // Focus the textarea
                description.focus();
                
                // Implement some basic functionality
                switch(command) {
                    case 'Bold':
                        insertTextAtCursor(description, '**', '**');
                        break;
                    case 'Italic':
                        insertTextAtCursor(description, '_', '_');
                        break;
                    case 'Bullet List':
                        insertListAtCursor(description, '- ');
                        break;
                    case 'Numbered List':
                        insertListAtCursor(description, index => `${index}. `);
                        break;
                    case 'Insert Code':
                        insertTextAtCursor(description, '`', '`');
                        break;
                    case 'Insert Link':
                        insertTextAtCursor(description, '[Link text](', ')');
                        break;
                }
            });
        });
        
        // Helper functions for rich text editing
        function insertTextAtCursor(textarea, before, after) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            const newText = before + selectedText + after;
            
            textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
            
            // Put cursor after the inserted text
            textarea.selectionStart = textarea.selectionEnd = end + before.length + after.length;
        }
        
        function insertListAtCursor(textarea, prefix) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            
            // Split selected text by new lines and add prefix to each line
            const lines = selectedText.split('\n');
            const prefixedLines = lines.map((line, index) => {
                return typeof prefix === 'function' ? prefix(index + 1) + line : prefix + line;
            });
            
            const newText = '\n' + prefixedLines.join('\n') + '\n';
            
            textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
            
            // Position cursor at the end of the inserted text
            textarea.selectionStart = textarea.selectionEnd = start + newText.length;
        }
    }
    
    // Priority level slider
    const prioritySlider = document.getElementById('priority-level');
    const priorityValue = document.getElementById('priority-value');
    
    if (prioritySlider && priorityValue) {
        // Set initial value
        updatePriorityLabel(prioritySlider.value);
        
        prioritySlider.addEventListener('input', function() {
            updatePriorityLabel(this.value);
        });
        
        function updatePriorityLabel(value) {
            const priorityLabels = ['Low', 'Medium', 'High', 'Urgent'];
            const colorClasses = ['text-green-500', 'text-yellow-500', 'text-orange-500', 'text-red-500'];
            
            priorityValue.textContent = priorityLabels[value - 1];
            
            // Remove all color classes first
            colorClasses.forEach(cls => priorityValue.classList.remove(cls));
            
            // Add the appropriate color class
            priorityValue.classList.add(colorClasses[value - 1]);
            
            // Add font-semibold and text-lg classes if not already present
            priorityValue.classList.add('font-semibold', 'text-lg');
        }
    }
    
    // Category selection enhancement
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            // Remove previous icon if any
            const previousIcon = this.parentNode.querySelector('.dynamic-icon');
            if (previousIcon) {
                previousIcon.remove();
            }
            
            // Add icon based on selected category
            const selectedOption = this.options[this.selectedIndex].value;
            if (selectedOption) {
                const iconMap = {
                    'technical': 'fa-wrench',
                    'billing': 'fa-credit-card',
                    'feature': 'fa-lightbulb',
                    'other': 'fa-question-circle'
                };
                
                if (iconMap[selectedOption]) {
                    const icon = document.createElement('i');
                    icon.className = `fas ${iconMap[selectedOption]} text-primary-dark absolute top-3 right-10 dynamic-icon`;
                    this.parentNode.appendChild(icon);
                }
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Create animated background
    initAnimatedBackground();
});

// Add animation class for the main card
document.addEventListener('DOMContentLoaded', function() {
    const mainCard = document.querySelector('.main-card');
    if (mainCard) {
        setTimeout(() => {
            mainCard.classList.add('appeared');
        }, 100);
    }
});

// Initialize animated background
function initAnimatedBackground() {
    const backgroundContainer = document.getElementById('animated-background');
    if (!backgroundContainer) return;
    
    // Create floating shapes
    for (let i = 0; i < 10; i++) {
        createFloatingShape(backgroundContainer, i);
    }
    
    // Create animated particles (smaller dots for texture)
    for (let i = 0; i < 20; i++) {
        createAnimatedParticle(backgroundContainer);
    }
    
    // Add parallax effect to background elements
    if (window.innerWidth > 768) { // Only on desktop
        document.addEventListener('mousemove', function(e) {
            const moveX = (e.clientX - window.innerWidth / 2) / 50;
            const moveY = (e.clientY - window.innerHeight / 2) / 50;
            
            // Move SVG waves slightly based on cursor position
            const waves = backgroundContainer.querySelectorAll('svg');
            waves.forEach((wave, index) => {
                const depth = index + 1;
                wave.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
            });
            
            // Move glowing orbs
            const orbs = document.querySelectorAll('.fixed.blur-3xl');
            orbs.forEach((orb, index) => {
                const depth = index + 2;
                orb.style.transform = `translate(${moveX * depth * -1}px, ${moveY * depth * -1}px)`;
            });
        });
    }
}

// Create floating shape for background
function createFloatingShape(container, index) {
    const shape = document.createElement('div');
    const size = Math.floor(Math.random() * 40) + 15; // 15-55px
    const type = Math.floor(Math.random() * 3); // 0: circle, 1: square, 2: triangle
    
    // Randomize position
    const posX = Math.floor(Math.random() * 100);
    const posY = Math.floor(Math.random() * 100);
    
    // Set base styles
    shape.style.position = 'absolute';
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.left = `${posX}%`;
    shape.style.top = `${posY}%`;
    shape.style.opacity = (Math.random() * 0.2) + 0.05; // 0.05-0.25
    shape.style.pointerEvents = 'none';
    shape.style.zIndex = '-1';
    
    // Set shape type
    if (type === 0) {
        // Circle
        shape.style.borderRadius = '50%';
        shape.style.background = 'rgba(2, 132, 199, 0.15)'; // primary color
        shape.style.filter = 'blur(1px)';
    } else if (type === 1) {
        // Square/rectangle
        shape.style.borderRadius = '4px';
        shape.style.background = 'rgba(234, 88, 12, 0.12)'; // accent color
        // Maybe make it rectangular
        if (Math.random() > 0.5) {
            shape.style.width = `${size * 1.5}px`;
            shape.style.height = `${size * 0.8}px`;
        }
        shape.style.filter = 'blur(1px)';
    } else {
        // Triangle (using CSS)
        shape.style.width = '0';
        shape.style.height = '0';
        shape.style.borderLeft = `${size/2}px solid transparent`;
        shape.style.borderRight = `${size/2}px solid transparent`;
        shape.style.borderBottom = `${size}px solid rgba(2, 132, 199, 0.12)`;
        shape.style.background = 'transparent';
    }
    
    // Set animation - alternating between float and floatAlt
    const animationType = index % 2 === 0 ? 'float' : 'floatAlt';
    const duration = Math.floor(Math.random() * 10) + 15; // 15-25s
    shape.style.animation = `${animationType} ${duration}s ease-in-out infinite`;
    shape.style.animationDelay = `${Math.random() * 10}s`;
    shape.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    // Add to container
    container.appendChild(shape);
}

// Create smaller, faster moving particles for texture
function createAnimatedParticle(container) {
    const particle = document.createElement('div');
    const size = Math.floor(Math.random() * 6) + 2; // 2-8px dots
    
    // Randomize position
    const posX = Math.floor(Math.random() * 100);
    const posY = Math.floor(Math.random() * 100);
    
    // Set styles
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.borderRadius = '50%';
    particle.style.opacity = (Math.random() * 0.3) + 0.05; // 0.05-0.35
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '-2';
    
    // Alternate colors
    const isBlue = Math.random() > 0.5;
    particle.style.background = isBlue 
        ? 'rgba(2, 132, 199, 0.2)' // primary
        : 'rgba(234, 88, 12, 0.2)'; // accent
    
    // Fast animations with larger movement
    const duration = Math.floor(Math.random() * 10) + 20; // 20-30s
    particle.style.animation = `float ${duration}s ease-in-out infinite`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    
    // Add to container
    container.appendChild(particle);
}