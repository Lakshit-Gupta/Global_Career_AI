import { Metadata } from "next";
import { InterviewFeedback } from "./feedback-content";

interface FeedbackPageProps {
  params: Promise<{ sessionId: string }>;
}

export const metadata: Metadata = {
  title: "Interview Feedback - GlobalHire AI",
  description: "Review your interview performance and get improvement tips",
};

export default async function InterviewFeedbackPage({
  params,
}: FeedbackPageProps) {
  const { sessionId } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <InterviewFeedback sessionId={sessionId} />
    </div>
  );
}
