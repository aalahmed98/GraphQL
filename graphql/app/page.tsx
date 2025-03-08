"use client";

import React, { useState, useEffect } from "react";
import RadarChart from "../app/components/RadarChart";
import XPProgressChart from "../app/components/graphChart";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

// AuditStatsCard Component - Circular Gauge for Audit Ratio
const AuditStatsCard = ({ auditRatio }) => {
  const ratioValue = Math.min(Math.max(auditRatio, 0), 2); 

  // Data for circular chart
  const data = [{ name: "Ratio", value: ratioValue * 50 }];

  return (
    <div className="audit-card">
      <h3>Audits ratio</h3>

      <RadialBarChart 
        width={150} 
        height={150} 
        cx="50%" 
        cy="50%" 
        innerRadius="80%" 
        outerRadius="100%" 
        barSize={10} 
        data={data} 
        startAngle={90} 
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar background dataKey="value" fill="#00ff99" />
      </RadialBarChart>

      <div className="audit-ratio">
        <span className="ratio-number">{auditRatio}</span>
      </div>
    </div>
  );
};


// Interfaces
interface AuditGroup {
  captainLogin: string;
  path: string;
}

interface AuditNode {
  group: AuditGroup;
}

interface AuditData {
  validAudits: AuditNode[];
  failedAudits: AuditNode[];
}

interface UserSkill {
  amount: number;
  type: string;
}

export default function Page() {
  const [jwt, setJwt] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setJwt(localStorage.getItem("jwt") || "");
      setUsername(localStorage.getItem("username") || "");
    }
  }, []);
  
  const [auditStats, setAuditStats] = useState<{ auditRatio: number | string | null } | null>(null);
  const [userSkills, setUserSkills] = useState<UserSkill[] | string | null>(null);
  const [userLevel, setUserLevel] = useState<number | string | null>(null);
  const [auditData, setAuditData] = useState<AuditData>({ validAudits: [], failedAudits: [] });
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [userInfo, setUserInfo] = useState<{ firstName: string; lastName: string; email: string; campus: string } | null>(null);
  const [userXp, setUserXp] = useState<number[] | null>(null);



  // GraphQL Fetch Helper
  async function graphqlFetch(query: string) {
    const response = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();

    if (data.errors && data.errors[0]?.message.includes("JWTExpired")) {
      alert("Your session has expired. Please log in again.");
      logout();
      throw new Error("JWTExpired");
    }

    return data;
  }

// Fetch User Information
async function fetchUserInfo() {
  try {
    const data = await graphqlFetch(`{
      user {
        firstName
        lastName
        email
        campus
      }
    }`);

    if (data.data?.user?.length > 0) {
      const user = data.data.user[0];

      setUserInfo({
        firstName: user.firstName || "N/A",
        lastName: user.lastName || "N/A",
        email: user.email || "N/A",
        campus: user.campus || "N/A",
      });
    } else {
      console.warn("No user data available");
      setUserInfo(null);
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    setUserInfo(null);
  }
}
  // Login Function
  async function login(usernameInput: string, passwordInput: string) {
    try {
      const credentials = btoa(`${usernameInput}:${passwordInput}`);
      const response = await fetch("https://learn.reboot01.com/api/auth/signin", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("jwt", data);
        localStorage.setItem("username", usernameInput);
        setJwt(data);
        setUsername(usernameInput);
      } else {
        alert(`Login failed: ${data.error || data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Network or server error during login.");
    }
  }

  // Logout Function
  function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    setJwt("");
    setUsername("");
    setAuditStats(null);
    setUserSkills(null);
    setUserLevel(null);
    setAuditData({ validAudits: [], failedAudits: [] });
  }

  // Fetch Audit Stats (Ratio)
  async function fetchAuditStats() {
    try {
      const data = await graphqlFetch(`{ user { auditRatio } }`);

      if (data.data?.user?.length > 0) {
        const user = data.data.user[0];
        setAuditStats({
          auditRatio: user.auditRatio ? parseFloat(user.auditRatio.toFixed(1)) : "No data available",
        });
      } else {
        setAuditStats({ auditRatio: "No data available" });
      }
    } catch (error) {
      console.error("Error fetching audit stats:", error);
      setAuditStats({ auditRatio: "error" });
    }
  }

  // Fetch User Skills
  async function fetchUserSkills() {
    try {
      const data = await graphqlFetch(`{
        transaction(
          where: { type: { _like: "%skill%" }, object: { type: { _eq: "project" } } }
          order_by: [{ type: asc }, { createdAt: desc }]
          distinct_on: type
        ) {
          amount
          type
        }
      }`);
  
      console.log("Raw Skills Data from API:", data.data?.transaction); // Check if algo is actually returned
  
      if (data.data?.transaction?.length > 0) {
        const skills = data.data.transaction.map(skill => ({
          type: skill.type.toLowerCase(), // Normalize case
          amount: skill.amount || 0, // Ensure zero values are handled properly
        }));
  
        console.log("Processed Skills Before Categorization:", skills);
  
        const skillMapping = {
          technical: [
            "algo", "sys-admin", "front-end", "back-end", "stats", "game_skill", 
            "ai", "tcp/ip", "cybersecurity", "elementary programming",
            "elementary algo", "blockchain", "mobile"
          ],
          technology: [
            "go", "js", "sql", "html", "css", "unix", "docker", "c", "shell",
            "php", "python", "rust", "ruby", "git", "graphql", "c++",
            "ruby on rails", "laravel", "django", "electron"
          ],
        };
  
        let technicalSkills: UserSkill[] = [];
        let technologies: UserSkill[] = [];
  
        skills.forEach(skill => {
          if (skillMapping.technical.some(ts => skill.type.includes(ts))) {
            technicalSkills.push(skill);
          } else if (skillMapping.technology.some(tech => skill.type.includes(tech))) {
            technologies.push(skill);
          } else {
            console.warn(`⚠️ Unrecognized Skill: ${skill.type}`);
          }
        });
  
        console.log("Technical Skills Before Sorting:", technicalSkills);
        console.log("Technologies Before Sorting:", technologies);
  
        // Ensure algo and game_skill are correctly processed
        const algoSkill = technicalSkills.find(skill => skill.type.includes("algo"));
        if (algoSkill) {
          console.log("✅ Algo Skill Detected:", algoSkill);
        } else {
          console.warn("❌ Algo Skill Not Found in Technical Skills");
        }
  
        // Sort skills and limit to top 6
        technicalSkills = technicalSkills.sort((a, b) => b.amount - a.amount).slice(0, 6);
        technologies = technologies.sort((a, b) => b.amount - a.amount).slice(0, 6);
  
        console.log("Top Technical Skills:", technicalSkills);
        console.log("Top Technologies:", technologies);
  
        setUserSkills({ technicalSkills, technologies });
      } else {
        console.warn("No skills returned from API.");
        setUserSkills({ technicalSkills: [], technologies: [] });
      }
    } catch (error) {
      console.error("Error fetching user skills:", error);
      setUserSkills({ technicalSkills: [], technologies: [] });
    }
  }
  
// Fetch User XP
async function fetchUserXp() {
  try {
    const data = await graphqlFetch(`
      {
        transaction(
          where: { type: { _eq: "xp" } }
          order_by: { createdAt: desc }
          limit: 7
        ) {
          amount
        }
      }
    `);

    if (data.data?.transaction?.length > 0) {
      // Ensure the API response is mapped correctly
      setUserXp(
        data.data.transaction.map((entry) => ({
          xp: Number(entry.amount), // Ensure XP values are numbers
        }))
      );
    } else {
      setUserXp([]);
    }
  } catch (error) {
    console.error("Error fetching user XP:", error);
    setUserXp([]);
  }
}


  // Fetch Audit Data (Valid and Failed Audits)
  async function fetchAuditData() {
    try {
      const data = await graphqlFetch(`{
        user {
          validAudits: audits(where: { grade: { _gte: 1 } }) {
            group { captainLogin path }
          }
          failedAudits: audits(where: { grade: { _lt: 1 } }) {
            group { captainLogin path }
          }
        }
      }`);
  
      console.log("Audit Data Response:", data); // Debugging log
  
      if (data.data?.user?.length > 0) {
        const user = data.data.user[0];
  
        setAuditData({
          validAudits: user.validAudits,
          failedAudits: user.failedAudits,
        });
  
        console.log("Valid Audits:", user.validAudits);
        console.log("Failed Audits:", user.failedAudits);
      } else {
        setAuditData({ validAudits: [], failedAudits: [] });
      }
    } catch (error) {
      console.error("Error fetching audit data:", error);
      setAuditData({ validAudits: [], failedAudits: [] });
    }
  }
  

  useEffect(() => {
    if (jwt) {
      fetchAuditStats();
      fetchUserSkills();
      fetchAuditData();
      fetchUserInfo();
      fetchUserXp(); 
    }
  }, [jwt]);

  if (!jwt) {
    return (
      <div id="loginContainer" className="container active">
        <h2>Login</h2>
        <input placeholder="Username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
        <button onClick={() => login(loginUsername, loginPassword)}>Login</button>
      </div>
    );
  }

  return (
    <div id="profileContainer" className="container active">
      <h1>Hello, {username}!</h1>
      <div>
      <div className="flex flex-wrap justify-between items-center">
  {/* Left Section - User Info */}
  <div className="w-full md:w-1/2 bg-card rounded-lg shadow-md p-4">
    <h3 className="text-lg font-semibold text-primary">User Information</h3>
    {userInfo ? (
      <ul className="mt-2 text-muted-foreground">
        <li><strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}</li>
        <li><strong>Email:</strong> {userInfo.email}</li>
        <li><strong>Campus:</strong> {userInfo.campus}</li>
      </ul>
    ) : (
      <p>Loading user info...</p>
    )}
  </div>

  {/* Right Section - Audit Ratio */}
  <div className="w-full md:w-1/2 flex justify-center">
    {auditStats ? <AuditStatsCard auditRatio={auditStats.auditRatio} /> : <p>Loading audit data...</p>}
  </div>
</div>

      </div>

      {/* User XP Display */}
<div className="bg-card rounded-lg shadow-md p-4 mt-4">
  <h3 className="text-lg font-semibold text-primary">User XP</h3>
  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
  {Array.isArray(userXp) && userXp.length > 0 ? userXp[0].xp : "Loading..."}
</p>


</div>


      <h3>Valid Audits</h3>
<ul className="audit-list">
  {auditData?.validAudits?.length > 0 ? (
    auditData.validAudits.slice(0, 4).map((audit, i) => (
      <li key={i} className="audit-item">
        {audit.group.captainLogin} - {audit.group.path.split("/").pop()}
      </li>
    ))
  ) : (
    <li className="audit-item">No valid audits available</li>
  )}
</ul>

<h3>Failed Audits</h3>
<ul className="audit-list">
  {auditData?.failedAudits?.length > 0 ? (
    auditData.failedAudits.slice(0, 4).map((audit, i) => (
      <li key={i} className="audit-item text-red-500">
        {audit.group.captainLogin} - {audit.group.path.split("/").pop()}
      </li>
    ))
  ) : (
    <li className="audit-item text-red-500">No failed audits available</li>
  )}
</ul>

{userXp !== null ? (
  <div className="mt-6">
    <XPProgressChart xpData={userXp} />
  </div>
) : (
  <p>Loading XP Data...</p>
)}

      <h3 className="text-center text-white text-2xl font-bold mb-4">Skill Radar</h3>

{/* Radar Chart Container - Side by Side */}
<div className="radar-charts-container flex flex-wrap justify-center gap-10 items-center">

  {/* Technical Skills Graph */}
  {userSkills?.technicalSkills?.length > 0 ? (
    <div className="w-full md:w-[45%] lg:w-[40%] flex justify-center">
      <RadarChart title="Technical Skills" skills={userSkills.technicalSkills} />
    </div>
  ) : (
    <p className="text-center text-white w-full">Loading technical skills...</p>
  )}

  {/* Technologies Graph */}
  {userSkills?.technologies?.length > 0 ? (
    <div className="w-full md:w-[45%] lg:w-[40%] flex justify-center">
      <RadarChart title="Technologies" skills={userSkills.technologies} />
    </div>
  ) : (
    <p className="text-center text-white w-full">Loading technologies...</p>
  )}

</div>




      <button onClick={logout}>Logout</button>
    </div>
  );
}
