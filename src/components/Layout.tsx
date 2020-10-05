import * as React from "react";
import Navbar from "../components/navbar";
import { Wrapper } from "../components/Wrapper";

export type WrapperVariant = "Small" | "Medium" | "Large";

export interface ILayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<ILayoutProps> = ({ variant, children }) => {
  return (
    <>
      <Navbar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
