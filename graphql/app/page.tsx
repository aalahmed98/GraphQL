// page.tsx
"use client";

import React, { useState, useEffect } from "react";
import RadarChart from "../app/components/RadarChart";
import XPProgressChart from "../app/components/graphChart";
import AuditRatioAnimation from "../app/components/AuditRatioAnimation";
import LoginForm from "../app/components/LoginForm";

import {
  login as loginApi,
  fetchUserInfo,
  fetchAuditStats,
  fetchUserSkills,
  fetchUserXp,
  fetchAuditData,
  // If you use fetchUserPosition, uncomment the following:
  // fetchUserPosition,
} from "../app/utils/api";

// Interfaces for type checking
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
  const [auditStats, setAuditStats] = useState<{
    auditRatio: number | string;
    totalUp: number;
    totalDown: number;
  } | null>(null);
  const [userSkills, setUserSkills] = useState<{
    technicalSkills: UserSkill[];
    technologies: UserSkill[];
  } | null>(null);
  const [userXp, setUserXp] = useState<number[] | null>(null);
  const [auditData, setAuditData] = useState<AuditData>({
    validAudits: [],
    failedAudits: [],
  });
  const [userInfo, setUserInfo] = useState<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    campus: string;
  } | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // Load JWT and username from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setJwt(localStorage.getItem("jwt") || "");
      setUsername(localStorage.getItem("username") || "");
    }
  }, []);

  // Fetch all data once JWT is available
  useEffect(() => {
    if (jwt) {
      fetchAuditStats(jwt)
        .then(setAuditStats)
        .catch((err) => console.error("Error fetching audit stats:", err));

      fetchUserSkills(jwt)
        .then(setUserSkills)
        .catch((err) => console.error("Error fetching user skills:", err));

      fetchAuditData(jwt)
        .then(setAuditData)
        .catch((err) => console.error("Error fetching audit data:", err));

      fetchUserInfo(jwt)
        .then((data) => {
          setUserInfo(data);
          // If you also need the user's position, ensure your user info query returns an id,
          // then call fetchUserPosition (uncomment the code below if using it):
          // if (data && data.id) {
          //   fetchUserPosition(jwt, data.id)
          //     .then(setPosition)
          //     .catch((err) => console.error("Error fetching user position:", err));
          // }
        })
        .catch((err) => console.error("Error fetching user info:", err));

      fetchUserXp(jwt)
        .then(setUserXp)
        .catch((err) => console.error("Error fetching XP data:", err));
    }
  }, [jwt]);

  // Login action
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

  // Logout action: clear JWT and reset states
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
        {/* User Information Section */}
        <div className="w-full md:w-1/2 bg-card rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-primary">User Information</h3>
          <ul className="mt-2 text-muted-foreground">
            <li>
              <strong>Name:</strong> {userInfo?.firstName} {userInfo?.lastName}
            </li>
            <li>
              <strong>Email:</strong> {userInfo?.email}
            </li>
            <li>
              <strong>Position:</strong> {position ? position : "Loading..."}
            </li>
            <li>
              <strong>Campus:</strong> {userInfo?.campus}
            </li>
          </ul>
        </div>
        {/* Audit Ratio Animation Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          {auditStats ? (
            <AuditRatioAnimation auditRatio={Number(auditStats.auditRatio)} />
          ) : (
            <p>Loading audit data...</p>
          )}
        </div>
      </div>

      {/* Valid Audits Section */}
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

      {/* Failed Audits Section */}
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

      {/* XP Progress Chart Section */}
      {userXp !== null ? (
        <div className="mt-6">
          <XPProgressChart xpData={userXp} />
        </div>
      ) : (
        <p>Loading XP Data...</p>
      )}

      {/* Skill Radar Section */}
      <h3 className="text-center text-white text-2xl font-bold mb-4">
        Skill Radar
      </h3>
      <div className="radar-charts-container flex flex-wrap justify-center gap-10 items-center">
        {(userSkills?.technicalSkills?.length ?? 0) > 0 ? (
          <div className="w-full md:w-[45%] lg:w-[40%] flex justify-center">
            <RadarChart title="Technical Skills" skills={userSkills?.technicalSkills || []} />
          </div>
        ) : (
          <p className="text-center text-white w-full">
            Loading technical skills...
          </p>
        )}

        {(userSkills?.technologies?.length ?? 0) > 0 ? (
          <div className="w-full md:w-[45%] lg:w-[40%] flex justify-center">
            <RadarChart title="Technologies" skills={userSkills?.technologies || []} />
          </div>
        ) : (
          <p className="text-center text-white w-full">
            Loading technologies...
          </p>
        )}
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
