import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// This would typically come from a database or CMS
const newsArticles = [
  {
    slug: 'adigsi-ekonomi-digital-ketahanan-siber',
    category: 'Siaran Pers',
    title: 'ADIGSI Sebut Ekonomi Digital Bisa Terdampak Anjloknya Ketahanan Siber',
    image: '/images/news-deepfake.webp',
    date: '2026-01-21',
    readTime: 5,
    content: `
      <p><strong>Bisnis.com</strong>, JAKARTA — Asosiasi Digitalisasi dan Keamanan Siber Indonesia (ADIGSI) menilai penurunan skor ketahanan siber nasional berpotensi memberikan dampak langsung terhadap pertumbuhan ekonomi digital Indonesia.</p>
      
      <p>Padahal, ekonomi digital Indonesia diproyeksikan mencapai sekitar US$360 miliar atau setara lebih dari Rp5.700 triliun pada 2030.</p>
      
      <p>Ketua Umum Asosiasi Digitalisasi dan Keamanan Siber Indonesia (ADIGSI) Firlie Ganinduto mengatakan laju transformasi digital yang sangat cepat turut memperbesar risiko keamanan siber nasional. Ketergantungan yang tinggi terhadap layanan digital dan rantai pasok teknologi, ditambah dengan tingkat kematangan keamanan siber yang belum merata antar-sektor, membuat ketahanan nasional menjadi rentan.</p>
      
      <p>Di saat yang sama, laju digitalisasi yang sangat cepat, ketergantungan pada layanan digital dan rantai pasok, serta variasi kematangan keamanan siber antar-sektor membuat 'ketahanan rata-rata' rentan tertarik turun," kata Firlie kepada Bisnis pada Rabu (21/1/2026).</p>
    `,
    source: {
      name: 'Bisnis.com',
      url: 'https://teknologi.bisnis.com/read/20260121/84/1946093/adigsi-sebut-ekonomi-digital-bisa-terdampak-anjloknya-ketahanan-siber'
    }
  },
  {
    slug: 'deepfake-voice-copy-kejahatan-siber',
    category: 'Siaran Pers',
    title: 'Ketua ADIGSI: Deepfake, Voice Copy Jadi Kejahatan Siber Paling Marak di Era AI',
    image: '/images/news-deepfake.webp',
    date: '2026-01-13',
    readTime: 3,
    content: '<p>Konten artikel akan ditambahkan...</p>'
  },
  {
    slug: 'kadin-resmikan-adigsi',
    category: 'Siaran Pers',
    title: 'Kadin resmikan Asosiasi Digitalisasi dan Kemanan Siber Indonesia',
    image: '/images/news-kadin.webp',
    date: '2026-01-10',
    readTime: 4,
    content: '<p>Konten artikel akan ditambahkan...</p>'
  }
]

function getRelatedNews(currentSlug: string) {
  return newsArticles.filter(article => article.slug !== currentSlug).slice(0, 3)
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 30) return `${diffDays} days ago`

  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = newsArticles.find(a => a.slug === slug)

  if (!article) {
    notFound()
  }

  const relatedNews = getRelatedNews(slug)

  return (
    <>
      {/* Article Content */}
      <section className="max-w-[1240px] mx-auto px-5 py-20 mt-12">
        <div className="flex flex-col items-center mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <div className="bg-white shadow-sm rounded-lg px-3 py-1">
              <span className="text-xs font-semibold text-[#29294b]">{article.category}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-[#29294b] text-center mb-4 max-w-4xl">
            {article.title}
          </h1>

          {/* Featured Image */}
          <div className="relative w-full max-w-[800px] h-[400px] my-4">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Article Body */}
        <div
          className="prose prose-lg max-w-none text-[#29294b]"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Source Link */}
        {article.source && (
          <div className="mt-8">
            <p className="text-[#29294b] mb-2">Untuk selengkapnya silahkan baca di:</p>
            <a
              href={article.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-secondary transition-colors break-all"
            >
              {article.source.url}
            </a>
          </div>
        )}
      </section>

      {/* Related News */}
      <section className="max-w-[1240px] mx-auto px-5 pb-20">
        <h2 className="text-2xl font-bold text-[#29294b] mb-4">Baca Juga</h2>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {relatedNews.map((news) => (
            <Link
              key={news.slug}
              href={`/news/${news.slug}`}
              className="flex flex-col bg-white rounded-xl min-w-[300px] max-w-[300px] hover:shadow-lg transition-all duration-200 no-underline"
            >
              <div className="relative">
                <div className="relative w-full h-[180px]">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover rounded-t-xl"
                  />
                </div>
                <div className="absolute bottom-3 left-6 bg-white shadow-sm rounded-lg px-2.5 py-1">
                  <span className="text-xs font-semibold text-[#29294b]">
                    {news.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col p-4">
                <h3 className="text-base font-bold text-black mb-4 line-clamp-2">
                  {news.title}
                </h3>
                <div className="flex justify-between text-xs text-[#555]">
                  <span>{news.readTime} mins read</span>
                  <span>{formatDate(news.date)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export async function generateStaticParams() {
  return newsArticles.map((article) => ({
    slug: article.slug,
  }))
}
