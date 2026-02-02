"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  Send,
  StopCircle,
  Languages,
  User,
  Bot,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  originalContent?: string;
  translated?: boolean;
  timestamp: Date;
}

interface SessionInfo {
  jobTitle: string;
  company: string;
  interviewType: string;
  userLanguage: string;
  interviewerLanguage: string;
  questionsAsked: number;
}

export function InterviewChat({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);

  // Load session info and initial greeting
  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch(`/api/interview/${sessionId}`);
        if (!response.ok) {
          throw new Error("Session not found");
        }
        const data = await response.json();
        setSessionInfo(data.session);
        setMessages(data.messages || []);

        // If no messages, add initial greeting
        if (!data.messages?.length) {
          const greeting = await getInitialGreeting();
          setMessages([greeting]);
        }
      } catch {
        toast({
          title: "Session Error",
          description: "Could not load interview session.",
          variant: "destructive",
        });
        router.push("/interview");
      }
    };

    loadSession();
  }, [sessionId, router, toast]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getInitialGreeting = async (): Promise<Message> => {
    // In production, this would fetch from the API
    return {
      id: "greeting",
      role: "assistant",
      content:
        "Hello! Thank you for joining this interview today. I'm excited to learn more about your background and experience. Let's start with a simple question: Can you tell me a little about yourself and what draws you to this position?",
      timestamp: new Date(),
    };
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || isEnded) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/interview/${sessionId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: data.id || Date.now().toString(),
        role: "assistant",
        content: data.content,
        originalContent: data.originalContent,
        translated: data.translated,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update session info
      if (data.session) {
        setSessionInfo(data.session);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndInterview = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/interview/${sessionId}/end`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to end interview");
      }

      await response.json();

      toast({
        title: "Interview Ended",
        description: "Generating your feedback report...",
      });

      setIsEnded(true);

      // Redirect to feedback page
      router.push(`/interview/${sessionId}/feedback`);
    } catch {
      toast({
        title: "Error",
        description: "Failed to end interview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="border-b bg-background px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-semibold">
              {sessionInfo?.jobTitle || "Interview"} -{" "}
              {sessionInfo?.company || "Practice"}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">{sessionInfo?.interviewType}</Badge>
              <span>•</span>
              <span>Questions: {sessionInfo?.questionsAsked || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTranslation(!showTranslation)}
            >
              <Languages className="mr-2 h-4 w-4" />
              {showTranslation ? "Hide" : "Show"} Translation
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleEndInterview}
              disabled={isLoading}
            >
              <StopCircle className="mr-2 h-4 w-4" />
              End Interview
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="container mx-auto max-w-3xl space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8 shrink-0">
                {message.role === "assistant" ? (
                  <Bot className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Avatar>
              <Card
                className={`max-w-[80%] ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                <CardContent className="p-3">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {showTranslation &&
                    message.translated &&
                    message.originalContent && (
                      <div className="mt-2 border-t pt-2 text-sm opacity-70">
                        <span className="font-medium">Original: </span>
                        {message.originalContent}
                      </div>
                    )}
                </CardContent>
              </Card>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <Bot className="h-5 w-5" />
              </Avatar>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Thinking...
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <div className="container mx-auto max-w-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isEnded ? "Interview ended" : "Type your response..."
              }
              disabled={isLoading || isEnded}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || isEnded || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Press Enter to send. Your responses are analyzed by AI for feedback.
          </p>
        </div>
      </div>
    </div>
  );
}
