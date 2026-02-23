export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface Experience {
  company: string;
  title: string;
  period: string;
  description: string;
  technologies: string[];
  type: "work" | "academic" | "internship";
}

export interface Project {
  title: string;
  year: string;
  category: string;
  description: string;
  longDescription: string;
  technologies: string[];
  image: string;
  gallery?: string[];
  url?: string;
  github?: string;
  featured: boolean;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export const personalInfo = {
  name: "Jorge Renato Leon",
  fullName: "Jorge Renato Leon Chumpitaz",
  roles: [
    "Fullstack Developer",
    "Software Engineer",
    "Informatics Engineer",
  ],
  tagline:
    "Building modern, performant web applications with TypeScript, React, and Next.js. Passionate about clean architecture, testing, and user experience.",
  bio: "I'm a Fullstack Developer and Informatics Engineer graduated from PUCP (Pontificia Universidad Catolica del Peru). Currently pursuing my Master's degree, focusing on Digital Product Passport interoperability for my thesis research. I thrive on solving complex problems with clean, well-tested code and I'm always eager to learn and share knowledge.",
  email: "jrleonchumpitaz@gmail.com",
  avatar: "https://avatars.githubusercontent.com/u/48967680?v=4",
  location: "Lima, Peru",
  social: [
    {
      name: "GitHub",
      url: "https://github.com/JorgeRenatoLeon",
      icon: "github",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/jorgerenatoleon",
      icon: "linkedin",
    },
    {
      name: "Email",
      url: "mailto:jrleonchumpitaz@gmail.com",
      icon: "mail",
    },
  ] satisfies SocialLink[],
  highlights: [
    { label: "Years of Experience", value: "5+" },
    { label: "Projects Delivered", value: "10+" },
    { label: "Tests Written", value: "1100+" },
    { label: "Technologies", value: "20+" },
  ],
};

export const experiences: Experience[] = [
  {
    company: "Software FX",
    title: "Frontend Developer",
    period: "Jul 2021 - Present",
    description:
      "Develop and maintain enterprise-grade web applications using Vue.js and modern JavaScript frameworks. Build responsive, accessible interfaces following best practices. Collaborate with cross-functional teams to deliver software solutions for data visualization and business intelligence products.",
    technologies: [
      "Vue.js",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS3",
      "REST API",
      "Webflow",
    ],
    type: "work",
  },
  {
    company: "PUCP",
    title: "Teaching Assistant",
    period: "Dec 2020 - Present",
    description:
      "Lead practice sessions and labs for undergraduate courses in Programming Fundamentals (C) and Software Development. Mentor students on design sprints, agile methodologies, and software engineering principles. Grade assignments and provide technical feedback.",
    technologies: [
      "C",
      "Software Development",
      "Design Sprint",
      "Agile",
    ],
    type: "academic",
  },
  {
    company: "IBM",
    title: "Developer Advocate Student",
    period: "Dec 2020 - Dec 2021",
    description:
      "Promoted IBM Cloud technologies through technical workshops, demos, and content creation. Built proof-of-concept applications using React and Spring on IBM Cloud infrastructure. Engaged with the developer community to drive cloud platform adoption.",
    technologies: [
      "IBM Cloud",
      "React",
      "Spring",
      "JavaScript",
    ],
    type: "work",
  },
  {
    company: "Neotech Mexico",
    title: "Google Cloud Intern",
    period: "Jul 2020 - Oct 2020",
    description:
      "Completed Google Cloud engineering internship developing cloud-based web solutions. Worked with serverless architectures and cloud deployment pipelines. Built frontend interfaces using modern web technologies.",
    technologies: [
      "Google Cloud",
      "PHP",
      "HTML5",
      "CSS3",
      "Bootstrap",
    ],
    type: "internship",
  },
  {
    company: "DTI - PUCP",
    title: "Information Security Intern",
    period: "Jul 2019 - Dec 2019",
    description:
      "Supported the IT Security department in managing access controls and security audits for the university's Oracle ERP system. Analyzed security logs and generated compliance reports.",
    technologies: ["Oracle ERP", "SQL", "Security Auditing"],
    type: "internship",
  },
];

export const projects: Project[] = [
  {
    title: "DPP Interoperability Platform",
    year: "2026",
    category: "Fullstack / Semantic Web",
    description:
      "Master's thesis project: an interoperability platform for Digital Product Passports with identifier resolution and payload normalization microservices.",
    longDescription:
      "Built and evaluated an interoperability platform for Digital Product Passports as part of my Master's thesis using Design Science Research. The platform features an Identifier Resolution Service (heterogeneous IDs to canonical Passport ID with confidence scoring) and a DPP Normalizer Service (initiative payloads to a Shared Core Schema with provenance tracking). Includes 4 OWL/RDFS vocabularies, JSON-LD 1.1 contexts, SPARQL endpoints, and a full Next.js web client with 19 routes. 512 TypeScript/Vitest tests across the three-repo architecture.",
    technologies: [
      "TypeScript",
      "Next.js",
      "Node.js",
      "JSON-LD",
      "SPARQL",
      "OWL/RDFS",
      "Vitest",
      "Tailwind CSS",
      "Vercel",
      "TriplyDB",
    ],
    image: "/img/projects/dpp/Home.png",
    gallery: [
      "/img/projects/dpp/Home.png",
    ],
    url: "https://www.dpp-interoperability.wiki/",
    featured: true,
  },
  {
    title: "TravelApp",
    year: "2026",
    category: "Fullstack / UI Design",
    description:
      "Budget-flexible travel discovery platform that surfaces the cheapest destinations as round trips with stopover optimization and visa information.",
    longDescription:
      "A consumer-facing web application that solves budget travel discovery for flexible travelers. Features include a Budget Round Trip Explorer (open-destination discovery), Stopover Route Optimizer (deliberate layover planning that reduces cost), Total Cost View (flights + accommodation), and inline visa requirements by nationality. Built with Next.js App Router, TypeScript, Tailwind CSS, Zustand, Framer Motion, and react-map-gl. 621 tests across frontend (568) and microservices (53). Deployed on Vercel with Kiwi and Amadeus API integrations.",
    technologies: [
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Framer Motion",
      "Zustand",
      "Vitest",
      "Mapbox GL",
      "Vercel",
    ],
    image: "/img/projects/travelapp/Home.png",
    gallery: [
      "/img/projects/travelapp/Home.png",
    ],
    url: "https://travel-app-kappa-snowy.vercel.app/",
    featured: true,
  },
  {
    title: "PUCP-IN",
    year: "2022",
    category: "Fullstack / PWA",
    description:
      "Progressive web application for managing physical access control across university infrastructure, tracking 3,200+ users.",
    longDescription:
      "PUCP-IN is a progressive web application that helps educational institutions manage access to every space in their infrastructure. Developed the web app frontend using React, RESTful APIs using Spring and data storage in MySQL following best practices and agile methodology. This application helped PUCP track over 3,200 students, teachers, and administrators in the Science and Engineering faculty during the second semester of 2022.",
    technologies: [
      "React",
      "JavaScript",
      "Spring Boot",
      "Java",
      "MySQL",
      "AWS",
    ],
    image: "/img/projects/pucpin/PUCP-IN.png",
    gallery: [
      "/img/projects/pucpin/PUCP-IN.png",
      "/img/projects/pucpin/Home.png",
      "/img/projects/pucpin/Capacity.png",
      "/img/projects/pucpin/QR.png",
    ],
    url: "https://pucp.in/",
    featured: true,
  },
  {
    title: "Digital Voting System",
    year: "2021",
    category: "Fullstack / Security",
    description:
      "Secure digital voting web application with two-step authentication, candidate management, and real-time results dashboard.",
    longDescription:
      "Undergraduate thesis project for a digital voting system through a web application. Features secure voting with two-step authentication, candidates management, and a process administrator dashboard. The solution was developed based on the CIP (Colegio de Ingenieros del Peru), with user research conducted through interviews with administrators and members of the institution.",
    technologies: [
      "React",
      "JavaScript",
      "Spring Boot",
      "Java",
      "MySQL",
      "AWS",
    ],
    image: "/img/projects/digitalvoting/SignIn.png",
    gallery: [
      "/img/projects/digitalvoting/SignIn.png",
      "/img/projects/digitalvoting/Vote.png",
      "/img/projects/digitalvoting/Results.png",
      "/img/projects/digitalvoting/Search.png",
      "/img/projects/digitalvoting/Profile.png",
    ],
    url: "https://gitlab.com/DigitalVoting",
    featured: false,
  },
  {
    title: "Assistance",
    year: "2020",
    category: "Fullstack / EdTech",
    description:
      "Tutoring management platform for scheduling appointments and tracking student progress, serving 100+ students during the pandemic.",
    longDescription:
      "Assistance is a web application that helps educational institutions manage the tutoring process by providing a simple platform to schedule appointments and track student goals. Developed the frontend using Vue.js, RESTful APIs using Laravel, and data storage in PostgreSQL following agile methodology. Helped PUCP track over 100 students in their tutoring process during the start of the pandemic.",
    technologies: [
      "Vue.js",
      "JavaScript",
      "Laravel",
      "PHP",
      "PostgreSQL",
      "AWS",
    ],
    image: "/img/projects/assistance/HomePage.jpg",
    gallery: [
      "/img/projects/assistance/HomePage.jpg",
      "/img/projects/assistance/Login.jpg",
      "/img/projects/assistance/Calendar.jpg",
      "/img/projects/assistance/Cita.jpg",
      "/img/projects/assistance/Admin.jpg",
    ],
    url: "https://tutoriafront.inf.pucp.edu.pe/",
    featured: false,
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    skills: [
      "TypeScript",
      "JavaScript",
      "Java",
      "Python",
      "PHP",
      "C",
      "SQL",
    ],
  },
  {
    name: "Frontend",
    skills: [
      "React",
      "Next.js",
      "Vue.js",
      "Tailwind CSS",
      "Framer Motion",
      "HTML5",
      "CSS3",
      "SCSS",
    ],
  },
  {
    name: "Backend",
    skills: [
      "Node.js",
      "Spring Boot",
      "Laravel",
      "Express",
      "REST APIs",
    ],
  },
  {
    name: "Databases",
    skills: ["MySQL", "PostgreSQL", "Supabase", "MongoDB"],
  },
  {
    name: "Cloud & DevOps",
    skills: [
      "AWS",
      "Google Cloud",
      "IBM Cloud",
      "Vercel",
      "Docker",
      "GitHub Actions",
    ],
  },
  {
    name: "Semantic Web",
    skills: ["JSON-LD", "SPARQL", "OWL/RDFS", "TriplyDB", "RDF"],
  },
  {
    name: "Testing",
    skills: [
      "Vitest",
      "React Testing Library",
      "Jest",
      "TDD",
    ],
  },
  {
    name: "Tools",
    skills: ["Git", "GitHub", "VS Code", "Figma", "Jira"],
  },
];
