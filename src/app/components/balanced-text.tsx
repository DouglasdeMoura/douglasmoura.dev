"use client";

import { Balancer } from "react-wrap-balancer";

export const BalancedText = ({ children }: { children: React.ReactNode }) => (
  <Balancer>{children}</Balancer>
);
