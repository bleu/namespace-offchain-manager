"use client";

import { CopyableField } from "@/components/copyableField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import type React from "react";

interface NewApiKeyDialogContentProps {
  newApiKey: string;
  handleDoneAction: () => void;
  handleSendEmailAction: (email: string) => void;
  initialEmail?: string;
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const NewApiKeyDialogContent: React.FC<NewApiKeyDialogContentProps> = ({
  newApiKey,
  handleDoneAction,
  handleSendEmailAction,
  initialEmail = "",
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailProcessing, setIsEmailProcessing] = useState(false);

  useEffect(() => {
    setIsEmailValid(isValidEmail(email));
  }, [email]);

  const onSendEmail = async () => {
    setIsEmailProcessing(true);
    if (isEmailValid) {
      await handleSendEmailAction(email);
    }

    setIsEmailProcessing(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-yellow-50 p-4">
        <p className="text-sm text-yellow-700">
          Make sure to copy your API key now. You won't be able to see it again.
          If you want to send to an email, you can do so below.
        </p>
      </div>
      <CopyableField label="API Key" value={newApiKey} className="font-mono" />
      <div className="space-y-2">
        <Label htmlFor="email">Fill in your email to send the API key</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email to send API key"
        />
      </div>
      <DialogFooter>
        <Button
          onClick={onSendEmail}
          disabled={!isEmailValid || isEmailProcessing}
        >
          {isEmailProcessing ? "Sending..." : "Send to email"}
        </Button>
        <Button onClick={handleDoneAction}>Done</Button>
      </DialogFooter>
    </div>
  );
};
