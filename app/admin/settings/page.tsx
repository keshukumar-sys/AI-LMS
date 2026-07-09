"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AiAgentSettings } from "@/components/shared/ai-agent-settings";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Tenant configuration for this workspace.</p>
      </div>

      <AiAgentSettings />

      <Card>
        <CardHeader>
          <CardTitle>Tenant</CardTitle>
          <CardDescription>Multi-company isolation &amp; config storage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Company name</Label>
            <Input defaultValue="Namandarshan" />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input defaultValue="https://namandarshan.example.com" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>CRM, call tools, and HRMS &mdash; production phase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: "CRM (HubSpot)", connected: false },
            { name: "Call system", connected: false },
            { name: "HRMS", connected: false },
          ].map((integration) => (
            <div key={integration.name} className="flex items-center justify-between">
              <span className="text-sm">{integration.name}</span>
              <Switch checked={integration.connected} disabled />
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      <Button onClick={() => toast.success("Settings saved")}>Save changes</Button>
    </div>
  );
}
