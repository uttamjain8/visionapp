// Preloaded Sample Data
const preloadedProfiles = [
    {
        name: "Elon Musk",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/1200px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
        qualities: ["Innovative", "Visionary", "Risk-taker"],
        whySuccessful: "Transformed multiple industries with groundbreaking ideas.",
        category: "Visionary"
    },
    {
        name: "Malala Yousafzai",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Malala_Yousafzai_2015.jpg/1200px-Malala_Yousafzai_2015.jpg",
        qualities: ["Courageous", "Inspiring", "Determined"],
        whySuccessful: "Advocated for education and women's rights globally.",
        category: "Inspiring"
    },
    {
        name: "Your Mentor",
        image: "",
        qualities: ["Supportive", "Knowledgeable", "Encouraging"],
        whySuccessful: "Provides guidance and helps me grow in my career.",
        category: "Immediate"
    }
];

const preloadedVision = {
    definitionOfSuccess: "Success means achieving my goals while maintaining balance and happiness in life.",
    yourVision: "I see myself as a confident and skilled professional, making a positive impact in my field and community.",
    expectedQualities: ["Discipline", "Resilience", "Continuous Learning"],
    image: "" // Preloaded image (can be a URL or left empty)
};

// Load profiles and vision from localStorage or use preloaded data
let profiles = JSON.parse(localStorage.getItem('profiles')) || preloadedProfiles;
let vision = JSON.parse(localStorage.getItem('vision')) || preloadedVision;

// Save preloaded data to localStorage if no data exists
if (!localStorage.getItem('profiles')) {
    localStorage.setItem('profiles', JSON.stringify(profiles));
}
if (!localStorage.getItem('vision')) {
    localStorage.setItem('vision', JSON.stringify(vision));
}

// Function to display profiles
function displayProfiles() {
    const profileContainer = document.getElementById('profile-container');
    profileContainer.innerHTML = ''; // Clear existing content

    profiles.forEach((profile, index) => {
        const profileCard = document.createElement('div');
        profileCard.className = 'profile-card';

        profileCard.innerHTML = `
            <div class="badge">${profile.category}</div>
            <h2>${profile.name}</h2>
            ${profile.image ? `<img src="${profile.image}" alt="${profile.name}">` : ''}
            <p><strong>Why Successful:</strong> ${profile.whySuccessful}</p>
            <p><strong>Qualities:</strong> ${profile.qualities.join(', ')}</p>
            <button onclick="deleteProfile(${index})">Delete</button>
        `;

        profileContainer.appendChild(profileCard);
    });
}

// Function to add a new profile
document.getElementById('profile-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const image = document.getElementById('image').value;
    const qualities = document.getElementById('qualities').value.split(',').map(q => q.trim());
    const whySuccessful = document.getElementById('why-successful').value;
    const category = document.getElementById('category').value;

    const newProfile = {
        name,
        image,
        qualities,
        whySuccessful,
        category,
    };

    profiles.push(newProfile);
    localStorage.setItem('profiles', JSON.stringify(profiles));
    displayProfiles();
    document.getElementById('profile-form').reset();
    toggleForm('profile-form'); // Hide the form after submission
});

// Function to delete a profile
function deleteProfile(index) {
    profiles.splice(index, 1);
    localStorage.setItem('profiles', JSON.stringify(profiles));
    displayProfiles();
}

// Function to show/hide sections
function showSection(sectionId) {
    document.getElementById('profiles-section').classList.add('hidden');
    document.getElementById('vision-section').classList.add('hidden');

    document.getElementById(`${sectionId}-section`).classList.remove('hidden');
}

// Function to save vision
document.getElementById('vision-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const definitionOfSuccess = document.getElementById('definition-of-success').value;
    const yourVision = document.getElementById('your-vision').value;
    const expectedQualities = document.getElementById('expected-qualities').value.split(',').map(q => q.trim());

    // Handle image input
    const imageUrl = document.getElementById('vision-image-url').value;
    const imageUpload = document.getElementById('vision-image-upload').files[0];

    let image = "";

    if (imageUrl) {
        // Use the provided URL
        image = imageUrl;
    } else if (imageUpload) {
        // Convert uploaded image to a data URL
        const reader = new FileReader();
        reader.onload = function (event) {
            image = event.target.result;
            saveVision(definitionOfSuccess, yourVision, expectedQualities, image);
        };
        reader.readAsDataURL(imageUpload);
        return; // Exit early, saveVision will be called after image is read
    }

    saveVision(definitionOfSuccess, yourVision, expectedQualities, image);
});

function saveVision(definitionOfSuccess, yourVision, expectedQualities, image) {
    vision = {
        definitionOfSuccess,
        yourVision,
        expectedQualities,
        image,
    };

    localStorage.setItem('vision', JSON.stringify(vision));
    displayVision();
    document.getElementById('vision-form').reset();
    toggleForm('vision-form'); // Hide the form after submission
}

// Function to display saved vision
function displayVision() {
    const savedVisionDiv = document.getElementById('saved-vision');
    savedVisionDiv.innerHTML = `
        <p><strong>Definition of Success:</strong> ${vision.definitionOfSuccess}</p>
        <p><strong>Your Vision:</strong> ${vision.yourVision}</p>
        <p><strong>Expected Qualities:</strong> ${vision.expectedQualities.join(', ')}</p>
        ${vision.image ? `<img src="${vision.image}" alt="Vision Image" style="max-width: 100%; border-radius: 8px; margin-top: 16px;">` : ''}
    `;
}

// Function to toggle form visibility
function toggleForm(formId) {
    const form = document.getElementById(formId);
    form.classList.toggle('hidden');
}

// Function to export data
function exportData() {
    const data = {
        profiles: JSON.parse(localStorage.getItem('profiles')) || [],
        vision: JSON.parse(localStorage.getItem('vision')) || {},
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'vision-webapp-backup.json';
    a.click();

    URL.revokeObjectURL(url);
}

// Function to import data
function importData() {
    const fileInput = document.getElementById('import-file');
    fileInput.click(); // Trigger the file input dialog

    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const data = JSON.parse(event.target.result);

                // Validate the imported data
                if (data.profiles && data.vision) {
                    localStorage.setItem('profiles', JSON.stringify(data.profiles));
                    localStorage.setItem('vision', JSON.stringify(data.vision));

                    // Refresh the displayed data
                    displayProfiles();
                    displayVision();
                    alert('Data imported successfully!');
                } else {
                    alert('Invalid data format. Please upload a valid backup file.');
                }
            } catch (error) {
                alert('Error parsing the file. Please ensure it is a valid JSON file.');
            }
        };

        reader.readAsText(file);
    });
}

// Display profiles and vision on page load
displayProfiles();
displayVision();