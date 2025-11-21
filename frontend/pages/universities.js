import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UniversityFinder from '../components/UniversityFinder';

export default function UniversitiesPage() {
  return (
    <>
      <Head>
        <title>University & College Finder | FutureLinked ZA</title>
        <meta name="description" content="Find and apply to South African universities and colleges. Search courses, view requirements, and apply online." />
        <meta name="keywords" content="South African universities, colleges, courses, applications, tertiary education, UCT, Wits, UP" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <UniversityFinder />
        </main>
        <Footer />
      </div>
    </>
  );
}
