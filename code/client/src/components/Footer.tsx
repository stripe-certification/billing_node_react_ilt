const navigation = {
  solutions: [
    { name: "API", href: "#" },
    { name: "Team", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Research", href: "#" },
    { name: "Company", href: "#" },
  ],
  support: [
    { name: "Press", href: "#" },
    { name: "Support", href: "#" },
    { name: "Status", href: "#" },
    { name: "Availability", href: "#" },
  ],
  company: [
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Usage Policy", href: "#" },
    { name: "Compliance", href: "#" },
    { name: "Disclosure", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer
      aria-labelledby="footer-heading"
      className="bg-foreground  text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <img
            src={"/img/icon/lora-logo-dark.svg"}
            alt={"Lora Logo"}
            width={120}
            height={32}
          />

          <div className="mt-4 md:mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
