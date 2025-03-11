export default function Header() {
  return (
    <>
      <header className="w-full bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="mx-auto max-w-2xl lg:mx-0 relative z-10">
            <h2 className="text-4xl font-bold tracking-tight text-text-color sm:text-5xl mb-8">
              AI innovation and solutions prioritizing safety and ethics
            </h2>
          </div>

          {/* Background image */}
          <div className="absolute -top-48 -right-16 z-0 px-8 hidden lg:block">
            <div className="w-3/4 h-3/4 rounded-lg overflow-hidden mt-12">
              <img
                src="./img/chip-2.png"
                alt="AI chip"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
