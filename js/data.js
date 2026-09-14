// Keerthana J - Portfolio Seed Data
// Pre-populated directly from resume with scalable schemas for CMS & Firebase

const DEFAULT_PORTFOLIO_DATA = {
  personal: {
    name: "Keerthana J",
    role: "Software Development Engineer (AI/ML)",
    subtitle: "Architecting Scalable Microservices, High-Performance APIs & Production AI Agents",
    location: "Bengaluru, Karnataka, India",
    phone: "+91 8438065272",
    email: "jkeerthana2004@gmail.com",
    linkedin: "https://linkedin.com/in/keerthanaj",
    github: "https://github.com/keerthanaj2004",
    twitter: "https://twitter.com",
    resumeUrl: "#resume-modal",
    avatar: "assets/avatar.jpg",
    summary: "Backend engineer with proven experience building scalable microservices and AI-powered applications using Java and Python. Skilled in REST API development, event-driven systems, and Retrieval Augmented Generation (RAG) based AI assistants. Experienced in developing production AI tools that improve customer support workflows and developer productivity.",
    quickStats: [
      { value: "65%", label: "Support Queries Automated" },
      { value: "60%", label: "Prompt Debugging Time Saved" },
      { value: "20+ FPS", label: "Real-time Emotion Pipeline" },
      { value: "80%", label: "LLM Manual Review Reduced" }
    ]
  },

  theme: {
    primaryColor: "#7C3AED",
    hoverColor: "#6D28D9",
    darkColor: "#4C1D95",
    lightColor: "#A855F7",
    softColor: "#F3E8FF",
    bgBody: "#FAF8FF",
    bgCard: "#FFFFFF",
    preset: "purple-white"
  },

  experience: [
    {
      id: "exp-1",
      role: "Software Development Engineer (AI/ML)",
      company: "Anugraha Exceed Pvt. Ltd.",
      location: "Bengaluru, India",
      period: "Oct 2024 – Present",
      isCurrent: true,
      technologies: [
        "Java (Spring Boot)",
        "Python (FastAPI/Flask)",
        "PostgreSQL",
        "Retrieval Augmented Generation (RAG)",
        "Redis",
        "Oracle SQL",
        "JWT"
      ],
      bullets: [
        "Designed and developed scalable RESTful APIs using Python, PostgreSQL, Oracle, and Redis, improving system performance, security, and maintainability.",
        "Developed and deployed an internal AI assistant that automated 65% of customer support queries and reduced average resolution time by 40%.",
        "Built enterprise reporting solutions, analytics dashboards, and Excel import/export frameworks for large-scale data processing and business insights.",
        "Led migration of selected backend components from Java to Python while maintaining system compatibility, and built secure, interoperable APIs with JWT authentication across both stacks."
      ]
    }
  ],

  projects: [
    {
      id: "proj-1",
      title: "Observe AI",
      tagline: "AI Monitoring & Evaluation Platform",
      category: "AI/ML & LLMs",
      description: "Enterprise AI observability and evaluation platform for LLM applications. Automatically tracks prompt regressions, identifies hallucination patterns, and runs an automated Gemini AI Judge to evaluate response correctness, relevance, completeness, and clarity.",
      technologies: [
        "Python",
        "FastAPI",
        "React",
        "MongoDB",
        "LangChain",
        "Google Gemini",
        "JWT",
        "Docker",
        "Pandas"
      ],
      bullets: [
        "Built an AI observability platform for LLM applications, enabling faster detection of prompt regressions, hallucinations, and response quality issues, reducing debugging time by 60%.",
        "Developed an AI Judge pipeline using Gemini to automate response evaluation, reducing manual review effort by 80% while ensuring consistent assessment of correctness, relevance, completeness, and clarity."
      ],
      image: "assets/observe_ai.jpg",
      githubUrl: "https://github.com/keerthanaj2004/observe-ai",
      liveUrl: "https://observeai-demo.web.app",
      featured: true,
      metrics: "60% Faster Debugging • 80% Less Manual Review"
    },
    {
      id: "proj-2",
      title: "RecruSkill",
      tagline: "AI Interview Simulator & Multi-modal Candidate Evaluation",
      category: "Computer Vision & Audio AI",
      description: "Intelligent interview simulator combining real-time facial emotion recognition, speech audio sentiment extraction, and automated technical questionnaire scoring to streamline hiring workflows.",
      technologies: [
        "Python",
        "Flask",
        "WebSockets",
        "OpenCV",
        "Wav2Vec2",
        "CNN",
        "Docker"
      ],
      bullets: [
        "Built a real-time facial emotion detection pipeline using OpenCV and CNN-based classification, processing webcam streams at 20+ FPS, and speech emotion recognition using Wav2Vec2.",
        "Implemented AI-driven resume screening and technical questionnaire modules, reducing recruiter screening time by 90% and accelerating the shortlisting process."
      ],
      image: "assets/recruskill.jpg",
      githubUrl: "https://github.com/keerthanaj2004/recruskill",
      liveUrl: "https://recruskill-demo.web.app",
      featured: true,
      metrics: "20+ FPS Realtime Vision • 90% Screening Time Saved"
    }
  ],

  skills: {
    "Backend Development": [
      "Spring Boot",
      "Flask",
      "FastAPI",
      "REST APIs",
      "Microservices Architecture",
      "API Integration",
      "JWT Auth"
    ],
    "AI & Machine Learning": [
      "TensorFlow",
      "Keras",
      "OpenCV",
      "Speech Emotion Recognition",
      "Large Language Models (LLMs)",
      "Retrieval Augmented Generation (RAG)",
      "LangChain",
      "Prompt Engineering",
      "Agentic AI"
    ],
    "Databases & Messaging": [
      "PostgreSQL",
      "MySQL",
      "Oracle SQL",
      "Redis",
      "ChromaDB",
      "Data Preprocessing",
      "Feature Engineering"
    ],
    "Tools & Cloud": [
      "AWS",
      "Git",
      "GitHub",
      "JIRA",
      "Docker",
      "Agile/Scrum"
    ],
    "Core Computer Science": [
      "Data Structures & Algorithms",
      "System Design",
      "Distributed Systems",
      "Object-Oriented Design",
      "Multithreading"
    ]
  },

  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Technology in Computer Science",
      institution: "Alliance University",
      location: "Bengaluru, Karnataka",
      period: "Sept 2021 – Jun 2025",
      score: "83.5%",
      highlights: "Core focus: Distributed Systems, Advanced Data Structures, Cloud Computing & Machine Learning."
    },
    {
      id: "edu-2",
      degree: "Higher Secondary (CBSE)",
      institution: "Asian Christian High School",
      location: "Hosur, Tamil Nadu",
      period: "Mar 2020 – Mar 2021",
      score: "94.2%",
      highlights: "High academic distinction with top honors in Mathematics and Computer Science."
    }
  ],

  achievements: [
    {
      id: "ach-1",
      title: "AWS Certified Cloud Practitioner",
      category: "Certification",
      issuer: "Amazon Web Services (AWS)",
      year: "2024",
      icon: "fa-brands fa-aws",
      badgeText: "Cloud Certified",
      link: "https://aws.amazon.com/certification/",
      description: "Validation of foundational cloud knowledge, security, architectural best practices, and high-availability systems."
    },
    {
      id: "ach-2",
      title: "Google Developer Students Club (GDSC) Lead",
      category: "Community Leadership",
      issuer: "Google Developers",
      year: "2023 – 2024",
      icon: "fa-brands fa-google",
      badgeText: "Leadership",
      link: "https://developers.google.com/community/gdsc",
      description: "Selected to head university GDSC chapter, conducting high-impact workshops in AI, Cloud Computing, and open-source software for 500+ student engineers."
    },
    {
      id: "ach-3",
      title: "IEEE Xplore Publication: AI-based Diet & Exercise Tracking",
      category: "Research Publication",
      issuer: "IEEE Xplore",
      year: "2024",
      icon: "fa-solid fa-book-open-reader",
      badgeText: "Published Paper",
      link: "https://ieeexplore.ieee.org",
      description: "Authored peer-reviewed paper examining neural networks and real-time vision algorithms for dietary evaluation and personalized fitness intelligence."
    }
  ],

  // Scalable sections for future growth
  blogs: [
    {
      id: "blog-1",
      title: "Architecting Resilient RAG Pipelines with Gemini and Vector Stores",
      category: "AI Engineering",
      date: "Oct 2024",
      readTime: "5 min read",
      summary: "Exploring context chunking, re-ranking strategies, and synthetic evaluation pipelines for high-reliability agentic applications.",
      link: "#",
      published: true
    },
    {
      id: "blog-2",
      title: "Migrating Production Microservices from Spring Boot to FastAPI",
      category: "System Design",
      date: "Jan 2025",
      readTime: "7 min read",
      summary: "Lessons learned maintaining dual-stack JWT interoperability, connection pooling, and latency profiling during large-scale migrations.",
      link: "#",
      published: true
    }
  ],

  testimonials: [
    {
      id: "test-1",
      author: "Engineering Lead",
      role: "Senior Staff Architect",
      company: "Anugraha Exceed Pvt. Ltd.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      quote: "Keerthana is one of the quickest learners I have worked with. Her work on automated AI support and backend microservice migration delivered quantifiable impact to our core systems."
    }
  ],

  // Contact inquiries submitted through portfolio
  messages: []
};

// Export for ES modules and window object for browser compatibility
if (typeof window !== "undefined") {
  window.DEFAULT_PORTFOLIO_DATA = DEFAULT_PORTFOLIO_DATA;
}
