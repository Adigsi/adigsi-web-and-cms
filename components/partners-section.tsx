export function PartnersSection() {
  const governmentPartners = [
    'Ministry of Communication',
    'BSSN',
    'Cyber Crime Unit',
    'Digital Authority'
  ]

  const internationalPartners = [
    'USTDA',
    'Australian Embassy',
    'British Embassy',
    'Cyberus',
    'GASA',
    'US-ASEAN'
  ]

  const associations = [
    'APJII',
    'Fintech Indonesia',
    'APTIKNAS',
    'PANDI'
  ]

  const companies = [
    'PT Security Solutions',
    'Cyber Defense Corp',
    'Digital Trust Ltd',
    'SecureNet Indonesia',
    'TechGuard Systems',
    'InfoSec Partners',
    'DataShield Inc',
    'CyberWatch Asia'
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Partners</h2>
          <p className="text-lg text-muted-foreground">
            Building strong collaborations across sectors
          </p>
        </div>

        <div className="space-y-16">
          {/* Government Organizations */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-center text-primary">
              Partnering with Government Organizations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {governmentPartners.map((partner, index) => (
                <div
                  key={index}
                  className="aspect-[3/2] bg-card border border-border rounded-lg flex items-center justify-center p-6 hover:shadow-lg transition-shadow"
                >
                  <p className="text-center font-semibold text-sm">{partner}</p>
                </div>
              ))}
            </div>
          </div>

          {/* International Institutions */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-center text-primary">
              Partnering with International Institutions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {internationalPartners.map((partner, index) => (
                <div
                  key={index}
                  className="aspect-[3/2] bg-card border border-border rounded-lg flex items-center justify-center p-6 hover:shadow-lg transition-shadow"
                >
                  <p className="text-center font-semibold text-sm">{partner}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Associations */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-center text-primary">
              Partnering with Associations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {associations.map((partner, index) => (
                <div
                  key={index}
                  className="aspect-[3/2] bg-card border border-border rounded-lg flex items-center justify-center p-6 hover:shadow-lg transition-shadow"
                >
                  <p className="text-center font-semibold text-sm">{partner}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Companies */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-center text-primary">
              Partnering with Companies
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {companies.map((partner, index) => (
                <div
                  key={index}
                  className="aspect-[3/2] bg-card border border-border rounded-lg flex items-center justify-center p-6 hover:shadow-lg transition-shadow"
                >
                  <p className="text-center font-semibold text-sm">{partner}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
