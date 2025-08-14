'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDate } from 'app/blog/utils-client'
import type { BlogPost } from 'lib/types'

function formatLabel(tag: string): string {
  return tag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function makePlural(tag: string): string {
  return tag
    .split('-')
    .map(word => {
      const lastChar = word[word.length - 1].toLowerCase()
      return lastChar === 's' ? word : word + 's'
    })
    .join('-')
}

export default function FilterableBlogPosts({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState<string | null>(null)
  const [subject, setSubject] = useState<string | null>(null)

  const categories = Array.from(new Set(posts.map(p => p.metadata.category)))
  const subjects = Array.from(new Set(posts.map(p => p.metadata.subject)))

  const filtered = posts
    .slice()
    .filter(
      (post) =>
        (!category || post.metadata.category === category) &&
        (!subject || post.metadata.subject === subject)
    )
    .sort((a, b) => {
      if (
        new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
      ) {
        return -1
      }
      return 1
    })


  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={category || ''}
          onChange={(e) => setCategory(e.target.value || null)}
          className="p-2 text-sm rounded-md border border-neutral-300 dark:border-stone-200 
             bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 
             shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">All Categories</option>
          {categories.map((type) => (
            <option key={type} value={type}>
              {formatLabel(makePlural(type))}
            </option>
          ))}
        </select>

        <select
          value={subject || ''}
          onChange={(e) => setSubject(e.target.value || null)}
          className="p-2 text-sm rounded-md border border-neutral-300 dark:border-stone-200 
             bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 
             shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
        >
          <option
            value=""
            className="capitalize">All Subjects</option>
          {subjects.map((subj) => (
            <option key={subj} value={subj}>
              {formatLabel(subj)}
            </option>
          ))}
        </select>
      </div>

      {/* Render Filtered Posts */}
      {filtered.map((post) => (
        <Link
          key={post.slug}
          className="flex flex-col space-y-1 mb-4"
          href={`/blog/${post.slug}`}
        >
          <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
            <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
              {formatDate(post.metadata.publishedAt, false)}
            </p>
            <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
              {post.metadata.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
