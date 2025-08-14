import fs from 'fs'
import path from 'path'
import type { Metadata } from 'lib/types'

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'app', 'blog', 'posts'))
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  let frontMatterBlock = match![1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata, content }
}

function getAllMDXFilesRecursively(dir: string): string[] {
  let results: string[] = []

  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    let fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      results = results.concat(getAllMDXFilesRecursively(fullPath))
    } else if (entry.isFile() && path.extname(entry.name) === '.mdx') {
      results.push(fullPath)
    }
  })
  return results
}
function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(baseDir: string) {
  let mdxFiles = getAllMDXFilesRecursively(baseDir)
  return mdxFiles.map((filePath) => {
    let { metadata, content } = readMDXFile(filePath)
    let relativePath = path.relative(baseDir, filePath)
    let slug = relativePath.replace(/\.mdx$/, '').replace(/\\/g, '')

    return {
      metadata,
      slug,
      content,
    }
  })
}
