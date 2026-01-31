import { Metadata } from "next";
import { InterviewChat } from "./interview-chat";

interface InterviewSessionPageProps {
  params: Promise<{ sessionId: string }>;
}

export const metadata: Metadata = {
  title: "Interview Session - GlobalHire AI",
  description: "AI-powered interview practice session",
};

export default async function InterviewSessionPage({
  params,
}: InterviewSessionPageProps) {
  const { sessionId } = await params;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <InterviewChat sessionId={sessionId} />
    </div>
  );
}
