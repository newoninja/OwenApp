// --- Global State for Roadmap Data ---
let currentRoadmapText = ""; 

// --- Firebase Setup (removed import lines to avoid error, as config data is missing) ---
// Note: If you have a working Firebase setup, re-integrate the initialization code here 
// *without* the authentication logic that relies on unexposed tokens/config.
// For now, only the core UI logic is kept.
document.getElementById('current-year').textContent = new Date().getFullYear();

// --- Sticky Header Scroll Logic ---
const header = document.getElementById('main-header');
const scrollThreshold = 50; 

window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled-header');
    } else {
        header.classList.remove('scrolled-header');
    }
});

// --- Smooth Scroll Logic ---
const logoLink = document.getElementById('logo-link');
if (logoLink) {
    logoLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

const demoButton = document.getElementById('demo-button');
if (demoButton) {
    demoButton.addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('demo').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

const navLinks = document.querySelectorAll('#main-nav a[href^="#"]');
navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// --- Roadmap Generation Logic (Client-Side) ---
const businessInput = document.getElementById('business-input');
const problemInput = document.getElementById('problem-input');
const generateButton = document.getElementById('generate-button');

const checkInputs = () => {
    generateButton.disabled = !(businessInput.value.trim().length > 3 && problemInput.value.trim().length > 10);
};
businessInput.addEventListener('input', checkInputs);
problemInput.addEventListener('input', checkInputs);

window.generateRoadmap = async function() {
    const business = businessInput.value.trim();
    const problem = problemInput.value.trim();
    if (!business || !problem) return;

    const query = { business: business, problem: problem };

    // UI State Management
    const resultDiv = document.getElementById('roadmap-result');
    const loadingDiv = document.getElementById('loading-indicator');
    const errorDiv = document.getElementById('error-message');
    const roadmapList = document.getElementById('roadmap-list');

    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    roadmapList.innerHTML = '';
    loadingDiv.classList.remove('hidden');
    generateButton.disabled = true;

    try {
        // *** SECURITY FIX: CALLING A SECURE BACKEND ENDPOINT INSTEAD OF THE AI API DIRECTLY ***
        const response = await fetch('/api/generate-roadmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query)
        });

        if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
        
        const roadmapSteps = await response.json();

        if (Array.isArray(roadmapSteps) && roadmapSteps.length === 3) {
            let roadmapTextFormatted = `Roadmap for ${business} (Problem: ${problem}):\n\n`;
            
            roadmapSteps.forEach((step, index) => {
                const li = document.createElement('li');
                // Note: The backend should return HTML-safe strings (e.g., strong tags are fine)
                li.innerHTML = step;
                roadmapList.appendChild(li);
                roadmapTextFormatted += `Step ${index + 1}: ${step.replace(/<\/?strong>/g, '')}\n`; // Clean HTML tags for email
            });
            
            currentRoadmapText = roadmapTextFormatted;
            resultDiv.classList.remove('hidden');
            document.getElementById('contact-roadmap-button').scrollIntoView({ behavior: 'smooth', block: 'end' });

        } else {
            throw new Error("Invalid roadmap structure received from server.");
        }

    } catch (e) {
        console.error("Roadmap generation failed:", e);
        errorDiv.classList.remove('hidden');
        roadmapList.innerHTML = '<li class="text-red-400">Could not generate roadmap. The server may be down or the request was invalid.</li>';

    } finally {
        loadingDiv.classList.add('hidden');
        generateButton.disabled = false;
    }
}

// Function to initiate email with roadmap content
window.contactAboutRoadmap = function() {
    if (!currentRoadmapText) return;

    const subject = "Proposal Inquiry: Custom Automation Roadmap (Generated on Site)";
    
    const body = `Hello SynthFlow AI Engineer,\n\nI would like to discuss the following automation roadmap, which I generated using the demo on your website:\n\n---\n${currentRoadmapText}\n\n---\n\nI'm ready to move forward and discuss implementation details for my business. Please let me know your availability for a quick discovery call.\n\nThank you!`;
    
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    window.location.href = `mailto:newoninja@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
};


// --- Project and Skill Modal Data/Logic ---

// Project Data (No Change)
const projectData = {
    'faq': {
        title: "Automated FAQ Generator (Case Study)",
        content: `<p><strong>The Challenge:</strong> A mid-sized e-commerce client was spending 15 hours/week manually drafting replies to repetitive support questions, leading to slow response times and employee burnout.</p><p><strong>The SynthFlow Solution:</strong> I built a custom Gemini-powered chatbot integrated directly into their internal knowledge base. The key was expert Prompt Engineering to ensure accurate, on-brand, and empathetic responses, significantly reducing the "robotic" feel.</p><p><strong>The Outcome:</strong> Support team workload was reduced by 60%, and customer satisfaction scores increased by 8% due to faster, high-quality responses. This is a perfect example of automating a high-volume, low-complexity process to reduce user error and save time.</p><p class="text-cyan-400 font-bold mt-4">Technologies Used: Gemini API, custom Python backend, Slack/Intercom API (Vibe Code).</p>`
    },
    'data-sync': {
        title: "Multi-System Data Synchronization (Case Study)",
        content: `<p><strong>The Challenge:</strong> A legacy manufacturing system needed to share inventory and order data with a modern cloud-based CRM. Employees were manually copying data between the two systems daily, resulting in frequent (and expensive) transposition errors.</p><p><strong>The SynthFlow Solution:</strong> Using Vibe Code and light Python scripting, I established a secure, real-time API connection between the two systems. The custom integration included data validation checks to ensure zero errors during transit.</p><p><strong>The Outcome:</strong> Data entry errors related to this process were eliminated (100% reduction). The time saved from manual input was reallocated to strategic planning. This project demonstrates complex integration using minimal, efficient code.</p><p class="text-cyan-400 font-bold mt-4">Technologies Used: Zapier/Make (Vibe Code), REST APIs, JavaScript functions for data cleaning).</p>`
    },
    'inventory': {
        title: "Vibe-Coded Inventory Monitor (Case Study)",
        content: `<p><strong>The Challenge:</strong> A small retail manager kept forgetting to manually check inventory sheets and often missed reorder deadlines, leading to stockouts.</p><p><strong>The SynthFlow Solution:</strong> I created a scheduled script that reads the inventory spreadsheet daily. When stock drops below a threshold, it uses a Prompt Engineered call to draft a personalized, urgent reorder email to the supplier, complete with a polite, professional tone.</p><p><strong>The Outcome:</strong> Stockouts were virtually eliminated, protecting revenue. The manager gained peace of mind and only needed to review and click 'Send.' This is automation as an invisible, helpful assistant—zero user error.</p><p class="text-cyan-400 font-bold mt-4">Technologies Used: Google Sheets API, Gmail API, Gemini API (for email drafting), Node.js for scheduling).</p>`
    }
};

window.showProjectDetails = function(projectId) {
    const data = projectData[projectId];
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-content').innerHTML = data.content;
    document.getElementById('project-modal').classList.remove('hidden');
};

// Skill Data (Updated)
const skillData = {
    'prompt-engineering': {
        title: "Deep Dive: Prompt Engineering",
        content: `
            <p class="font-semibold text-white">The AI Whisperer.</p>
            <p>I engineer highly specific instructions to ensure LLMs deliver reliable, production-ready output, every single time. Key deliverables include Structured Output (guaranteed JSON/XML for system ingestion) and Grounding Control (reducing hallucinations).</p>
            <p class="text-cyan-400 font-bold mt-3">Value: Turns unpredictable AI tools into reliable, repeatable business assets.</p>
        `
    },
    'vibe-code': {
        title: "Deep Dive: Vibe Code & APIs",
        content: `
            <p class="font-semibold text-white">The Connector.</p>
            <p>Vibe Code is the art of connecting platforms without heavy, custom backend development. I build bridges between CRMs, financial tools, and custom scripts using low-code orchestration (Zapier/Make) and direct API calls.</p>
            <p class="text-cyan-400 font-bold mt-3">Value: Achieve high-level automation quickly and affordably, leveraging the tools you already pay for.</p>
        `
    },
    'full-stack': {
        title: "Deep Dive: Full-Stack Coding",
        content: `
            <p class="font-semibold text-white">The Custom Builder.</p>
            <p>When off-the-shelf tools aren't enough, I build custom solutions from the ground up: Python for data cleaning and scheduled tasks, JavaScript for custom web apps, and Firestore for secure, scalable data storage.</p>
            <p class="text-cyan-400 font-bold mt-3">Value: Complete flexibility to tackle any technical challenge, ensuring long-term scalability.</p>
        `
    }
};

// Function to toggle skill details inline
window.toggleSkillDetails = function(skillId) {
    // Get the element IDs based on the consistent skillId structure
    const detailsId = `skill-${skillId}-details`;
    const detailsDiv = document.getElementById(detailsId);

    const data = skillData[skillId];
    
    // Hide all others
    document.querySelectorAll('.skill-details').forEach(div => {
        if (div.id !== detailsId && !div.classList.contains('hidden')) {
            div.classList.add('hidden');
        }
    });

    // Safety check for critical elements
    if (!detailsDiv) return; 

    if (detailsDiv.classList.contains('hidden')) {
        // Show
        detailsDiv.innerHTML = data.content;
        detailsDiv.classList.remove('hidden');
    } else {
        // Hide
        detailsDiv.classList.add('hidden');
    }
};