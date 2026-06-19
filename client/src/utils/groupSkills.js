// groupSkills.js: Groups flat skills lists into defined ATS-friendly categories.

const isWordMatch = (str, word) => {
  if (!str || !word) return false;
  // Exact word boundary checks
  const escaped = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const pattern = new RegExp(`(^|[^a-zA-Z0-9+#.])` + escaped + `($|[^a-zA-Z0-9+#.])`, 'i');
  return pattern.test(str);
};

export const groupSkills = (skillsArray = []) => {
  const categoriesDefinition = {
    "Web Development": [
      "html5", "css3", "html", "css", "javascript", "javascript es6", "react.js", "react", "bootstrap", "tailwind css", "tailwind", "vite"
    ],
    "Backend Development": [
      "node.js", "node", "express.js", "express", "spring boot", "spring"
    ],
    "Databases": [
      "mongodb", "mongodb atlas", "mongoose", "mysql", "azure sql", "sql", "postgresql", "postgres", "redis"
    ],
    "Programming Languages": [
      "javascript", "python", "java", "c", "c++", "c#", "ruby", "php", "go", "kotlin", "swift", "rust", "typescript"
    ],
    "Tools & Platforms": [
      "git", "github", "vs code", "vscode", "postman", "npm", "yarn", "docker", "kubernetes", "jira"
    ],
    "APIs & Technologies": [
      "rest api", "restful apis", "api", "apis", "jwt authentication", "jwt auth", "socket.io", "google maps api", "qr code integration", "openai api", "auth0"
    ],
    "Cloud": [
      "microsoft azure", "azure", "google cloud platform", "google cloud", "gcp", "aws", "amazon web services", "cloud"
    ]
  };

  const grouped = {
    "Web Development": [],
    "Backend Development": [],
    "Databases": [],
    "Programming Languages": [],
    "APIs & Technologies": [],
    "Tools & Platforms": [],
    "Cloud": [],
    "Other Skills": []
  };

  const cleanArray = (skillsArray || []).map(s => s && s.trim()).filter(Boolean);

  cleanArray.forEach(skill => {
    const lower = skill.toLowerCase();
    let categoryFound = false;

    // 1. Strict exact check first
    for (const [catName, keywords] of Object.entries(categoriesDefinition)) {
      if (keywords.includes(lower)) {
        grouped[catName].push(skill);
        categoryFound = true;
        break;
      }
    }

    // 2. Bound matching check if not found exactly
    if (!categoryFound) {
      for (const [catName, keywords] of Object.entries(categoriesDefinition)) {
        if (keywords.some(k => isWordMatch(lower, k) || isWordMatch(k, lower))) {
          grouped[catName].push(skill);
          categoryFound = true;
          break;
        }
      }
    }

    // 3. Fallback to Other Skills
    if (!categoryFound) {
      grouped["Other Skills"].push(skill);
    }
  });

  // Filter out empty categories and return the result
  const result = {};
  for (const [catName, list] of Object.entries(grouped)) {
    // Deduplicate list items
    const uniqueList = Array.from(new Set(list));
    if (uniqueList.length > 0) {
      result[catName] = uniqueList;
    }
  }

  return result;
};

export default groupSkills;
