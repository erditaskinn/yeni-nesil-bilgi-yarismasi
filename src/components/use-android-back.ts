"use client";
import { useEffect } from "react";
import { registerBackHandler } from "../lib/native-back";

export function useAndroidBack(handler: () => boolean) {
  useEffect(() => registerBackHandler(handler), [handler]);
}
