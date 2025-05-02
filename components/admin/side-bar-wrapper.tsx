import Sidebar from "./side-bar";
import Header from "./header";

export default function SideBarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div
        className={`relative flex flex-1 flex-col ${true ? "ml-72.5" : "ml-0"}`}
      >
        <Header />
        <div className="w-full p-4 md:p-6 2xl:p-10">{children}</div>
      </div>
    </div>
  );
}
