import FilterableBlogPosts from 'app/components/FilterableBlogPosts'
import { getBlogPosts } from 'app/blog/utils-server'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  const allPosts = getBlogPosts()

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <FilterableBlogPosts posts={allPosts} />
    </section>
  )
}
