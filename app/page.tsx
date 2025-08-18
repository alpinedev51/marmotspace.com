import { BlogPosts } from 'app/components/posts'

export default function Page() {
  return (
    <>
      <section className="relative pr-0 md:pr-48">
        <h1 className="mb-8 text-4xl font-semibold tracking-tighter text-stone-100">
          Hello,
        </h1>
        <div className="hidden md:block absolute top-2 left-[680px] pointer-events-none">
          <img
            src="/images/marmot_kanagawa_2_crop.png"
            alt="Pfp Icon"
            className="w-48 h-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
        <p className="mb-4">
          {`I go by AlpineDev. I'm a software engineer with a background in math and cybersecurity.`}
        </p>
        <p className="pr-0 md:pr-48 mb-4">
          {'This page acts as a hub of various content that I share relating to science/technology, news, lessons, and various essays. I hope you find some of it interesting and worthwhile.'}
        </p>
        <div className="my-8">
          <BlogPosts />
        </div>
      </section>
    </>
  )
}
