import { Header, Footer } from "@/components";

export default function Loading() {
  return (
    <div className="page-shell min-h-screen">
      <Header />

      <main>
        <section className="bg-[linear-gradient(180deg,_#222a47_0%,_#171d31_100%)] py-14 sm:py-18 lg:py-24">
          <div className="page-frame">
            <div className="h-5 w-56 animate-pulse rounded-full bg-white/14" />
            <div className="mt-10 h-5 w-36 animate-pulse rounded-full bg-white/16" />
            <div className="mt-5 h-20 max-w-4xl animate-pulse rounded-[1rem] bg-white/14" />
            <div className="mt-6 h-7 max-w-2xl animate-pulse rounded-full bg-white/12" />
          </div>
        </section>

        <section className="section-rule py-10 sm:py-12">
          <div className="page-frame pt-10">
            <article className="surface-panel rounded-[2.25rem] p-8 sm:p-10">
              <div className="mx-auto max-w-3xl space-y-4">
                <div className="h-4 w-full animate-pulse rounded-full bg-[rgb(29_36_64_/_0.1)]" />
                <div className="h-4 w-full animate-pulse rounded-full bg-[rgb(29_36_64_/_0.1)]" />
                <div className="h-4 w-3/4 animate-pulse rounded-full bg-[rgb(29_36_64_/_0.1)]" />
                <div className="h-4 w-full animate-pulse rounded-full bg-[rgb(29_36_64_/_0.1)]" />
                <div className="h-4 w-5/6 animate-pulse rounded-full bg-[rgb(29_36_64_/_0.1)]" />
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
