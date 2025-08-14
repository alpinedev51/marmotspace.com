import { CustomMDX } from 'app/components/mdx'
import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { formatDate } from 'app/blog/utils-client'

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'app', 'readings'))
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => ({
      slug: file.replace(/\.mdx$/, ''),
    }))
}

export default function ReadingPage({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), 'app', 'readings', `${params.slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    notFound()
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')

  const { metadata, content } = parseFrontmatter(fileContent)

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-2 tracking-tight">{metadata.title}</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8">
        {'Last updated: ' + formatDate(metadata.publishedAt)}
      </p>
      <div className="prose dark:prose-invert max-w-none">
        <CustomMDX source={content} />
      </div>
    </section>
  )
}

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)
  const frontMatterBlock = match?.[1] || ''
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata: any = {}

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    const value = valueArr.join(': ').trim()
    metadata[key.trim()] = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
  })

  return { metadata, content }
}
