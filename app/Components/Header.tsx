import React from 'react';

interface HeaderProps {
  showDepartmentBanner?: boolean;
}

export default function Header({ showDepartmentBanner = true }: HeaderProps) {
  return (
    <>
      {/* College Header */}
      <header className="flex justify-between items-center gap-4 bg-[#1A0C4E] px-6 py-4 shadow-lg">
        <img
          width={200}
          height={50}
          src="https://licet.ac.in/wp-content/uploads/2021/02/licet-e1617087721530.png"
          alt="LICET Logo"
          className="rounded-md shadow-md"
        />
        <div className="text-center flex-1">
          <h1 className="md:text-4xl text-2xl font-bold text-white mb-1">
            LOYOLA-ICAM COLLEGE OF ENGINEERING AND TECHNOLOGY
          </h1>
          <p className="text-lg text-sky-200">(Autonomous)</p>
        </div>
        <div className="w-32" /> {/* Spacer for balance */}
      </header>

      {/* Department Banner */}
      {showDepartmentBanner && (
        <section className="bg-gradient-to-t from-sky-600 to-[#1A0C4E] border border-white/20 p-4 text-center text-xl font-semibold text-white shadow-md">
          DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
        </section>
      )}
    </>
  );
}
