"use client";

import React, { useState, useEffect } from "react";
import RadarChart from "../app/components/RadarChart";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

// AuditStatsCard Component - Circular Gauge for Audit Ratio
const AuditStatsCard = ({ auditRatio }) => {
  // Ensure auditRatio is a number and limit it to a max of 2 (for visual clarity)
  const ratioValue = Math.min(Math.max(auditRatio, 0), 2); 

  // Data for the circular chart
  const data = [{ name: "Ratio", value: ratioValue * 50 }]; // Scale to 100%

  return (
    <div className="audit-card">
      <h3>Audits ratio</h3>

      {/* Circular Ratio Display */}
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

      {/* Display the numeric ratio */}
      <div className="audit-ratio">
        <span className="ratio-number">{auditRatio}</span>
        <span className="status">Almost perfect!</span>
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
  const [jwt, setJwt] = useState<string>(
    typeof window !== "undefined" ? localStorage.getItem("jwt") || "" : ""
  );
  const [username, setUsername] = useState<string>(
    typeof window !== "undefined" ? localStorage.getItem("username") || "" : ""
  );
  const [auditStats, setAuditStats] = useState<{ auditRatio: number | string | null } | null>(null);
  const [userSkills, setUserSkills] = useState<UserSkill[] | string | null>(null);
  const [userLevel, setUserLevel] = useState<number | string | null>(null);
  const [auditData, setAuditData] = useState<AuditData>({ validAudits: [], failedAudits: [] });
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

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

  // Fetch Audit Data (Valid and Failed Audits)
  async function fetchAuditData() {
    try {
      const data = await graphqlFetch(`{
        user {
          validAudits: audits_aggregate(where: {grade: {_gte: 1}}) { nodes { group { captainLogin path } } }
          failedAudits: audits_aggregate(where: {grade: {_lt: 1}}) { nodes { group { captainLogin path } } }
        }
      }`);

      if (data.data?.user?.length > 0) {
        const user = data.data.user[0];
        setAuditData({
          validAudits: user.validAudits.nodes,
          failedAudits: user.failedAudits.nodes,
        });
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
      fetchAuditData();
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

      <h3>Audit Performance</h3>
      {auditStats ? <AuditStatsCard auditRatio={auditStats.auditRatio} /> : <p>Loading audit data...</p>}

      <h3>Valid Audits</h3>
      <ul>
        {auditData.validAudits.slice(0, 4).map((audit, i) => (
          <li key={i}>{audit.group.captainLogin} - {audit.group.path.split("/").pop()}</li>
        ))}
      </ul>

      <h3>Failed Audits</h3>
      <ul>
        {auditData.failedAudits.slice(0, 4).map((audit, i) => (
          <li key={i}>{audit.group.captainLogin} - {audit.group.path.split("/").pop()}</li>
        ))}
      </ul>

      <RadarChart userSkills={userSkills} />
      <button onClick={logout}>Logout</button>
    </div>
  );
}
