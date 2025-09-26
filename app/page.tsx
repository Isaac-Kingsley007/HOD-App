import Link from "next/link";

export default function HomePage() {
  return (
    <main className="h-[100%] bg-gradient-to-b from-[#1e3a8a] to-[#071c49] min-h-screen">
      <div className="flex justify-around gap-3 bg-[#1A0C4E] ">
        <img
          width="200"
          height="50"
          src="https://licet.ac.in/wp-content/uploads/2021/02/licet-e1617087721530.png"
          alt="LICET Logo"
        />

        <div className="mt-6">
          <h1 className="text-4xl mb-4">
            LOYOLA-ICAM COLLEGE OF ENGINEERING AND TECHNOLOGY
          </h1>
          <p className="text-xl text-center pr-15.5">(Autonomous)</p>
        </div>
      </div>

      <div className="border-1 border-white bg-linear-to-t p-2.5 from-sky-600 mt-[1px] to-[#1A0C4E] text-2xl text-center ">
        DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
      </div>

      <p className="text-lg text-center mt-6 mb-6 text-neutral-300">
        Welcome! Please select your role:
      </p>
      <div className="flex flex-col min-sm:flex-row gap-8 min-sm:gap-4 justify-center items-center">
        <Link href="/Login/admin" passHref>
          <button className="bg-red-600 border-2 border-white hover:bg-red-700 h-[200px] w-[300px] text-white px-8 py-4 rounded-lg shadow text-lg font-semibold cursor-pointer transition">
            Enter as Admin
          </button>
        </Link>

        <Link href="/Login/student" passHref>
          <button className="bg-blue-600 hover:bg-blue-700 border-2 border-white text-white h-[200px] w-[300px] px-8 py-4 rounded-lg shadow text-lg font-semibold cursor-pointer transition">
            Enter as Student
          </button>
        </Link>

        <Link href="/Login/faculty" passHref>
          <button className="bg-green-600 hover:bg-green-700 border-2 border-white h-[200px] w-[300px] text-white px-8 py-4 rounded-lg shadow text-lg font-semibold cursor-pointer transition">
            Enter as Faculty
          </button>
        </Link>
      </div>
    </main>
  );
}
