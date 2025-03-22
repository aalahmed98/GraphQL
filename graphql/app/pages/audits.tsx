import { useRouter } from "next/router";

interface AuditData {
  validAudits: {
    group: {
      captainLogin: string;
      path: string;
    }
  }[];
}

const AllAuditsPage: React.FC<{ auditData: AuditData }> = ({ auditData }) => {
  const router = useRouter();

  // Create a reversed copy of the validAudits array
  const reversedAudits = auditData.validAudits.slice().reverse();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">All Audits</h1>

      <ul className="w-full max-w-lg space-y-3">
        {reversedAudits.length > 0 ? (
          reversedAudits.map((audit, i) => (
            <li key={i} className="bg-gray-800 p-4 rounded-md shadow-md">
              <p className="font-semibold">{audit.group.captainLogin}</p>
              <p className="text-sm text-gray-400">{audit.group.path}</p>
            </li>
          ))
        ) : (
          <p className="text-center">No audits available</p>
        )}
      </ul>

      <button
        onClick={() => router.push("/")}
        className="mt-6 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default AllAuditsPage;
