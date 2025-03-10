// page.tsx
"use client";

import React, { useState, useEffect } from "react";
import RadarChart from "../app/components/RadarChart";
import XPProgressChart from "../app/components/graphChart";
import AuditStatsCard from "../app/components/AuditStatsCard";
import LoginForm from "../app/components/LoginForm"; 

import {
  login as loginApi,
  fetchUserInfo,
  fetchAuditStats,
  fetchUserSkills,
  fetchUserXp,
  fetchAuditData,
} from "../app/utils/api";

// Interfaces
interface AuditGroup {
  captainLogin: string;
  path: string;
}

interface AuditNode {
  group: AuditGroup;
}

export interface AuditData {
  validAudits: AuditNode[];
  failedAudits: AuditNode[];
}

export interface UserSkill {
  amount: number;
  type: string;
}

export default function Page() {

  const [jwt, setJwt] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [auditStats, setAuditStats] = useState<{ auditRatio: number | string; totalUp: number; totalDown: number } | null>(null);
  const [userSkills, setUserSkills] = useState<{ technicalSkills: UserSkill[]; technologies: UserSkill[] } | null>(null);
  const [userXp, setUserXp] = useState<number[] | null>(null);
  const [auditData, setAuditData] = useState<AuditData>({ validAudits: [], failedAudits: [] });
  const [userInfo, setUserInfo] = useState<{ firstName: string; lastName: string; email: string; campus: string } | null>(null);
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setJwt(localStorage.getItem("jwt") || "");
      setUsername(localStorage.getItem("username") || "");
    }
  }, []);

  
  useEffect(() => {
    if (jwt) {
      fetchAuditStats(jwt)
      fetchUserSkills(jwt)
      fetchAuditData(jwt)
      fetchUserInfo(jwt)
      fetchUserXp(jwt)
    }
  }, [jwt]);


  async function handleLogin() {
    try {
      const token = await loginApi(loginUsername, loginPassword);
      alert("Login successful!");
      localStorage.setItem("jwt", token);
      localStorage.setItem("username", loginUsername);
      setJwt(token);
      setUsername(loginUsername);
    } catch (error: any) {
      alert(`Login failed: ${error.message}`);
    }
  }

  // Logout action (reset state and clear localStorage)
  function logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    setJwt("");
    setUsername("");
    setAuditStats(null);
    setUserSkills(null);
    setAuditData({ validAudits: [], failedAudits: [] });
  }

  // If not logged in, render the login form
  if (!jwt) {
    return (
      <LoginForm
        loginUsername={loginUsername}
        loginPassword={loginPassword}
        setLoginUsername={setLoginUsername}
        setLoginPassword={setLoginPassword}
        handleLogin={handleLogin}
      />
    );
  }

  return (
    <div id="profileContainer" className="container active">
      <h1>Hello, {username}!</h1>
      <div className="flex flex-wrap justify-between items-center">
        {/* User Info */}
        <div className="w-full md:w-1/2 bg-card rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-primary">User Information</h3>
          {userInfo ? (
            <ul className="mt-2 text-muted-foreground">
              <li>
                <strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}
              </li>
              <li>
                <strong>Email:</strong> {userInfo.email}
              </li>
              <li>
                <strong>Campus:</strong> {userInfo.campus}
              </li>
            </ul>
          ) : (
            <p>Loading user info...</p>
          )}
        </div>
        {/* Audit Ratio */}
        <div className="w-full md:w-1/2 flex justify-center">
          {auditStats ? (
            <AuditStatsCard
              auditRatio={auditStats.auditRatio}
              totalUp={auditStats.totalUp}
              totalDown={auditStats.totalDown}
            />
          ) : (
            <p>Loading audit data...</p>
          )}
        </div>
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
      <div className="radar-charts-container flex flex-wrap justify-center gap-10 items-center">
        {(userSkills?.technicalSkills?.length ?? 0) > 0 ? (
          <div className="w-full md:w-[45%] lg:w-[40%] flex justify-center">
            <RadarChart title="Technical Skills" skills={userSkills?.technicalSkills || []} />
          </div>
        ) : (
          <p className="text-center text-white w-full">Loading technical skills...</p>
        )}

        {(userSkills?.technologies?.length ?? 0) > 0 ? (
          <div className="w-full md:w-[45%] lg:w-[40%] flex justify-center">
            <RadarChart title="Technologies" skills={userSkills?.technologies || []} />
          </div>
        ) : (
          <p className="text-center text-white w-full">Loading technologies...</p>
        )}
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
