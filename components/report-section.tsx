import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Download } from 'lucide-react'

export function ReportSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">REPORT</p>
          <h2 className="text-3xl md:text-4xl font-bold">Indonesia Cybersecurity Industry Report</h2>
        </div>

        <Card className="max-w-5xl mx-auto overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-[4/3] md:aspect-auto">
                <Image
                  src="/images/cybersecurity-report.jpg"
                  alt="Indonesia Cybersecurity Industry Report"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">
                  Indonesia Cybersecurity Industry Report
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Kadin&apos;s Industry Report and Strategic Guide highlights the need for a strong 
                    cybersecurity framework to support Indonesia&apos;s digital economy.
                  </p>
                  <p>
                    The report outlines six strategic pillars: cyber resilience, governance, 
                    talent development, public-private partnerships, global standards alignment, 
                    and industry growth.
                  </p>
                  <p>
                    Despite progress, cyber threats persist. Industry players play a key role in 
                    accelerating cybersecurity initiatives, ensuring national security and global 
                    competitiveness.
                  </p>
                </div>
                <Button className="mt-6 w-full sm:w-auto" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  Download Here
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
