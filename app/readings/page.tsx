import { getBlogPosts } from 'app/blog/utils-server'
import Link from 'next/link'
import { formatDate } from 'app/blog/utils-client'

export const metadata = {
  title: 'Readings',
  description: 'Overview of readings and reviews.',
}

export default function Page() {
  const allBlogs = getBlogPosts()

  const readingRelatedBlogs = allBlogs
    .filter(post => post.metadata.category.match('reading'))
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    .slice(0, 3)

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-6 tracking-tighter">Readings</h1>

      <div className="mb-10">
        <Link
          href="/readings/overview"
          className="text-lg font-medium text-sky-300 hover:underline"
        >
          → Reading Overview with Ratings
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Reflections</h2>
        <div>
          {readingRelatedBlogs
            .map((post) => (
              <Link
                key={post.slug}
                className="flex flex-col space-y-1 mb-4"
                href={`/blog/${post.slug}`}
              >
                <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
                  <p className="text-neutral-600 dark:text-stone-400 w-[100px] tabular-nums">
                    {formatDate(post.metadata.publishedAt, false)}
                  </p>
                  <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {post.metadata.title}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  )
}

