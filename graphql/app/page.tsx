"use client";

import React, { useState, useEffect } from "react";
import RadarChart from "../app/components/RadarChart";

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
  // Retrieve any saved token and username from localStorage
  const [jwt, setJwt] = useState<string>(
    typeof window !== "undefined" ? localStorage.getItem("jwt") || "" : ""
  );
  const [username, setUsername] = useState<string>(
    typeof window !== "undefined" ? localStorage.getItem("username") || "" : ""
  );
  const [auditRatio, setAuditRatio] = useState<number | string | null>(null);
  const [userSkills, setUserSkills] = useState<UserSkill[] | string | null>(null);
  const [userLevel, setUserLevel] = useState<number | string | null>(null);
  const [auditData, setAuditData] = useState<AuditData>({ validAudits: [], failedAudits: [] });
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // Helper function that handles GraphQL requests using the same jwt token
// Helper function that handles GraphQL requests using the same jwt token
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

  // Check for JWT expiration error
  if (data.errors && data.errors[0]?.message.includes("JWTExpired")) {
    alert("Your session has expired. Please log in again.");
    logout();
    throw new Error("JWTExpired");
  }
  
  return data;
}


  // Login function
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
      console.log("Login response:", data);

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

  // Logout function
  function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    setJwt("");
    setUsername("");
    setAuditRatio(null);
    setUserSkills(null);
    setUserLevel(null);
    setAuditData({ validAudits: [], failedAudits: [] });
  }

  // Fetch audit ratio using the helper function
  async function fetchAuditRatio() {
    try {
      const data = await graphqlFetch(`{ user { auditRatio totalUp totalDown } }`);
      console.log("Audit Ratio Response:", data);

      if (data.data && Array.isArray(data.data.user) && data.data.user.length > 0) {
        setAuditRatio(data.data.user[0].auditRatio);
      } else {
        setAuditRatio("No data available");
      }
    } catch (error) {
      console.error("Error fetching audit ratio:", error);
      setAuditRatio("error");
    }
  }

  // Fetch user skills using the helper function
  async function fetchUserSkills() {
    try {
      const data = await graphqlFetch(`{
        transaction(
          where: { type: {_like: "%skill%"}, object: {type: {_eq: "project"}} }
          order_by: [{type: asc}, {createdAt: desc}]
          distinct_on: type
        ) {
          amount
          type
        }
      }`);
      console.log("User Skills Response:", data);

      if (data.data && data.data.transaction) {
        setUserSkills(data.data.transaction);
      } else {
        setUserSkills("No data available");
      }
    } catch (error) {
      console.error("Error fetching user skills:", error);
      setUserSkills("error");
    }
  }

  // Fetch user level using the helper function
  async function fetchUserLevel() {
    try {
      const data = await graphqlFetch(`{
        transaction(
          order_by: {amount: desc}
          limit: 1
          where: { type: {_eq: "level"}, path: {_like: "/bahrain/bh-module%"} }
        ) { amount }
      }`);
      console.log("User Level Response:", data);

      if (data.data && data.data.transaction.length > 0) {
        setUserLevel(data.data.transaction[0].amount);
      } else {
        setUserLevel("No data available");
      }
    } catch (error) {
      console.error("Error fetching user level:", error);
      setUserLevel("error");
    }
  }

  // Fetch audit data using the helper function
  async function fetchAuditData() {
    try {
      const data = await graphqlFetch(`{
        user {
          validAudits: audits_aggregate(where: {grade: {_gte: 1}}) { nodes { group { captainLogin path } } }
          failedAudits: audits_aggregate(where: {grade: {_lt: 1}}) { nodes { group { captainLogin path } } }
        }
      }`);
      console.log("Audit Data Response:", data);

      if (data.data && Array.isArray(data.data.user) && data.data.user.length > 0) {
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
      fetchAuditRatio();
      fetchUserSkills();
      fetchUserLevel();
      fetchAuditData();
    }
  }, [jwt]);

  if (!jwt) {
    return (
      <div id="loginContainer" className="container active">
        <h2>Login</h2>
        <input
          id="username"
          placeholder="Username"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={() => login(loginUsername, loginPassword)}>Login</button>
      </div>
    );
  }

  return (
    <div id="profileContainer" className="container active">
      <h1>Hello, {username}!</h1>
      <p>Audit Ratio: {auditRatio ?? "Loading..."}</p>
      <p>User Level: {userLevel ?? "Loading..."}</p>
      <h3>User Skills</h3>
      <ul>
        {Array.isArray(userSkills) ? (
          userSkills.map((skill, i) => (
            <li key={i}>
              {skill.type}: {skill.amount}
            </li>
          ))
        ) : (
          <li>{userSkills}</li>
        )}
      </ul>
      <h3>Valid Audits</h3>
      <ul>
        {auditData.validAudits && auditData.validAudits.length > 0 ? (
          auditData.validAudits.map((audit, i) => (
            <li key={i}>
              {audit.group.captainLogin} - {audit.group.path}
            </li>
          ))
        ) : (
          <li>No valid audits available</li>
        )}
      </ul>
      <h3>Failed Audits</h3>
      <ul>
        {auditData.failedAudits && auditData.failedAudits.length > 0 ? (
          auditData.failedAudits.map((audit, i) => (
            <li key={i}>
              {audit.group.captainLogin} - {audit.group.path}
            </li>
          ))
        ) : (
          <li>No failed audits available</li>
        )}
      </ul>

      <RadarChart userSkills={userSkills} />


      <button onClick={logout}>Logout</button>
    </div>
  );
}
