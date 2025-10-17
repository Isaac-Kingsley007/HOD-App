import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen } from "lucide-react";

const Index = () => {
  const roles = [
    {
      id: "student",
      title: "Student",
      description: "Access your courses, assignments, and academic resources",
      icon: GraduationCap,
    },
    {
      id: "faculty",
      title: "Faculty",
      description: "Manage courses, grade assignments, and track student progress",
      icon: Users,
    },
    {
      id: "admin",
      title: "Administrator",
      description: "Oversee department operations and manage system settings",
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-around mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <img
              width="240"
              height="105"
              src="https://licet.ac.in/wp-content/uploads/2021/02/licet-e1617087721530.png"
              alt="LICET Logo"
              className=""
            />
            <div className=" flex-col justify-center items-center text-center ">
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                LOYOLA-ICAM COLLEGE OF ENGINEERING AND TECHNOLOGY
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">(Autonomous)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Department Banner */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-800 dark:from-blue-500 py-4 shadow-md">
        <div className="container mx-auto px-4">
          <p className="text-center text-base md:text-lg font-semibold text-white">
            DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Welcome to the CSE Portal
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select your role to access the department portal and its resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className="hover:shadow-lg dark:hover:shadow-blue-900 transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center shadow-md">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-base pt-2 text-gray-600 dark:text-gray-400">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Button
                    asChild
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-900 hover:scale-101  transition-transform duration-180 text-white font-medium"
                  >
                    <Link href={`/Signup/${role.id}`}>Sign Up</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-11 hover:scale-101 border-gray-300 text-gray-800 hover:text-blue-600 dark:border-gray-600  transition-transform duration-180 dark:text-gray-200 dark:hover:text-orange-400"
                  >
                    <Link href={`/Login/${role.id}`}>Sign In</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            For technical support, contact:{" "}
            <a href="mailto:support@licet.ac.in" className="underline hover:text-blue-600 dark:hover:text-orange-400">
              isaacKingsley.27csa@licet.ac.in
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
