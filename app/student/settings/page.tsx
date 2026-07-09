import { AiAgentSettings } from "@/components/shared/ai-agent-settings";

export default function StudentSettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Connect your own AI agent to power the Tutor and Prompt Playground.
        </p>
      </div>
      <AiAgentSettings />
    </div>
  );
}
