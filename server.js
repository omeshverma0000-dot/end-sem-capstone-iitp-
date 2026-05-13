const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// BASIC SKILL DATw
const skillProfiles = {
     Python: { demand: 90, risk: 20, sustainability: 85, salaryRange: "$90k - $150k", salaryTrend: "Growing", recommendations: ["Machine Learning", "Data Engineering"] },
  Java: { demand: 70, risk: 30, sustainability: 65, salaryRange: "$85k - $140k", salaryTrend: "Stable", recommendations: ["Spring Boot", "Microservices"] },
      React: { demand: 85, risk: 25, sustainability: 78, salaryRange: "$95k - $155k", salaryTrend: "Growing", recommendations: ["Next.js", "TypeScript"] },
  SQL: { demand: 80, risk: 22, sustainability: 75, salaryRange: "$75k - $125k", salaryTrend: "Stable", recommendations: ["Data Analysis", "BI Tools"] }
};

// Simple helper
function getSkill(skill) {
          const key = Object.keys(skillProfiles).find(
    s => s.toLowerCase() === skill.toLowerCase()
  );
  return skillProfiles[key] || null;
}

// Convert scoree
function getLevel(score) {
  if (score >= 80) return "High";
  if (score >= 50) return "Medium";
  return "Low";
}

// SIMPLE ANALYSIS FUNCTION
function createAnalysis(skill, experience, industry) {
  const profile = getSkill(skill) || {
    demand: 65,
    risk: 35,
    sustainability: 60,
    salaryRange: "$70k - $120k",
    salaryTrend: "Moderate",
    recommendations: ["Learn related tools", "Improve fundamentals"]
  };

  // LIGHT adjustments (not over-engineered)
  let demand = profile.demand;
  let risk = profile.risk;
  let sustainability = profile.sustainability;

  if (experience === "Senior") {
    demand += 5;
    sustainability += 5;
  }

  if (industry === "Finance") {
    demand -= 3;
  }

  // Clamp manually (simpler than separate function)
  demand = Math.min(100, Math.max(10, demand));
  risk = Math.min(100, Math.max(5, risk));
  sustainability = Math.min(100, Math.max(10, sustainability));

  // Simple trend (no fancy history logic)
 function buildTrend(demand) {
  if (demand > 85) {
   
   
       return [demand - 5, demand, demand - 2, demand + 3];
  } else if (demand > 65) {
    return [demand - 8, demand + 2, demand + 6, demand + 10];
  } else {
    return [demand - 10, demand - 2, demand + 3, demand + 6];
  }
}
const trend = buildTrend(demand);

  return {
    skill: skill,
    experience,
    industry,
    demand_level: getLevel(demand),
    risk_level: getLevel(100 - risk),
    job_growth: demand > 80 ? "Strong growth" : demand > 60 ? "Moderate growth" : "Mild growth",
      
        status: sustainability > 75 ? "Future-proof" : sustainability > 55 ? "Stable" : "Needs attention",
    sustainability_score: sustainability,
    salary_range: profile.salaryRange,
    salary_trend: profile.salaryTrend,
    recommendations: profile.recommendations,
    trend: trend,
    history: [],
    risk: `${risk}%`,
    error: null
  };
}

// ROUTES (unchanged structure)

app.get("/analyze/:skill", (req, res) => {
  const skill = req.params.skill;
  const experience = req.query.experience || "Mid";
  const industry = req.query.industry || "Technology";

  if (!skill) {
    return res.status(400).json({ error: "Skill required" });
  }

  try {
    const result = createAnalysis(skill, experience, industry);
        res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/compare", (req, res) => {
  const { skill1, skill2, experience, industry } = req.query;

  if (!skill1 || !skill2 || skill1 === skill2) {
    return res.status(400).json({ error: "Invalid skills" });
  }

  try {
    const s1 = createAnalysis(skill1, experience, industry);
            const s2 = createAnalysis(skill2, experience, industry);

    const winner =
      s1.sustainability_score > s2.sustainability_score
        ? s1.skill
        : s2.sustainability_score > s1.sustainability_score
        ? s2.skill
        : "Tie";

    res.json({ skill1: s1, skill2: s2, winner });
  } catch (err) {
    res.status(500).json({ error: "Compare failed" });
  }
});

// STATIC
app.use(express.static(path.join(__dirname, "/")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
