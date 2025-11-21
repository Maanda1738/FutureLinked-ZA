import { useState } from 'react';
import { FaUniversity, FaMapMarkerAlt, FaBook, FaGraduationCap, FaCheckCircle, FaExternalLinkAlt, FaSearch, FaFilter } from 'react-icons/fa';

export default function UniversityFinder() {
  // South African Universities and Colleges Database
  const universities = [
    {
      id: 1,
      name: "University of Cape Town (UCT)",
      type: "university",
      province: "Western Cape",
      city: "Cape Town",
      description: "South Africa's oldest university and highest-ranked institution in Africa.",
      website: "https://www.uct.ac.za",
      applicationUrl: "https://www.uct.ac.za/apply",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/72/University_of_Cape_Town_Coat_of_Arms.svg/200px-University_of_Cape_Town_Coat_of_Arms.svg.png",
      rating: 5,
      courses: [
        {
          name: "Bachelor of Science in Computer Science",
          field: "IT & Computer Science",
          duration: "3 years",
          requirements: ["Mathematics: 70%+", "Physical Science: 60%+", "English: 60%+"],
          apsScore: 36,
          fees: "R45,000 - R55,000 per year"
        },
        {
          name: "Bachelor of Commerce (Accounting)",
          field: "Business & Commerce",
          duration: "3 years",
          requirements: ["Mathematics: 65%+", "English: 60%+", "Accounting: 60%+"],
          apsScore: 34,
          fees: "R48,000 - R58,000 per year"
        },
        {
          name: "Bachelor of Medicine and Surgery (MBChB)",
          field: "Health Sciences",
          duration: "6 years",
          requirements: ["Mathematics: 70%+", "Physical Science: 70%+", "Life Sciences: 70%+"],
          apsScore: 40,
          fees: "R65,000 - R75,000 per year"
        }
      ]
    },
    {
      id: 2,
      name: "University of the Witwatersrand (Wits)",
      type: "university",
      province: "Gauteng",
      city: "Johannesburg",
      description: "Leading research university known for excellence in science, engineering, and business.",
      website: "https://www.wits.ac.za",
      applicationUrl: "https://www.wits.ac.za/applications",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/University_of_the_Witwatersrand_Coat_of_Arms.svg/200px-University_of_the_Witwatersrand_Coat_of_Arms.svg.png",
      rating: 5,
      courses: [
        {
          name: "Bachelor of Engineering in Electrical Engineering",
          field: "Engineering",
          duration: "4 years",
          requirements: ["Mathematics: 75%+", "Physical Science: 75%+", "English: 60%+"],
          apsScore: 38,
          fees: "R52,000 - R62,000 per year"
        },
        {
          name: "Bachelor of Arts in Psychology",
          field: "Humanities & Social Sciences",
          duration: "3 years",
          requirements: ["English: 60%+", "Any 3 subjects: 50%+"],
          apsScore: 30,
          fees: "R42,000 - R52,000 per year"
        },
        {
          name: "Bachelor of Science in Data Science",
          field: "IT & Computer Science",
          duration: "3 years",
          requirements: ["Mathematics: 70%+", "Physical Science: 60%+", "English: 60%+"],
          apsScore: 36,
          fees: "R48,000 - R58,000 per year"
        }
      ]
    },
    {
      id: 3,
      name: "University of Pretoria (UP)",
      type: "university",
      province: "Gauteng",
      city: "Pretoria",
      description: "One of the largest universities in South Africa with diverse academic programs.",
      website: "https://www.up.ac.za",
      applicationUrl: "https://www.up.ac.za/admissions",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/86/University_of_Pretoria_logo.svg/200px-University_of_Pretoria_logo.svg.png",
      rating: 5,
      courses: [
        {
          name: "Bachelor of Information Technology",
          field: "IT & Computer Science",
          duration: "3 years",
          requirements: ["Mathematics: 60%+", "English: 50%+"],
          apsScore: 30,
          fees: "R45,000 - R55,000 per year"
        },
        {
          name: "Bachelor of Education (Foundation Phase)",
          field: "Education",
          duration: "4 years",
          requirements: ["English: 60%+", "Mathematics: 50%+"],
          apsScore: 28,
          fees: "R38,000 - R48,000 per year"
        },
        {
          name: "Bachelor of Laws (LLB)",
          field: "Law",
          duration: "4 years",
          requirements: ["English: 70%+", "Mathematics: 60%+"],
          apsScore: 35,
          fees: "R50,000 - R60,000 per year"
        }
      ]
    },
    {
      id: 4,
      name: "Stellenbosch University",
      type: "university",
      province: "Western Cape",
      city: "Stellenbosch",
      description: "Premier research institution with strong programs in science, engineering, and agriculture.",
      website: "https://www.sun.ac.za",
      applicationUrl: "https://www.sun.ac.za/english/apply",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Stellenbosch_University_Logo.svg/200px-Stellenbosch_University_Logo.svg.png",
      rating: 5,
      courses: [
        {
          name: "Bachelor of Science in Agricultural Sciences",
          field: "Agriculture & Natural Resources",
          duration: "4 years",
          requirements: ["Mathematics: 60%+", "Physical Science: 60%+", "Life Sciences: 60%+"],
          apsScore: 32,
          fees: "R44,000 - R54,000 per year"
        },
        {
          name: "Bachelor of Engineering in Mechanical Engineering",
          field: "Engineering",
          duration: "4 years",
          requirements: ["Mathematics: 75%+", "Physical Science: 75%+"],
          apsScore: 38,
          fees: "R52,000 - R62,000 per year"
        }
      ]
    },
    {
      id: 5,
      name: "University of Johannesburg (UJ)",
      type: "university",
      province: "Gauteng",
      city: "Johannesburg",
      description: "Dynamic urban university offering career-focused qualifications.",
      website: "https://www.uj.ac.za",
      applicationUrl: "https://www.uj.ac.za/apply",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/UJ_logo.svg/200px-UJ_logo.svg.png",
      rating: 4,
      courses: [
        {
          name: "Bachelor of Arts in Graphic Design",
          field: "Arts & Design",
          duration: "3 years",
          requirements: ["English: 60%+", "Portfolio required"],
          apsScore: 28,
          fees: "R40,000 - R50,000 per year"
        },
        {
          name: "Bachelor of Commerce in Marketing Management",
          field: "Business & Commerce",
          duration: "3 years",
          requirements: ["Mathematics: 60%+", "English: 60%+"],
          apsScore: 32,
          fees: "R45,000 - R55,000 per year"
        }
      ]
    },
    {
      id: 6,
      name: "Rhodes University",
      type: "university",
      province: "Eastern Cape",
      city: "Grahamstown",
      description: "Small, research-intensive university known for journalism and humanities.",
      website: "https://www.ru.ac.za",
      applicationUrl: "https://www.ru.ac.za/admissions",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Rhodes_University_Logo.svg/200px-Rhodes_University_Logo.svg.png",
      rating: 4,
      courses: [
        {
          name: "Bachelor of Journalism and Media Studies",
          field: "Media & Communication",
          duration: "3 years",
          requirements: ["English: 65%+"],
          apsScore: 30,
          fees: "R42,000 - R52,000 per year"
        }
      ]
    },
    {
      id: 7,
      name: "Tshwane University of Technology (TUT)",
      type: "university_of_technology",
      province: "Gauteng",
      city: "Pretoria",
      description: "Largest residential university of technology providing career-focused education.",
      website: "https://www.tut.ac.za",
      applicationUrl: "https://www.tut.ac.za/apply",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/Tshwane_University_of_Technology_logo.svg/200px-Tshwane_University_of_Technology_logo.svg.png",
      rating: 4,
      courses: [
        {
          name: "National Diploma in Information Technology",
          field: "IT & Computer Science",
          duration: "3 years",
          requirements: ["Mathematics: 50%+", "English: 50%+"],
          apsScore: 24,
          fees: "R35,000 - R45,000 per year"
        },
        {
          name: "National Diploma in Marketing",
          field: "Business & Commerce",
          duration: "3 years",
          requirements: ["Mathematics: 50%+", "English: 50%+"],
          apsScore: 24,
          fees: "R35,000 - R45,000 per year"
        }
      ]
    },
    {
      id: 8,
      name: "Cape Peninsula University of Technology (CPUT)",
      type: "university_of_technology",
      province: "Western Cape",
      city: "Cape Town",
      description: "Technology-focused university with practical, industry-relevant programs.",
      website: "https://www.cput.ac.za",
      applicationUrl: "https://www.cput.ac.za/apply",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/Cape_Peninsula_University_of_Technology_logo.png/200px-Cape_Peninsula_University_of_Technology_logo.png",
      rating: 4,
      courses: [
        {
          name: "National Diploma in Software Development",
          field: "IT & Computer Science",
          duration: "3 years",
          requirements: ["Mathematics: 50%+", "English: 50%+"],
          apsScore: 24,
          fees: "R32,000 - R42,000 per year"
        },
        {
          name: "National Diploma in Hospitality Management",
          field: "Hospitality & Tourism",
          duration: "3 years",
          requirements: ["English: 50%+", "Mathematics: 40%+"],
          apsScore: 22,
          fees: "R30,000 - R40,000 per year"
        }
      ]
    },
    {
      id: 9,
      name: "Durban University of Technology (DUT)",
      type: "university_of_technology",
      province: "KwaZulu-Natal",
      city: "Durban",
      description: "Premier university of technology on the east coast.",
      website: "https://www.dut.ac.za",
      applicationUrl: "https://www.dut.ac.za/apply",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c6/Durban_University_of_Technology_logo.png/200px-Durban_University_of_Technology_logo.png",
      rating: 4,
      courses: [
        {
          name: "National Diploma in Public Relations",
          field: "Media & Communication",
          duration: "3 years",
          requirements: ["English: 50%+"],
          apsScore: 22,
          fees: "R32,000 - R42,000 per year"
        }
      ]
    },
    {
      id: 10,
      name: "University of KwaZulu-Natal (UKZN)",
      type: "university",
      province: "KwaZulu-Natal",
      city: "Durban & Pietermaritzburg",
      description: "Leading research university with multiple campuses across KZN.",
      website: "https://www.ukzn.ac.za",
      applicationUrl: "https://www.ukzn.ac.za/apply",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/35/University_of_KwaZulu-Natal_logo.svg/200px-University_of_KwaZulu-Natal_logo.svg.png",
      rating: 5,
      courses: [
        {
          name: "Bachelor of Science in Nursing",
          field: "Health Sciences",
          duration: "4 years",
          requirements: ["Mathematics: 60%+", "Physical Science: 60%+", "Life Sciences: 60%+"],
          apsScore: 34,
          fees: "R45,000 - R55,000 per year"
        },
        {
          name: "Bachelor of Social Science",
          field: "Humanities & Social Sciences",
          duration: "3 years",
          requirements: ["English: 60%+"],
          apsScore: 28,
          fees: "R40,000 - R50,000 per year"
        }
      ]
    },
    {
      id: 11,
      name: "North-West University (NWU)",
      type: "university",
      province: "North West",
      city: "Potchefstroom, Mahikeng & Vanderbijlpark",
      description: "Multi-campus university offering diverse academic programs.",
      website: "https://www.nwu.ac.za",
      applicationUrl: "https://www.nwu.ac.za/admissions",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/46/North-West_University_logo.svg/200px-North-West_University_logo.svg.png",
      rating: 4,
      courses: [
        {
          name: "Bachelor of Commerce in Economics",
          field: "Business & Commerce",
          duration: "3 years",
          requirements: ["Mathematics: 60%+", "English: 60%+"],
          apsScore: 30,
          fees: "R42,000 - R52,000 per year"
        },
        {
          name: "Bachelor of Engineering in Mining",
          field: "Engineering",
          duration: "4 years",
          requirements: ["Mathematics: 70%+", "Physical Science: 70%+"],
          apsScore: 36,
          fees: "R48,000 - R58,000 per year"
        }
      ]
    },
    {
      id: 12,
      name: "University of the Free State (UFS)",
      type: "university",
      province: "Free State",
      city: "Bloemfontein",
      description: "Historic university with strong agricultural and health sciences programs.",
      website: "https://www.ufs.ac.za",
      applicationUrl: "https://www.ufs.ac.za/apply",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/University_of_the_Free_State_logo.svg/200px-University_of_the_Free_State_logo.svg.png",
      rating: 4,
      courses: [
        {
          name: "Bachelor of Science in Agriculture",
          field: "Agriculture & Natural Resources",
          duration: "4 years",
          requirements: ["Mathematics: 60%+", "Physical Science: 60%+"],
          apsScore: 30,
          fees: "R42,000 - R52,000 per year"
        },
        {
          name: "Bachelor of Health Sciences",
          field: "Health Sciences",
          duration: "4 years",
          requirements: ["Mathematics: 60%+", "Life Sciences: 60%+"],
          apsScore: 32,
          fees: "R45,000 - R55,000 per year"
        }
      ]
    },
    {
      id: 13,
      name: "Nelson Mandela University",
      type: "university",
      province: "Eastern Cape",
      city: "Port Elizabeth (Gqeberha)",
      description: "Comprehensive university focusing on environmental and marine sciences.",
      website: "https://www.mandela.ac.za",
      applicationUrl: "https://www.mandela.ac.za/Apply",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Nelson_Mandela_University_logo.png/200px-Nelson_Mandela_University_logo.png",
      rating: 4,
      courses: [
        {
          name: "Bachelor of Science in Environmental Management",
          field: "Agriculture & Natural Resources",
          duration: "3 years",
          requirements: ["Mathematics: 60%+", "Life Sciences: 60%+"],
          apsScore: 30,
          fees: "R40,000 - R50,000 per year"
        },
        {
          name: "Bachelor of Engineering in Mechatronics",
          field: "Engineering",
          duration: "4 years",
          requirements: ["Mathematics: 75%+", "Physical Science: 75%+"],
          apsScore: 38,
          fees: "R50,000 - R60,000 per year"
        }
      ]
    },
    {
      id: 14,
      name: "Walter Sisulu University",
      type: "university",
      province: "Eastern Cape",
      city: "Mthatha & East London",
      description: "University committed to rural development and community engagement.",
      website: "https://www.wsu.ac.za",
      applicationUrl: "https://www.wsu.ac.za/admissions",
      logo: "📚",
      rating: 3,
      courses: [
        {
          name: "Bachelor of Education",
          field: "Education",
          duration: "4 years",
          requirements: ["English: 50%+", "Mathematics: 50%+"],
          apsScore: 26,
          fees: "R35,000 - R45,000 per year"
        }
      ]
    },
    {
      id: 15,
      name: "University of Limpopo",
      type: "university",
      province: "Limpopo",
      city: "Polokwane",
      description: "Premier university in Limpopo with strong health sciences.",
      website: "https://www.ul.ac.za",
      applicationUrl: "https://www.ul.ac.za/apply",
      logo: "🌳",
      rating: 4,
      courses: [
        {
          name: "Bachelor of Pharmacy",
          field: "Health Sciences",
          duration: "4 years",
          requirements: ["Mathematics: 65%+", "Physical Science: 65%+", "Life Sciences: 65%+"],
          apsScore: 35,
          fees: "R48,000 - R58,000 per year"
        }
      ]
    },
    {
      id: 16,
      name: "University of Venda",
      type: "university",
      province: "Limpopo",
      city: "Thohoyandou",
      description: "Rural-based comprehensive university.",
      website: "https://www.univen.ac.za",
      applicationUrl: "https://www.univen.ac.za/admissions",
      logo: "🎓",
      rating: 3,
      courses: [
        {
          name: "Bachelor of Science in Computer Science",
          field: "IT & Computer Science",
          duration: "3 years",
          requirements: ["Mathematics: 60%+", "Physical Science: 60%+"],
          apsScore: 28,
          fees: "R35,000 - R45,000 per year"
        }
      ]
    },
    {
      id: 17,
      name: "University of Zululand",
      type: "university",
      province: "KwaZulu-Natal",
      city: "KwaDlangezwa",
      description: "Historically advantaged university in rural KZN.",
      website: "https://www.uzulu.ac.za",
      applicationUrl: "https://www.uzulu.ac.za/apply",
      logo: "🦓",
      rating: 3,
      courses: [
        {
          name: "Bachelor of Arts in Public Administration",
          field: "Humanities & Social Sciences",
          duration: "3 years",
          requirements: ["English: 50%+"],
          apsScore: 24,
          fees: "R35,000 - R45,000 per year"
        }
      ]
    },
    {
      id: 18,
      name: "University of Fort Hare",
      type: "university",
      province: "Eastern Cape",
      city: "Alice",
      description: "Historic university where Nelson Mandela studied.",
      website: "https://www.ufh.ac.za",
      applicationUrl: "https://www.ufh.ac.za/admissions",
      logo: "🏛️",
      rating: 3,
      courses: [
        {
          name: "Bachelor of Laws (LLB)",
          field: "Law",
          duration: "4 years",
          requirements: ["English: 60%+", "Mathematics: 60%+"],
          apsScore: 30,
          fees: "R38,000 - R48,000 per year"
        }
      ]
    },
    {
      id: 19,
      name: "Sol Plaatje University",
      type: "university",
      province: "Northern Cape",
      city: "Kimberley",
      description: "New university focusing on heritage and teacher education.",
      website: "https://www.spu.ac.za",
      applicationUrl: "https://www.spu.ac.za/admissions",
      logo: "💎",
      rating: 3,
      courses: [
        {
          name: "Bachelor of Education",
          field: "Education",
          duration: "4 years",
          requirements: ["English: 50%+", "Mathematics: 50%+"],
          apsScore: 26,
          fees: "R38,000 - R48,000 per year"
        }
      ]
    },
    {
      id: 20,
      name: "University of Mpumalanga",
      type: "university",
      province: "Mpumalanga",
      city: "Mbombela (Nelspruit)",
      description: "New university established in 2014.",
      website: "https://www.ump.ac.za",
      applicationUrl: "https://www.ump.ac.za/apply",
      logo: "🌄",
      rating: 3,
      courses: [
        {
          name: "Bachelor of Commerce in Accounting",
          field: "Business & Commerce",
          duration: "3 years",
          requirements: ["Mathematics: 60%+", "English: 60%+"],
          apsScore: 28,
          fees: "R38,000 - R48,000 per year"
        }
      ]
    },
    {
      id: 21,
      name: "Central University of Technology (CUT)",
      type: "university_of_technology",
      province: "Free State",
      city: "Bloemfontein",
      description: "Technology-focused university in the Free State.",
      website: "https://www.cut.ac.za",
      applicationUrl: "https://www.cut.ac.za/apply",
      logo: "⚙️",
      rating: 4,
      courses: [
        {
          name: "National Diploma in Information Technology",
          field: "IT & Computer Science",
          duration: "3 years",
          requirements: ["Mathematics: 50%+", "English: 50%+"],
          apsScore: 24,
          fees: "R32,000 - R42,000 per year"
        }
      ]
    },
    {
      id: 22,
      name: "Vaal University of Technology (VUT)",
      type: "university_of_technology",
      province: "Gauteng",
      city: "Vanderbijlpark",
      description: "Technical university serving the Vaal Triangle region.",
      website: "https://www.vut.ac.za",
      applicationUrl: "https://www.vut.ac.za/apply",
      logo: "🔧",
      rating: 3,
      courses: [
        {
          name: "National Diploma in Mechanical Engineering",
          field: "Engineering",
          duration: "3 years",
          requirements: ["Mathematics: 50%+", "Physical Science: 50%+"],
          apsScore: 24,
          fees: "R35,000 - R45,000 per year"
        }
      ]
    },
    {
      id: 23,
      name: "Mangosuthu University of Technology (MUT)",
      type: "university_of_technology",
      province: "KwaZulu-Natal",
      city: "Umlazi, Durban",
      description: "University of technology focusing on career-oriented education.",
      website: "https://www.mut.ac.za",
      applicationUrl: "https://www.mut.ac.za/apply",
      logo: "🎯",
      rating: 3,
      courses: [
        {
          name: "National Diploma in Engineering",
          field: "Engineering",
          duration: "3 years",
          requirements: ["Mathematics: 50%+", "Physical Science: 50%+"],
          apsScore: 24,
          fees: "R32,000 - R42,000 per year"
        }
      ]
    },
    {
      id: 24,
      name: "Boston City Campus & Business College",
      type: "private_college",
      province: "Multiple",
      city: "Nationwide",
      description: "Leading private college offering business and IT qualifications.",
      website: "https://www.boston.co.za",
      applicationUrl: "https://www.boston.co.za/apply-now",
      logo: "💼",
      rating: 3,
      courses: [
        {
          name: "Higher Certificate in Business Management",
          field: "Business & Commerce",
          duration: "1 year",
          requirements: ["Grade 12 / Matric"],
          apsScore: 18,
          fees: "R28,000 - R35,000 per year"
        },
        {
          name: "Diploma in Information Technology",
          field: "IT & Computer Science",
          duration: "3 years",
          requirements: ["Grade 12 / Matric with Mathematics"],
          apsScore: 20,
          fees: "R32,000 - R40,000 per year"
        }
      ]
    },
    {
      id: 25,
      name: "Damelin College",
      type: "private_college",
      province: "Multiple",
      city: "Nationwide",
      description: "Private college offering technical and business qualifications.",
      website: "https://www.damelin.co.za",
      applicationUrl: "https://www.damelin.co.za/apply",
      logo: "📖",
      rating: 3,
      courses: [
        {
          name: "Higher Certificate in Management",
          field: "Business & Commerce",
          duration: "1 year",
          requirements: ["Grade 12 / Matric"],
          apsScore: 18,
          fees: "R30,000 - R38,000 per year"
        }
      ]
    },
    {
      id: 26,
      name: "STADIO Higher Education",
      type: "private_college",
      province: "Multiple",
      city: "Nationwide",
      description: "Private higher education institution with multiple campuses.",
      website: "https://www.stadio.co.za",
      applicationUrl: "https://www.stadio.co.za/apply",
      logo: "🎓",
      rating: 4,
      courses: [
        {
          name: "Bachelor of Commerce",
          field: "Business & Commerce",
          duration: "3 years",
          requirements: ["Mathematics: 60%+", "English: 60%+"],
          apsScore: 30,
          fees: "R55,000 - R65,000 per year"
        }
      ]
    }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedField, setSelectedField] = useState('all');
  const [filteredUniversities, setFilteredUniversities] = useState(universities);
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  const provinces = ["all", "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Multiple"];
  const types = [
    { value: "all", label: "All Institutions" },
    { value: "university", label: "Universities" },
    { value: "university_of_technology", label: "Universities of Technology" },
    { value: "private_college", label: "Private Colleges" }
  ];
  const fields = [
    "all",
    "IT & Computer Science",
    "Business & Commerce",
    "Engineering",
    "Health Sciences",
    "Arts & Design",
    "Education",
    "Law",
    "Media & Communication",
    "Agriculture & Natural Resources",
    "Hospitality & Tourism",
    "Humanities & Social Sciences"
  ];

  const handleSearch = () => {
    let results = universities;

    if (searchQuery) {
      results = results.filter(uni =>
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.courses.some(course => course.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedProvince !== 'all') {
      results = results.filter(uni => uni.province === selectedProvince);
    }

    if (selectedType !== 'all') {
      results = results.filter(uni => uni.type === selectedType);
    }

    if (selectedField !== 'all') {
      results = results.filter(uni =>
        uni.courses.some(course => course.field === selectedField)
      );
    }

    setFilteredUniversities(results);
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <FaUniversity className="text-purple-600" />
            University & College Finder
          </h1>
          <p className="text-xl text-gray-600">
            Find the perfect institution for your future career
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Bar */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSearch className="inline mr-2" />
                Search Universities or Courses
              </label>
              <input
                type="text"
                placeholder="e.g., Computer Science, UCT, Cape Town..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Province Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2" />
                Province
              </label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {provinces.map(province => (
                  <option key={province} value={province}>
                    {province === 'all' ? 'All Provinces' : province}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaFilter className="inline mr-2" />
                Institution Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Field of Study Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaBook className="inline mr-2" />
              Field of Study
            </label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {fields.map(field => (
                <option key={field} value={field}>
                  {field === 'all' ? 'All Fields' : field}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02]"
          >
            Search Institutions
          </button>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUniversities.map(uni => (
            <div
              key={uni.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
              onClick={() => setSelectedUniversity(uni)}
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                      {uni.logo.startsWith('http') ? (
                        <img src={uni.logo} alt={`${uni.name} logo`} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-4xl">{uni.logo}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{uni.name}</h3>
                      <p className="text-purple-100 flex items-center gap-2 mt-1">
                        <FaMapMarkerAlt /> {uni.city}, {uni.province}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl">{renderStars(uni.rating)}</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-4">{uni.description}</p>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FaGraduationCap className="text-purple-600" />
                    Available Courses ({uni.courses.length})
                  </h4>
                  <ul className="space-y-2">
                    {uni.courses.slice(0, 3).map((course, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                        <span>{course.name}</span>
                      </li>
                    ))}
                  </ul>
                  {uni.courses.length > 3 && (
                    <p className="text-sm text-purple-600 mt-2">
                      +{uni.courses.length - 3} more courses
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit Website
                  </a>
                  <a
                    href={uni.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all text-center flex items-center justify-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Apply Now <FaExternalLinkAlt className="text-sm" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No institutions found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
          </div>
        )}

        {/* University Details Modal */}
        {selectedUniversity && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedUniversity(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-lg p-3 flex items-center justify-center flex-shrink-0">
                      {selectedUniversity.logo.startsWith('http') ? (
                        <img src={selectedUniversity.logo} alt={`${selectedUniversity.name} logo`} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-5xl">{selectedUniversity.logo}</span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{selectedUniversity.name}</h2>
                      <p className="text-purple-100 flex items-center gap-2 mt-2">
                        <FaMapMarkerAlt /> {selectedUniversity.city}, {selectedUniversity.province}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUniversity(null)}
                    className="text-white hover:text-gray-200 text-3xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-lg">{selectedUniversity.description}</p>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaBook className="text-purple-600" />
                  Courses Offered
                </h3>

                <div className="space-y-6">
                  {selectedUniversity.courses.map((course, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600"><strong>Field:</strong> {course.field}</p>
                          <p className="text-sm text-gray-600"><strong>Duration:</strong> {course.duration}</p>
                          <p className="text-sm text-gray-600"><strong>APS Score:</strong> {course.apsScore}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600"><strong>Fees:</strong> {course.fees}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-900 mb-2">Entry Requirements:</h5>
                        <ul className="space-y-1">
                          {course.requirements.map((req, reqIdx) => (
                            <li key={reqIdx} className="flex items-start gap-2 text-sm text-gray-700">
                              <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex gap-4">
                  <a
                    href={selectedUniversity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
                  >
                    Visit Website
                  </a>
                  <a
                    href={selectedUniversity.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all text-center flex items-center justify-center gap-2"
                  >
                    Apply Now <FaExternalLinkAlt />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
