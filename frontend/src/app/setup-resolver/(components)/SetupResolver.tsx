import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type React from "react";
import type { SetupResolverProps } from "../types";

const SetupResolver: React.FC<SetupResolverProps> = ({
  resolver,
  error,
  setResolver,
  handleSubmit,
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-12">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit Resolver</CardTitle>
        <CardDescription className="text-gray-600">
          To use Namespace and resolve offchain subnames, users must update
          their ENS name's resolver address to the Namespace Offchain Resolver
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="resolver"
                className="text-sm font-medium text-gray-700"
              >
                Namespace Offchain Resolver:
              </label>
              <Input
                id="resolver"
                value={resolver}
                onChange={(e) => setResolver(e.target.value)}
                placeholder="Enter resolver address"
                className="font-mono"
              />
            </div>
            {error && <span className="text-red-400">{error}</span>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full sm:w-auto">
            Confirm
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SetupResolver;
