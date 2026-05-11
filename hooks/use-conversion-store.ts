import { create } from "zustand";
import type { ConversionResponse } from "@/types/conversion";

type ConversionStore = {
  latest: ConversionResponse | null;
  setLatest: (conversion: ConversionResponse | null) => void;
};

export const useConversionStore = create<ConversionStore>((set) => ({
  latest: null,
  setLatest: (conversion) => set({ latest: conversion }),
}));
