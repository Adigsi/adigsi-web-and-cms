'use client'

import { useLanguage } from '@/contexts/language-context'

const umamiAnalyticsUrl = process.env.NEXT_PUBLIC_UMAMI_ANALYTICS_URL

export default function CMSAnalyticsPage() {
	const { language } = useLanguage()

	const t = {
		en: {
			title: 'Analytics',
			subtitle: 'Website analytics from Umami',
		},
		id: {
			title: 'Analitik',
			subtitle: 'Analitik website dari Umami',
		},
	}[language]

	const overviewEmbedUrl = umamiAnalyticsUrl

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
				<p className="mt-2 text-sm text-gray-600">{t.subtitle}</p>
			</div>
					<iframe
						src={overviewEmbedUrl}
						title="Umami Overview Dashboard"
						className="h-screen w-full rounded-md border border-gray-200"
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>
		</div>
	)
}
