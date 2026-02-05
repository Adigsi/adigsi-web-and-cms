import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users, Award, Globe, FileCheck, Lightbulb, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AboutSection() {
  const missions = [
    {
      icon: Shield,
      title: 'Enhancing Industry Capacity',
      description: 'Enhancing the capacity of the cybersecurity industry through training and development'
    },
    {
      icon: Users,
      title: 'Strengthening Partnerships',
      description: 'Building strong partnerships with government and related institutions'
    },
    {
      icon: FileCheck,
      title: 'Building Awareness',
      description: 'Promoting awareness and compliance with cybersecurity regulations'
    },
    {
      icon: Globe,
      title: 'Resilient Ecosystem',
      description: 'Developing a resilient and sustainable cybersecurity ecosystem'
    },
    {
      icon: Award,
      title: 'Certification Standards',
      description: 'Promoting certification and standardization in cybersecurity practices'
    },
    {
      icon: Lightbulb,
      title: 'Innovation & Entrepreneurship',
      description: 'Supporting innovation and entrepreneurship in cybersecurity sector'
    },
    {
      icon: Building2,
      title: 'Critical Infrastructure',
      description: 'Contributing to the protection of national critical infrastructure'
    }
  ]

  return (
    <section id="about" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Indonesian Association for Digitalization and Cybersecurity
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            ADIGSI is a national organization established to strengthen and protect Indonesia&apos;s 
            digital infrastructure. We focus on enhancing the capacity of the cybersecurity industry 
            through capability development, technology mastery, and cross-sector collaboration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-2">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4 text-primary">Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become a key pillar in building and strengthening a resilient, innovative, 
                and sustainable cybersecurity ecosystem in Indonesia, protecting national digital 
                sovereignty, and supporting Indonesia&apos;s economic growth.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 bg-primary text-primary-foreground">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4">Mission</h3>
              <p className="leading-relaxed">
                Building a comprehensive framework to enhance cybersecurity capabilities, 
                foster innovation, and create collaborative partnerships across sectors 
                for a secure digital Indonesia.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {missions.map((mission, index) => {
            const Icon = mission.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">{mission.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {mission.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline">Learn More</Button>
        </div>
      </div>
    </section>
  )
}
