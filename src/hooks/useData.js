import { useState, useEffect } from 'react'

export const useData = () => {
  const [data, setData] = useState({
    profile: null,
    projects: [],
    publications: [],
    blog: [],
    anime: [],
    settings: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, projectsRes, publicationsRes, blogRes, animeRes, settingsRes] = await Promise.all([
          fetch('/data/profile.json'),
          fetch('/data/projects.json'),
          fetch('/data/publications.json'),
          fetch('/data/blog.json'),
          fetch('/data/anime.json'),
          fetch('/data/settings.json')
        ])

        const [profile, projects, publications, blog, anime, settings] = await Promise.all([
          profileRes.json(),
          projectsRes.json(),
          publicationsRes.json(),
          blogRes.json(),
          animeRes.json(),
          settingsRes.json()
        ])

        setData({
          profile,
          projects,
          publications,
          blog,
          anime,
          settings,
          loading: false,
          error: null
        })
      } catch (error) {
        console.error('Error loading data:', error)
        // Provide fallback data
        setData({
          profile: {
            personal: {
              name: "Your Name",
              title: "Waterloo CS 1A Student",
              description: "Passionate computer science student at the University of Waterloo, exploring the intersection of technology and innovation.",
              avatar: {
                initials: "YN",
                image: null
              },
              socialLinks: [
                { name: "GitHub", url: "https://github.com/yourusername" },
                { name: "LinkedIn", url: "https://linkedin.com/in/yourusername" },
                { name: "Devpost", url: "https://devpost.com/yourusername" },
                { name: "Codeforces", url: "https://codeforces.com/profile/yourusername" }
              ]
            }
          },
          settings: {
            theme: {
              colors: {
                primary: "#87ceeb",
                accent: "#5fb3d4",
                background: "#1a1a1a",
                surface: "#2a2a2a",
                text: {
                  primary: "#ffffff",
                  secondary: "#cccccc",
                  muted: "#999999"
                },
                border: "#404040"
              }
            },
            sections: [
              { id: "projects", name: "Projects", enabled: true, order: 1, component: "ProjectsSection" },
              { id: "publications", name: "Publications", enabled: true, order: 2, component: "PublicationsSection" },
              { id: "anime", name: "动漫", enabled: true, order: 3, component: "AnimeSection" },
              { id: "blog", name: "Blog", enabled: true, order: 4, component: "BlogSection" },
              { id: "contact", name: "Contact", enabled: true, order: 5, component: "ContactSection" }
            ],
            layout: {
              sidebar: {
                defaultWidth: 580,
                minWidth: 300,
                maxWidth: 800,
                collapsedWidth: 50
              },
              animations: {
                enabled: true,
                shootingStars: true,
                initialLoadAnimation: true
              }
            }
          },
          projects: [
            {
              id: "project-one",
              title: "Personal Portfolio Website",
              description: "Modern React-based portfolio with smooth navigation, blog functionality, and responsive dark theme design.",
              image: "/images/project1.svg",
              links: {
                github: "https://github.com/yourusername/portfolio",
                live: "https://yourportfolio.com",
                devpost: null
              }
            },
            {
              id: "project-two",
              title: "Task Management API",
              description: "RESTful API with Python Flask featuring user authentication, SQLite integration, and comprehensive documentation.",
              image: "/images/project2.svg",
              links: {
                github: "https://github.com/yourusername/task-api",
                live: null,
                devpost: "https://devpost.com/software/task-manager"
              }
            },
            {
              id: "project-three",
              title: "E-commerce Platform",
              description: "Full-stack solution with Java Spring Boot, featuring product catalog, shopping cart, and admin dashboard.",
              image: "/images/project3.svg",
              links: {
                github: "https://github.com/yourusername/ecommerce",
                live: "https://demo-ecommerce.com",
                devpost: "https://devpost.com/software/ecommerce-platform"
              }
            }
          ],
          publications: [
            {
              id: "publication-one",
              title: "Machine Learning Applications in Computer Vision",
              details: "IEEE Conference on Computer Vision, 2024 - Research on applying deep learning techniques to improve object detection accuracy."
            },
            {
              id: "publication-two",
              title: "Optimizing Database Query Performance",
              details: "ACM Database Systems Journal, 2024 - Analysis of indexing strategies and their impact on query execution time."
            }
          ],
          blog: [
            {
              id: "first-post-2024",
              title: "My First Blog Post",
              date: "2024-01-15",
              excerpt: "This is my first blog post where I share my thoughts on starting my journey in computer science.",
              tags: ["personal", "cs", "waterloo"],
              content: "# My First Blog Post\n\nWelcome to my blog!"
            },
            {
              id: "learning-react-2024",
              title: "Learning React: My Experience",
              date: "2024-02-01",
              excerpt: "Sharing my experience learning React and building my first personal website.",
              tags: ["react", "javascript", "web-development"],
              content: "# Learning React: My Experience\n\nReact has been exciting to learn!"
            }
          ],
          anime: [
            {
              id: 1,
              name: "进击的巨人",
              image: "/images/anime/attack-on-titan.jpg",
              rating: 9.5,
              status: "已完结",
              genre: ["动作", "剧情", "奇幻"],
              year: 2013,
              description: "人类与巨人的生存之战，充满震撼的史诗级作品"
            },
            {
              id: 2,
              name: "鬼灭之刃",
              image: "/images/anime/demon-slayer.jpg",
              rating: 9.2,
              status: "连载中",
              genre: ["动作", "超自然", "历史"],
              year: 2019,
              description: "炭治郎为了拯救妹妹而踏上的鬼杀之路"
            }
          ],
          loading: false,
          error: error.message
        })
      }
    }

    loadData()
  }, [])

  return data
}