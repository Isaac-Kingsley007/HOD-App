import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
return (
<main className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex flex-col">
{/* Header */}
<header className="flex flex-col sm:flex-row items-center justify-between bg-[#1A0C4E] px-8 py-6 gap-6">
<div className="relative w-48 h-16 sm:w-52 sm:h-20 flex-shrink-0">
<img 
src="https://licet.ac.in/wp-content/uploads/2021/02/licet-e1617087721530.png"
alt="LICET Logo"
style={{ objectFit: "contain" }}

/>
</div>
<div className="text-center sm:text-left flex-grow">
<h1 className="text-white font-extrabold text-2xl sm:text-4xl leading-tight">
LOYOLA-ICAM COLLEGE OF ENGINEERING AND TECHNOLOGY
</h1>
<p className="text-sky-300 text-lg mt-1">(Autonomous)</p>
</div>
</header>
  {/* Department Banner */}
  <section className="bg-gradient-to-t from-sky-600 to-[#1A0C4E] text-white text-center text-xl font-semibold py-3 border-t border-white tracking-wide">
    DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
  </section>

  {/* Main content */}
  <section className="flex-grow flex flex-col items-center justify-center px-6 py-10 max-w-7xl mx-auto">
    <p className="text-neutral-300 text-lg max-w-md text-center mb-8">
      Welcome! Please select your role:
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-4xl">
      {[
        {
          label: "Enter as Admin",
          href: "/Login/admin",
          bg: "bg-red-600",
          hover: "hover:bg-red-700",

        },
        {
          label: "Enter as Student",
          href: "/Login/student",
          bg: "bg-blue-600",
          hover: "hover:bg-blue-700",
        },
        {
          label: "Enter as Faculty",
          href: "/Login/faculty",
          bg: "bg-green-600",
          hover: "hover:bg-green-700",
        },
      ].map(({ label, href, bg, hover }) => (
        <Link key={label} href={href} passHref>
          <button
            className={`${bg} ${hover} px-8.5 text-white font-semibold rounded-lg shadow-lg border-2 border-white h-48 w-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-white flex items-center justify-center text-xl`}
            aria-label={label}
          >
            {label}
          </button>
        </Link>
      ))}
    </div>
  </section>
</main>
);
}