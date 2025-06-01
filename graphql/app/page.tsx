// page.tsx
"use client";

import React, { useState, useEffect } from "react";
import RadarChart from "../app/components/RadarChart";
import XPProgressChart from "../app/components/graphChart";
import AuditRatioAnimation from "../app/components/AuditRatioAnimation";
import LoginForm from "../app/components/LoginForm";
import VantaBackground from "../app/components/VantaBackground"; // Import the Vanta background

import {
  login as loginApi,
  fetchUserInfo,
  fetchAuditStats,
  fetchUserSkills,
  fetchUserXp,
  fetchAuditData,
  fetchUserPosition,
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

// SVG Icons
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 text-success"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 text-error"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

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
  // State to control which radar chart is displayed: 0 for Technical Skills, 1 for Technologies.
  const [currentRadarIndex, setCurrentRadarIndex] = useState<number>(0);

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
          if (data && data.id) {
            fetchUserPosition(jwt, data.id)
              .then(setPosition)
              .catch((err) =>
                console.error("Error fetching user position:", err)
              );
          }
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

  // If not logged in, render the login form with the background
  if (!jwt) {
    return (
      <>
        <VantaBackground />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-12 h-12 mx-auto mb-4 text-primary"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-muted-foreground mt-2">
                Sign in to access your dashboard
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg backdrop-blur-sm">
              <LoginForm
                loginUsername={loginUsername}
                loginPassword={loginPassword}
                setLoginUsername={setLoginUsername}
                setLoginPassword={setLoginPassword}
                handleLogin={handleLogin}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <VantaBackground />
      <div className="container mx-auto px-4 space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome back, {username}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's an overview of your progress
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* User Info Card */}
          <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserIcon />
              </div>
              <h3 className="font-semibold">User Profile</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">
                  {userInfo?.firstName} {userInfo?.lastName}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{userInfo?.email}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Position</span>
                <span className="font-medium">{position || "Loading..."}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Campus</span>
                <span className="font-medium">{userInfo?.campus}</span>
              </p>
            </div>
          </div>

          {/* Audit Ratio Card */}
          <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <ChartIcon />
              </div>
              <h3 className="font-semibold">Audit Ratio</h3>
            </div>
            {auditStats ? (
              <div className="flex items-center justify-center h-32">
                <AuditRatioAnimation auditRatio={Number(auditStats.auditRatio)} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <div className="animate-pulse text-muted-foreground">
                  Loading...
                </div>
              </div>
            )}
          </div>

          {/* Valid Audits Card */}
          <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircleIcon />
              </div>
              <h3 className="font-semibold">Valid Audits</h3>
            </div>
            <div className="space-y-3">
              {auditData?.validAudits?.length > 0 ? (
                auditData.validAudits.slice(0, 4).map((audit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <CheckCircleIcon />
                    <span className="text-sm truncate">
                      {audit.group.captainLogin} -{" "}
                      {audit.group.path.split("/").pop()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  No valid audits available
                </p>
              )}
            </div>
          </div>

          {/* Failed Audits Card */}
          <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-error/10 rounded-lg">
                <XCircleIcon />
              </div>
              <h3 className="font-semibold">Failed Audits</h3>
            </div>
            <div className="space-y-3">
              {auditData?.failedAudits?.length > 0 ? (
                auditData.failedAudits.slice(0, 4).map((audit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <XCircleIcon />
                    <span className="text-sm truncate">
                      {audit.group.captainLogin} -{" "}
                      {audit.group.path.split("/").pop()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  No failed audits available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* XP Progress Section */}
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-6">XP Progress</h3>
          {userXp !== null ? (
            <XPProgressChart xpData={userXp.map(xp => ({ xp }))} />
          ) : (
            <div className="flex items-center justify-center h-48">
              <div className="animate-pulse text-muted-foreground">
                Loading XP data...
              </div>
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Skill Analysis</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentRadarIndex(0)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentRadarIndex === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Technical Skills
              </button>
              <button
                onClick={() => setCurrentRadarIndex(1)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentRadarIndex === 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Technologies
              </button>
            </div>
          </div>
          {userSkills ? (
            <div className="flex justify-center">
              <RadarChart
                title={
                  currentRadarIndex === 0 ? "Technical Skills" : "Technologies"
                }
                skills={
                  currentRadarIndex === 0
                    ? userSkills.technicalSkills
                    : userSkills.technologies
                }
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-muted-foreground">
                Loading skills data...
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
