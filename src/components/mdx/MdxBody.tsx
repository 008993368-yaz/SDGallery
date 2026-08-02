import type { ComponentProps, ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Diagram } from "@/components/diagram/Diagram";
import { prepareMdxSource } from "@/lib/mdx";
import { slugifyHeading } from "@/lib/sections";

function headingText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(headingText).join("");
  }
  if (children && typeof children === "object" && "props" in children) {
    return headingText(
      (children as { props: { children?: ReactNode } }).props.children,
    );
  }
  return "";
}

function Heading({
  as: Tag,
  children,
  ...props
}: ComponentProps<"h2"> & { as: "h1" | "h2" | "h3" | "h4" }) {
  const id = slugifyHeading(headingText(children));
  return (
    <Tag id={id} {...props}>
      {children}
    </Tag>
  );
}

const components = {
  Diagram,
  h1: (props: ComponentProps<"h1">) => <Heading as="h1" {...props} />,
  h2: (props: ComponentProps<"h2">) => <Heading as="h2" {...props} />,
  h3: (props: ComponentProps<"h3">) => <Heading as="h3" {...props} />,
  h4: (props: ComponentProps<"h4">) => <Heading as="h4" {...props} />,
};

export async function MdxBody({ source }: { source: string }) {
  return (
    <div className="mdx-body space-y-4 text-slate-700 [&_a]:text-slate-900 [&_a]:underline [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-slate-100 [&_ul]:list-disc [&_ul]:pl-5">
      <MDXRemote source={prepareMdxSource(source)} components={components} />
    </div>
  );
}
