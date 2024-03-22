import { Container } from "@/components/landing/container";
import { FadeIn } from "@/components/landing/fade-in";
import { MdxContent } from "@/components/landing/mdx-content";
import { PageLinks } from "@/components/landing/page-links";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { authors } from "@/content/blog/authors";
import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import { BLOG_PATH, getContentData, getFilePaths, getPost } from "@/lib/mdx-helper";

type Props = {
  params: { slug: string; title: string; description: string; authorName: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { frontmatter } = await getPost(params.slug);

  if (!frontmatter) {
    return notFound();
  }

  const baseUrl = process.env.VERCEL_URL ? "https://unkey.dev" : "http://localhost:3000";
  const ogUrl = new URL("/og/blog", baseUrl);
  const author = authors[frontmatter.author];
  ogUrl.searchParams.set("title", frontmatter.title ?? "");
  ogUrl.searchParams.set("author", author.name ?? "");
  if (author.image.src) {
    ogUrl.searchParams.set("image", new URL(author.image.src, baseUrl).toString());
  }

  return {
    title: `${frontmatter.title} | Unkey`,
    description: frontmatter.description,
    openGraph: {
      title: `${frontmatter.title} | Unkey`,
      description: frontmatter.description,
      url: `https://unkey.dev/blog/${params.slug}`,
      type: "article",
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
      siteName: "unkey.dev",
    },
    twitter: {
      card: "summary_large_image",
      title: `${frontmatter.title} | Unkey`,
      description: frontmatter.description,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
      site: "@unkeydev",
      creator: "@unkeydev",
    },
    icons: {
      shortcut: "/images/landing/unkey.png",
    },
  };
}

export const generateStaticParams = async () => {
  const posts = await getFilePaths(BLOG_PATH);
  // Remove file extensions for page paths
  posts.map((path) => path.replace(/\.mdx?$/, "")).map((slug) => ({ params: { slug } }));
  return posts;
};

const BlogArticleWrapper = async ({ params }: { params: { slug: string } }) => {
  const { serialized, frontmatter, headings } = await getPost(params.slug);

  const author = authors[frontmatter.author];
  const moreArticles = await getContentData({
    contentPath: BLOG_PATH,
    filepath: params.slug,
  });

  return (
    <>
      <Container className="scroll-smooth">
        <div className="relative mt-16 flex flex-col items-start space-y-8 lg:mt-32 lg:flex-row lg:space-y-0 ">
          <div className="mx-auto w-full lg:pl-8 ">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {frontmatter.title}
            </h2>
            <p className="border- my-8 text-center text-gray-500">{frontmatter.description}</p>
            <div className="prose prose-neutral dark:prose-invert prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-img:rounded-lg prose-img:border prose-img:border-border mx-auto w-full">
              <MdxContent source={serialized} />
            </div>
          </div>

          <div className="top-24 flex h-max w-full flex-col justify-end self-start px-4 sm:px-6 lg:sticky lg:w-2/5 lg:px-8">
            <div className="mx-auto flex items-center justify-start gap-4 border-y-0 p-2 md:mx-0 md:border-b md:border-b-gray-200">
              <Avatar className="h-14 w-14 justify-items-start">
                <AvatarImage src={author.image?.src} alt={author.name} />
              </Avatar>
              <div className="text-sm text-gray-950">
                <div className="font-semibold">{author.name}</div>
              </div>
            </div>
            {
              <div className="hidden md:block">
                <h3 className="mb-4 mt-8 text-lg font-bold uppercase tracking-wide text-gray-600">
                  Table of Contents
                </h3>
                <ScrollArea className="flex h-[580px] flex-col">
                  <div className="p-4">
                    {headings.map((heading) => {
                      return (
                        <div key={`#${heading.slug}`} className="my-2">
                          <a
                            data-level={heading.level}
                            className={
                              heading.level === "two" || heading.level === "one"
                                ? "text-md font-semibold"
                                : "ml-4 text-sm"
                            }
                            href={`#${heading.slug}`}
                          >
                            {heading.text}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </div>
            }
          </div>
        </div>
      </Container>
      <FadeIn>
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle
                cx={512}
                cy={512}
                r={512}
                fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                fillOpacity="0.7"
              />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#6030B3" />
                  <stop offset={1} stopColor="#6030B3" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Build better APIs faster
              </h2>

              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link
                  href="/app"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get started
                </Link>
                <a
                  href="https://unkey.dev/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold leading-6 text-white"
                >
                  Documentation <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <img
                className="g-white/5 absolute left-0 top-0 w-[57rem] max-w-none rounded-md ring-1 ring-white/10"
                src="/images/blog-images/admin-dashboard-new.png"
                alt="App screenshot"
                width={1824}
                height={1080}
              />
            </div>
          </div>
        </div>
      </FadeIn>

      {moreArticles.length > 0 && (
        <PageLinks
          className="mt-24 sm:mt-32 lg:mt-40"
          title="More articles"
          intro=""
          contentType="blog"
          pages={moreArticles}
        />
      )}
    </>
  );
};

export default BlogArticleWrapper;
