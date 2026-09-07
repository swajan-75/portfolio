import {
  PrismaClient,
  SkillCategory,
  ProjectCategory,
  ProjectStatus,
  EmploymentType,
} from '../generated/prisma/client';
import * as bcrypt from 'bcryptjs';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedAdmin() {
  const email = 'swajanbarua09@gmail.com';
  const plainPassword = '348025@niceNice';

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      password: hashedPassword,
    },
  });

  console.log('Seeded admin:', admin.email);
}

async function seedProfile() {
  // Single-profile portfolio: wipe and recreate. SocialLink / ProfileSkillCategory
  // (and its nested skills) cascade-delete with the profile per schema.prisma.
  await prisma.profile.deleteMany({});

  const profile = await prisma.profile.create({
    data: {
      fullName: 'Swajan Barua',
      headline: 'Full-Stack Engineer',
      subtitle: 'NestJS • Next.js • FastAPI',
      bio: 'Motivated Computer Science & Engineering graduate (AIUB, 2026) with professional experience building and deploying production-grade web applications in fast-paced startup environments. Specialized in full-stack development using Next.js, FastAPI, Python, and PostgreSQL. Passionate about designing reliable REST APIs, dynamic user interfaces, and scalable architectures, with a strong eagerness to learn, contribute, and solve real-world engineering problems within a growing team.',
      location: 'Dhaka, Bangladesh',
      email: 'swajanbarua09@gmail.com',
      availableFor: 'Full-time roles & freelance projects',
      educationInfo: {
        degree: 'BSc in Computer Science & Engineering',
        institution: 'American International University-Bangladesh (AIUB)',
      },
      techTags: [
        'TypeScript',
        'Next.js',
        'NestJS',
        'FastAPI',
        'PostgreSQL',
        'Redis',
        'Docker',
        'Python',
        'REST API',
        'WebSockets',
      ],
      stats: [
        { value: '4+', label: 'Projects Shipped' },
        { value: '3.83/4.00', label: "CGPA (Dean's List)" },
        { value: '1000+', label: 'Users Reached (AiubBuddy)' },
        { value: '17th/100+', label: 'Programming Contest Rank' },
      ],
      highlights: [
        {
          title: "Dean's List Honors",
          value: 'Fall 2023-24',
          subtext: 'CGPA 3.83/4.00 at AIUB',
        },
        {
          title: 'Programming Contest',
          value: '17th / 100+',
          subtext: 'AIUB CS Fest Programming Contest 2024',
        },
        {
          title: 'Robotics Competition',
          value: '2nd Round',
          subtext: 'AIUB CS Fest Robo Soccer Competition 2024',
        },
      ],
      socialLinks: {
        create: [
          { platform: 'github', url: 'https://github.com/swajan-75', order: 0 },
          {
            platform: 'linkedin',
            url: 'https://linkedin.com/in/swajan-barua09',
            order: 1,
          },
          { platform: 'website', url: 'https://swajan.dev/', order: 2 },
          {
            platform: 'email',
            url: 'mailto:swajanbarua09@gmail.com',
            order: 3,
          },
        ],
      },
      skillCategories: {
        create: [
          {
            title: 'Languages & Environments',
            order: 0,
            skills: {
              create: [
                'JavaScript',
                'TypeScript',
                'Python',
                'C/C++',
                'Go',
                'Java',
                'Node.js',
              ].map((name, order) => ({ name, order })),
            },
          },
          {
            title: 'Frameworks & Libraries',
            order: 1,
            skills: {
              create: [
                'NestJS',
                'Next.js',
                'FastAPI',
                'React.js',
                'Gin',
                'Retrofit',
              ].map((name, order) => ({ name, order })),
            },
          },
          {
            title: 'Databases & Caching',
            order: 2,
            skills: {
              create: [
                'PostgreSQL',
                'MySQL',
                'Redis',
                'Prisma',
                'Firebase (Firestore/FCM/Auth)',
                'SQLite',
              ].map((name, order) => ({ name, order })),
            },
          },
          {
            title: 'Tools & DevOps',
            order: 3,
            skills: {
              create: [
                'Git',
                'GitHub',
                'Docker',
                'Docker Compose',
                'Postman',
                'Android Studio',
                'Linux/Unix CLI',
              ].map((name, order) => ({ name, order })),
            },
          },
          {
            title: 'Concepts & Patterns',
            order: 4,
            skills: {
              create: [
                'REST API Design',
                'WebSockets / Real-time Systems',
                'MVVM',
                'RBAC',
                'JWT Authentication',
                'AI Integration (LLM APIs)',
              ].map((name, order) => ({ name, order })),
            },
          },
          {
            title: 'Scripting & Protocols',
            order: 5,
            skills: {
              create: [
                'Bash',
                'PowerShell',
                'Regex',
                'JSON',
                'Markdown',
                'OTP/SMTP',
                'OAuth 2.0',
              ].map((name, order) => ({ name, order })),
            },
          },
        ],
      },
    },
  });

  console.log('Seeded profile:', profile.fullName);
}

interface SkillSeed {
  name: string;
  category: SkillCategory;
  description: string;
  url?: string;
  proficiency: number;
  featured: boolean;
}

const SKILLS: SkillSeed[] = [
  {
    name: 'TypeScript',
    category: SkillCategory.LANGUAGE,
    description:
      'A strongly typed superset of JavaScript that compiles to plain JS, catching bugs before they ship.',
    url: 'https://www.typescriptlang.org/',
    proficiency: 5,
    featured: true,
  },
  {
    name: 'JavaScript',
    category: SkillCategory.LANGUAGE,
    description:
      'The core scripting language of the web, powering everything from UI interactions to full backend services.',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    proficiency: 5,
    featured: true,
  },
  {
    name: 'Python',
    category: SkillCategory.LANGUAGE,
    description:
      'A readable, general-purpose language used here for APIs, automation, and AI integration work.',
    url: 'https://www.python.org/',
    proficiency: 4,
    featured: true,
  },
  {
    name: 'Go',
    category: SkillCategory.LANGUAGE,
    description:
      'A compiled, statically typed language built for fast, concurrent backend services and CLI tools.',
    url: 'https://go.dev/',
    proficiency: 3,
    featured: false,
  },
  {
    name: 'Java',
    category: SkillCategory.LANGUAGE,
    description:
      'A mature, object-oriented language used for robust, large-scale backend and Android development.',
    url: 'https://www.java.com/',
    proficiency: 3,
    featured: false,
  },
  {
    name: 'C/C++',
    category: SkillCategory.LANGUAGE,
    description:
      'Low-level systems languages used for performance-critical logic and competitive programming.',
    url: 'https://isocpp.org/',
    proficiency: 3,
    featured: false,
  },
  {
    name: 'Kotlin',
    category: SkillCategory.LANGUAGE,
    description:
      'A modern, concise language for native Android apps, fully interoperable with Java.',
    url: 'https://kotlinlang.org/',
    proficiency: 3,
    featured: false,
  },
  {
    name: 'Next.js',
    category: SkillCategory.FRONTEND,
    description:
      'A React framework with file-based routing, SSR/SSG, and API routes — the frontend framework behind this portfolio.',
    url: 'https://nextjs.org/',
    proficiency: 5,
    featured: true,
  },
  {
    name: 'React.js',
    category: SkillCategory.FRONTEND,
    description: 'A component-based UI library for building fast, interactive interfaces.',
    url: 'https://react.dev/',
    proficiency: 4,
    featured: true,
  },
  {
    name: 'NestJS',
    category: SkillCategory.BACKEND,
    description:
      'A progressive Node.js framework for building scalable, well-structured REST APIs — the backend behind this portfolio.',
    url: 'https://nestjs.com/',
    proficiency: 5,
    featured: true,
  },
  {
    name: 'FastAPI',
    category: SkillCategory.BACKEND,
    description:
      'A modern Python web framework for building high-performance APIs with automatic docs.',
    url: 'https://fastapi.tiangolo.com/',
    proficiency: 4,
    featured: true,
  },
  {
    name: 'Node.js',
    category: SkillCategory.BACKEND,
    description:
      'A JavaScript runtime for building fast, event-driven backend services outside the browser.',
    url: 'https://nodejs.org/',
    proficiency: 4,
    featured: false,
  },
  {
    name: 'Gin',
    category: SkillCategory.BACKEND,
    description: 'A lightweight, high-performance HTTP web framework for Go.',
    url: 'https://gin-gonic.com/',
    proficiency: 2,
    featured: false,
  },
  {
    name: 'PostgreSQL',
    category: SkillCategory.DATABASE,
    description:
      'A powerful open-source relational database used for most of the production data behind this site.',
    url: 'https://www.postgresql.org/',
    proficiency: 5,
    featured: true,
  },
  {
    name: 'MySQL',
    category: SkillCategory.DATABASE,
    description: 'A widely used open-source relational database for structured application data.',
    url: 'https://www.mysql.com/',
    proficiency: 3,
    featured: false,
  },
  {
    name: 'Redis',
    category: SkillCategory.DATABASE,
    description: 'An in-memory data store used for caching, rate limiting, and real-time features.',
    url: 'https://redis.io/',
    proficiency: 4,
    featured: true,
  },
  {
    name: 'Prisma',
    category: SkillCategory.DATABASE,
    description:
      "A type-safe ORM for Node.js and TypeScript, used to model and query this project's database.",
    url: 'https://www.prisma.io/',
    proficiency: 4,
    featured: true,
  },
  {
    name: 'Firebase',
    category: SkillCategory.DATABASE,
    description: 'A managed backend platform used for auth, storage, and real-time data in smaller projects.',
    url: 'https://firebase.google.com/',
    proficiency: 3,
    featured: false,
  },
  {
    name: 'SQLite',
    category: SkillCategory.DATABASE,
    description: 'A lightweight, file-based SQL database ideal for local development and small apps.',
    url: 'https://www.sqlite.org/',
    proficiency: 3,
    featured: false,
  },
  {
    name: 'Docker',
    category: SkillCategory.DEVOPS,
    description: 'A containerization platform used to package and deploy applications consistently.',
    url: 'https://www.docker.com/',
    proficiency: 4,
    featured: true,
  },
  {
    name: 'Git',
    category: SkillCategory.DEVOPS,
    description: 'A distributed version control system used to track and collaborate on every project.',
    url: 'https://git-scm.com/',
    proficiency: 5,
    featured: false,
  },
  {
    name: 'GitHub',
    category: SkillCategory.DEVOPS,
    description: 'A hosting platform for Git repositories, code review, and CI/CD workflows.',
    url: 'https://github.com/',
    proficiency: 5,
    featured: false,
  },
  {
    name: 'Linux/Unix CLI',
    category: SkillCategory.DEVOPS,
    description:
      'Comfortable working directly in the shell — process management, scripting, and server administration.',
    proficiency: 4,
    featured: false,
  },
  {
    name: 'AI Integration (LLM APIs)',
    category: SkillCategory.AI_ML,
    description:
      'Integrating large language model APIs into products, from chat assistants to automated support agents.',
    proficiency: 4,
    featured: true,
  },
  {
    name: 'Postman',
    category: SkillCategory.TOOLING,
    description: 'An API client used to design, test, and document REST endpoints.',
    url: 'https://www.postman.com/',
    proficiency: 4,
    featured: false,
  },
  {
    name: 'Android Studio',
    category: SkillCategory.TOOLING,
    description: 'The official IDE for building native Android applications.',
    url: 'https://developer.android.com/studio',
    proficiency: 3,
    featured: false,
  },
  {
    name: 'Retrofit',
    category: SkillCategory.OTHER,
    description: 'A type-safe HTTP client for Android used to consume REST APIs.',
    url: 'https://square.github.io/retrofit/',
    proficiency: 2,
    featured: false,
  },
  {
    name: 'REST API Design',
    category: SkillCategory.OTHER,
    description: 'Designing clean, predictable, and well-documented REST APIs for real-world products.',
    proficiency: 5,
    featured: true,
  },
  {
    name: 'WebSockets / Real-time Systems',
    category: SkillCategory.OTHER,
    description:
      'Building real-time features like live notifications and chat using persistent socket connections.',
    proficiency: 4,
    featured: true,
  },
  {
    name: 'Socket.io',
    category: SkillCategory.OTHER,
    description: 'A library for building real-time, bidirectional communication between client and server.',
    url: 'https://socket.io/',
    proficiency: 3,
    featured: false,
  },
  {
    name: 'JWT Authentication',
    category: SkillCategory.OTHER,
    description: 'Stateless, token-based authentication used to secure APIs and admin sessions.',
    proficiency: 4,
    featured: false,
  },
  {
    name: 'OAuth 2.0',
    category: SkillCategory.OTHER,
    description: 'An industry-standard authorization protocol used for secure third-party login flows.',
    url: 'https://oauth.net/2/',
    proficiency: 4,
    featured: false,
  },
  {
    name: 'RBAC',
    category: SkillCategory.OTHER,
    description: 'Role-based access control used to restrict features and data by user role.',
    proficiency: 3,
    featured: false,
  },
  {
    name: 'MVVM',
    category: SkillCategory.OTHER,
    description: 'An architectural pattern separating UI, state, and business logic for maintainable apps.',
    proficiency: 3,
    featured: false,
  },
  {
    name: 'OTP/SMTP',
    category: SkillCategory.OTHER,
    description: 'One-time password flows delivered over SMTP email for secure, passwordless verification.',
    proficiency: 3,
    featured: false,
  },
];

async function seedSkills() {
  for (const [order, skill] of SKILLS.entries()) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {
        category: skill.category,
        description: skill.description,
        url: skill.url,
        proficiency: skill.proficiency,
        featured: skill.featured,
        order,
      },
      create: { ...skill, order },
    });
  }

  console.log(`Seeded ${SKILLS.length} skills`);
}

interface ProjectSeed {
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  techStack: string[];
  skillNames: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  startDate: Date;
  endDate: Date | null;
}

const PROJECTS: ProjectSeed[] = [
  {
    title: 'LyfFlow – AI-Powered Social Media Customer Support',
    slug: 'lyfflow',
    summary:
      'SaaS platform letting businesses connect Facebook/Instagram and deploy AI agents for automated customer support.',
    description:
      'Worked as backend engineer on a SaaS startup that lets businesses connect their Facebook and Instagram accounts and deploy AI agents to handle customer support and product queries automatically. Built the FastAPI backend, LLM integration layer, and Meta Graph API connection with OAuth 2.0, solving the challenge of ingesting social media messages in real time and routing them to the right AI agent per channel. Designed a multi-tenant PostgreSQL schema that keeps each business’s data, agents, and conversation history fully isolated, making the platform scalable to multiple clients from a single deployment.',
    category: ProjectCategory.BACKEND,
    status: ProjectStatus.LIVE,
    techStack: [
      'FastAPI',
      'PostgreSQL',
      'Python',
      'OpenAI/LLM APIs',
      'Meta Graph API',
      'OAuth 2.0',
    ],
    skillNames: [
      'FastAPI',
      'PostgreSQL',
      'Python',
      'AI Integration (LLM APIs)',
      'OAuth 2.0',
    ],
    liveUrl: 'https://www.lyfflow.com/app',
    featured: true,
    order: 0,
    startDate: new Date('2025-12-01'),
    endDate: null,
  },
  {
    title: 'Rosee – Full-Stack B2C E-Commerce Platform',
    slug: 'rosee',
    summary:
      'Production B2C e-commerce platform with real-time low-stock alerts and role-based admin access.',
    description:
      'Developed a production-ready B2C e-commerce platform with a Next.js frontend and a modular NestJS REST API. Implemented comprehensive features including order management, dynamic product catalogs, customer accounts, and role-based access control for admins and moderators. Optimized platform performance under high traffic by implementing Redis caching to reduce database load, and integrated Socket.io to provide administrators with instant, real-time low-stock notifications. Secured the platform by implementing bcrypt-hashed OTPs, JWT via HTTP-only cookies, rate limiting, and Google OAuth.',
    category: ProjectCategory.FULLSTACK,
    status: ProjectStatus.LIVE,
    techStack: [
      'Next.js',
      'NestJS',
      'TypeScript',
      'PostgreSQL',
      'Redis',
      'Socket.io',
      'Docker',
    ],
    skillNames: [
      'Next.js',
      'NestJS',
      'TypeScript',
      'PostgreSQL',
      'Redis',
      'Socket.io',
      'Docker',
    ],
    liveUrl: 'https://rosee.bd/',
    featured: true,
    order: 1,
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-05-31'),
  },
  {
    title: 'AiubBuddy',
    slug: 'aiubbuddy',
    summary:
      'Android app for AIUB students to manage class routines, faculty info, and university notices.',
    description:
      'Built an Android app for AIUB students to manage class routines, faculty info, and university notices in one place — targeting 1,000+ students who previously relied on the online portal. Used Firebase Cloud Messaging (FCM) and a NestJS notification backend to push university updates even when the app is closed, and Room (SQLite) to keep core features working offline, solving both connectivity and real-time delivery challenges. Followed MVVM architecture to keep the codebase maintainable and scalable, making it easy to add features without breaking existing functionality.',
    category: ProjectCategory.MOBILE,
    status: ProjectStatus.ARCHIVED,
    techStack: [
      'Kotlin',
      'NestJS',
      'PostgreSQL',
      'Firebase (FCM/Auth)',
      'SQLite',
      'Retrofit',
    ],
    skillNames: [
      'Kotlin',
      'NestJS',
      'PostgreSQL',
      'Firebase',
      'SQLite',
      'Retrofit',
    ],
    githubUrl: 'https://github.com/swajan-75/Aiub_buddy',
    featured: false,
    order: 2,
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-01-31'),
  },
  {
    title: 'ArkPlayZone',
    slug: 'arkplayzone',
    summary:
      'Full-stack sports facility booking system with concurrency-safe reservations.',
    description:
      'Built a full-stack sports facility booking system where users can browse available slots, make reservations, and cancel bookings, with the entire flow automated using NestJS and PostgreSQL. Used JWT authentication, RBAC, and a custom OTP/SMTP verification pipeline to ensure only verified users can book, and applied database-level transaction locking to prevent double-booking under simultaneous requests. Delivered a secure, reliable booking platform that handles real-world concurrency and identity challenges, demonstrating practical backend skills beyond basic CRUD.',
    category: ProjectCategory.FULLSTACK,
    status: ProjectStatus.ARCHIVED,
    techStack: [
      'Next.js',
      'NestJS',
      'PostgreSQL',
      'JWT',
      'SMTP',
      'OTP',
      'RESTful API',
    ],
    skillNames: [
      'Next.js',
      'NestJS',
      'PostgreSQL',
      'JWT Authentication',
      'OTP/SMTP',
      'REST API Design',
    ],
    githubUrl: 'https://github.com/swajan-75/ArkPlayZone',
    featured: false,
    order: 3,
    startDate: new Date('2025-11-01'),
    endDate: new Date('2025-11-30'),
  },
];

async function seedProjects() {
  for (const p of PROJECTS) {
    const skillsWrite = {
      create: p.skillNames.map((name) => ({ skill: { connect: { name } } })),
    };

    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        summary: p.summary,
        description: p.description,
        category: p.category,
        status: p.status,
        techStack: p.techStack,
        liveUrl: p.liveUrl,
        githubUrl: p.githubUrl,
        featured: p.featured,
        order: p.order,
        startDate: p.startDate,
        endDate: p.endDate,
        skills: { deleteMany: {}, ...skillsWrite },
      },
      create: {
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        description: p.description,
        category: p.category,
        status: p.status,
        techStack: p.techStack,
        liveUrl: p.liveUrl,
        githubUrl: p.githubUrl,
        featured: p.featured,
        order: p.order,
        startDate: p.startDate,
        endDate: p.endDate,
        skills: skillsWrite,
      },
    });
  }

  console.log(`Seeded ${PROJECTS.length} projects`);
}

async function seedExperience() {
  await prisma.experience.deleteMany({});

  await prisma.experience.create({
    data: {
      company: 'WebcareIT',
      role: 'Full Stack Developer Intern',
      type: EmploymentType.INTERNSHIP,
      location: 'Dhaka, Bangladesh',
      description:
        'Developed and maintained comprehensive full-stack applications, including a highly functional e-commerce platform and a robust Warehouse Management System (WMS). Architected scalable backend services using NestJS and FastAPI strictly adhering to MVC architecture, while integrating PostgreSQL with TypeORM for optimized data modeling. Built responsive, dynamic frontend interfaces leveraging Next.js to ensure seamless user experiences and efficient data fetching. Collaborated directly with senior engineers using Git and Docker for version control and containerized deployments, actively participating in code reviews to enhance overall codebase quality and problem-solving capabilities.',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-05-31'),
      isCurrent: false,
      order: 0,
    },
  });

  console.log('Seeded experience: WebcareIT');
}

async function seedEducation() {
  await prisma.education.deleteMany({});

  await prisma.education.create({
    data: {
      institution: 'American International University-Bangladesh (AIUB)',
      degree: 'Bachelor of Science in Computer Science & Engineering',
      field: 'Software Engineering',
      grade: "3.83/4.00 (Dean's List, Fall 2023-24)",
      description:
        'Thesis: A Comparative Performance Analysis of Machine Learning Models for Thyroid Disease Classification.',
      startDate: new Date('2022-01-01'),
      endDate: null,
      order: 0,
    },
  });

  console.log('Seeded education: AIUB');
}

async function main() {
  await seedAdmin();
  await seedProfile();
  await seedSkills();
  await seedProjects();
  await seedExperience();
  await seedEducation();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
