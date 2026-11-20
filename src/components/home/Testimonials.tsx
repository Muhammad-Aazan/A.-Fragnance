const testimonials = [
  {
    quote:
      "Oud Noir is unlike anything I've experienced. It has a darkness that feels intimate, not heavy. I receive compliments every single time.",
    author: "Amelia R.",
    product: "Oud Noir",
    stars: 5,
  },
  {
    quote:
      "Amber Elixir wraps you like cashmere. The warmth lasts all day and into the evening — a truly transportive scent.",
    author: "Daniel K.",
    product: "Amber Elixir",
    stars: 5,
  },
  {
    quote:
      "Royal Musk is my signature. Clean and regal without being cold. It feels like wearing confidence.",
    author: "Sara M.",
    product: "Royal Musk",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-8 bg-[#fcfaf7]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="text-[#8a6829] text-xs tracking-[0.4em] mb-4 font-mono font-medium">WORDS THAT LINGER</p>
          <h2 className="font-serif text-5xl md:text-6xl text-[#171513]">An intimate impression.</h2>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e6decb]">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-10 hover:shadow-[0_8px_30px_rgba(198,165,107,0.12)] transition-shadow">
              {/* Stars */}
              <div className="flex gap-1 mb-8">
                {[...Array(t.stars)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-[#c6a56b]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-[#171513] font-serif text-xl leading-relaxed italic mb-8">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div>
                <div className="text-[#171513] text-sm font-medium">{t.author}</div>
                <div className="text-[#8a6829] text-xs tracking-widest mt-1 font-mono font-medium">{t.product}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
