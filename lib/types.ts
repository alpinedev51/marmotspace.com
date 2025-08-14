export type Metadata = {
	title: string
	summary: string
	publishedAt: string
	category: string
	subject: string
	image?: string
}

export type BlogPost = {
	metadata: Metadata
	slug: string
	content: string
}
