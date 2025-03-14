import { API_GRAPHQL_URL, API_LOGIN_URL, SKILL_MAPPING } from "../constants";

// Helper: GraphQL fetch
export async function graphqlFetch(jwt: string, query: string) {
  const response = await fetch(API_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();

  if (data.errors && data.errors[0]?.message.includes("JWTExpired")) {
    // Instead of alerting inside the API call, throw an error
    throw new Error("JWTExpired");
  }
  return data;
}

// Fetch user info
export async function fetchUserInfo(jwt: string) {
  const data = await graphqlFetch(
    jwt,
    `{
      user {
        id
        firstName
        lastName
        email
        campus
      }
    }`
  );
  return data.data?.user?.length > 0 ? data.data.user[0] : null;
}

// Fetch audit stats (auditRatio, totalUp, totalDown)
export async function fetchAuditStats(jwt: string) {
  const data = await graphqlFetch(
    jwt,
    `{
      user {
        auditRatio
        totalUp
        totalDown
      }
    }`
  );
  if (data.data?.user?.length > 0) {
    const user = data.data.user[0];
    return {
      auditRatio: user.auditRatio
        ? parseFloat(user.auditRatio.toFixed(1))
        : "No data available",
      totalUp: user.totalUp ?? 0,
      totalDown: user.totalDown ?? 0,
    };
  } else {
    return { auditRatio: "No data available", totalUp: 0, totalDown: 0 };
  }
}

// Fetch user skills and categorize them into technical skills and technologies
export async function fetchUserSkills(jwt: string) {
  const data = await graphqlFetch(
    jwt,
    `{
      transaction(
        where: { type: { _like: "%skill%" }, object: { type: { _eq: "project" } } }
        order_by: [{ type: asc }, { createdAt: desc }]
        distinct_on: type
      ) {
        amount
        type
      }
    }`
  );
  if (data.data?.transaction?.length > 0) {
    const skills = data.data.transaction.map((skill: any) => ({
      type: skill.type.toLowerCase(),
      amount: skill.amount || 0,
    }));

    let technicalSkills: any[] = [];
    let technologies: any[] = [];

    skills.forEach((skill) => {
      if (SKILL_MAPPING.technical.some((ts) => skill.type.includes(ts))) {
        technicalSkills.push(skill);
      } else if (
        SKILL_MAPPING.technology.some((tech) => skill.type.includes(tech))
      ) {
        technologies.push(skill);
      } else {
        console.warn(`Unrecognized Skill: ${skill.type}`);
      }
    });

    technicalSkills = technicalSkills
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
    technologies = technologies.sort((a, b) => b.amount - a.amount).slice(0, 6);

    return { technicalSkills, technologies };
  } else {
    return { technicalSkills: [], technologies: [] };
  }
}

// Fetch user XP data and calculate cumulative XP
export async function fetchUserXp(jwt: string) {
  const data = await graphqlFetch(
    jwt,
    `{
      transaction(
        where: { 
          type: { _eq: "xp" } }
        order_by: { createdAt: asc }
      ) {
        amount
        createdAt
      }
    }`
  );
  if (data.data?.transaction?.length > 0) {
    let cumulative = 0;
    const cumulativeData = data.data.transaction.map((entry: any) => {
      cumulative += Number(entry.amount) / 1000;
      return { xp: cumulative };
    });
    return cumulativeData;
  } else {
    return [];
  }
}

// Fetch audit data (passed and failed audits)
export async function fetchAuditData(jwt: string) {
  const data = await graphqlFetch(
    jwt,
    `{
      user {
        validAudits: audits(where: { grade: { _gte: 1 } }) {
          group { captainLogin path }
        }
        failedAudits: audits(where: { grade: { _lt: 1 } }) {
          group { captainLogin path }
        }
      }
    }`
  );
  if (data.data?.user?.length > 0) {
    const user = data.data.user[0];
    return {
      validAudits: user.validAudits,
      failedAudits: user.failedAudits,
    };
  } else {
    return { validAudits: [], failedAudits: [] };
  }
}

// Login function
export async function login(usernameInput: string, passwordInput: string) {
  const credentials = btoa(`${usernameInput}:${passwordInput}`);
  const response = await fetch(API_LOGIN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || "Unknown error");
  }
  return data; // returns the JWT token
}

export async function fetchUserPosition(jwt: string, userID: number) {
  const query = `
    query getUserPosition($userID: Int!) {
      event(where: { id: { _eq: 72 } }) {
        id
        registrations {
          users(where: { id: { _eq: $userID } }) {
            id
            position
          }
        }
      }
    }
  `;

  const response = await fetch(API_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      query,
      variables: { userID },
    }),
  });
  const data = await response.json();

  if (data.errors && data.errors[0]?.message.includes("JWTExpired")) {
    throw new Error("JWTExpired");
  }

  // Parse the response to extract the user's position.
  if (data.data && data.data.event && data.data.event.length > 0) {
    const event = data.data.event[0];
    if (event.registrations && event.registrations.length > 0) {
      for (const registration of event.registrations) {
        if (registration.users && registration.users.length > 0) {
          return registration.users[0].position;
        }
      }
    }
  }
  return null;
}
