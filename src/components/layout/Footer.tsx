import { Github, Linkedin, Twitter, Mail } from 'lucide-react'

const socialLinks = [
  { name: 'GitHub', href: '#', icon: Github },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Email', href: 'mailto:hello@example.com', icon: Mail },
]

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label={link.name}
              >
                <link.icon className="size-5" />
              </a>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Brutally honest about what I can and cannot do.
          </p>
        </div>
      </div>
    </footer>
  )
}
