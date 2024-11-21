import { NextResponse } from "next/server";
import { z } from "zod";

export const API_ERRORS = {
  NOT_FOUND: "API key not found",
  UNAUTHORIZED: "Unauthorized",
  VALIDATION_ERROR: "Validation error",
  CREATION_ERROR: "Error creating API key",
  FETCH_ERROR: "Error fetching API keys",
  REVOKE_ERROR: "Error revoking API key",
  DELETE_ERROR: "Error deleting API key",
} as const;

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof Error) {
    if (error.message === API_ERRORS.NOT_FOUND) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message === API_ERRORS.UNAUTHORIZED) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: API_ERRORS.VALIDATION_ERROR, details: error.errors },
        { status: 400 },
      );
    }
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
