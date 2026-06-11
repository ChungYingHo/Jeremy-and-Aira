export type Author = {
  name: string
  imgPath: string
  isSecret: boolean
  isHiddenFromAbout?: boolean
  coAuthorImgs?: string[]
  summary?: string
  description?: string
  currentRole?: string[]
  programmingLanguages?: string[]
  socialLinks?: Record<string, string>
  portfolio?: Array<{ name: string; link: string; summary: string }>
}

export const AUTHORS: Author[] = [
  {
    name: 'Jeremy',
    imgPath: '/assets/authors/jeremy.png',
    isSecret: false,
    summary: 'All we have to decide is what to do with the time that is given us.\n— J.R.R. Tolkien, The Fellowship of the Ring',
    description: 'Hi, I’m Jeremy, a front-end engineer.\nI believe that even small, consistent efforts can gradually make a difference in the world.\n\nWelcome to my blog. From vocus to Docusaurus, this is already the fourth iteration of this site. Each redesign has been more than a change of tools or frameworks — it has been a way for me to reorganize how I learn and how I think.\n\nHere, you’ll find practical insights into web development, deeper explorations of computer science fundamentals, and reflections on technical growth and life choices.\n\nFor me, this blog represents an important milestone. It serves both as a record of my technical journey and as a starting point for redefining my future direction.\nWhether you’re just passing by or choosing to walk along for a while, I’m truly glad to meet you here.',
    currentRole: [
      'Senior Frontend Engineer',
      'Frontend Architect',
      'Frontend Planner'
    ],
    programmingLanguages: ['JavaScript', 'TypeScript', 'Java'],
    socialLinks: {
      github: 'https://github.com/ChungYingHo',
      linkedin: 'https://www.linkedin.com/in/chung-ying-ho',
      npm: 'https://www.npmjs.com/~ag_jeremy',
      ithome: 'https://ithelp.ithome.com.tw/users/20157439'
    },
    portfolio: [
      {
        name: 'Exam Review System',
        link: 'https://tcm-sand.vercel.app/',
        summary: 'An online study and review system I built for a professional exam — question banks, practice sessions, and progress tracking all in one place, full-stack from front end to deployment. Still a work in progress, so the front door stays locked for now.'
      },
      {
        name: 'Env Aligner',
        link: 'https://www.npmjs.com/package/env-aligner',
        summary: 'Env Aligner is a lightweight CLI tool that helps you validate and align environment variables between .env and .env.example files.\n\nIt checks for missing keys, empty values, and extra variables, and optionally formats .env files to match the schema.'
      },
      {
        name: 'English Stack',
        link: 'https://english-stack.vercel.app/',
        summary: 'A site I built to level up our English skills together. We use it to practice reading and listening while keeping track of the most common vocabulary we encounter.'
      },
      {
        name: 'eslint-config-jeremy',
        link: 'https://www.npmjs.com/package/eslint-config-jeremy',
        summary: 'Shareable ESLint 9+/10 flat config with interactive CLI setup.'
      }
    ]
  },
  {
    name: 'Jeremy & Claude',
    imgPath: '/assets/authors/jeremy.png',
    isSecret: false,
    isHiddenFromAbout: true,
    coAuthorImgs: ['/assets/authors/jeremy.png', '/assets/authors/claude.png'],
  },
  // Aira Studio：Jeremy 的附屬工作室／第二人格，日後可能獨立成站。
  // 暫不顯示為作者卡（保留設定以便日後復用）。
  // {
  //   name: 'Aira Studio',
  //   imgPath: '/assets/authors/aira.png',
  //   isSecret: true,
  // },
]
