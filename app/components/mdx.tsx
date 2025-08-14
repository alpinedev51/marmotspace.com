import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'
import emoji from 'remark-emoji'
import dynamic from 'next/dynamic'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

const Mermaid = dynamic(() => import('./Mermaid'), { ssr: false });

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th
      key={index}
      className="px-4 py-2 text-left font-semibold text-neutral-800 dark:text-stone-200 border border-neutral-300 dark:border-stone-800 whitespace-nowrap"
    >
      {header}
    </th>
  ))

  let rows = data.rows.map((row, index) => (
    <tr
      key={index}
      className="hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
    >
      {row.map((cell, cellIndex) => (
        <td
          key={cellIndex}
          className="px-4 py-2 text-neutral-700 dark:text-stone-200 border border-neutral-200 dark:border-neutral-700"
        >
          {cell}
        </td>
      ))}
    </tr>
  ))

  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm table-auto border-collapse border border-neutral-200 dark:border-neutral-700 rounded-lg">
        <thead className="bg-neutral-100 dark:bg-zinc-900">
          <tr>{headers}</tr>
        </thead>
        <tbody className="bg-white dark:bg-neutral-950">{rows}</tbody>
      </table>
    </div>
  )
}

function CustomLink(props) {
  let href = props.href

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
}

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}), mermaid: Mermaid, Mermaid }}
      options={{
        mdxOptions: {
          remarkPlugins: [emoji, remarkMath],
          rehypePlugins: [rehypeKatex],
        }
      }}
    />
  )
}
