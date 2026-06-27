import { Header, Footer } from "@/components";

export default function Loading() {
  return (
    <div className="page-shell min-h-screen">
      <Header />

      <main>
        <section className="section-rule py-14 sm:py-18">
          <div className="page-frame pt-14">
            <div className="h-5 w-28 animate-pulse rounded-full bg-[rgb(29_36_64_/_0.12)]" />
            <div className="mt-5 h-16 max-w-3xl animate-pulse rounded-[1rem] bg-[rgb(29_36_64_/_0.1)]" />
            <div className="mt-5 h-7 max-w-2xl animate-pulse rounded-full bg-[rgb(29_36_64_/_0.08)]" />
          </div>
        </section>

        <section className="py-8 pb-16 sm:pb-20">
          <div className="page-frame">
            <div className="news-grid news-grid-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="surface-panel h-56 animate-pulse rounded-[1.75rem]" />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
