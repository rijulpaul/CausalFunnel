import Logo from "@/elements/Logo";
import ViewMode from "@/elements/ViewMode";

const Header = () => {
  return (
    <header className="w-full px-4 py-4 sm:px-6">
      <div className="w-full mx-auto flex flex-col items-center gap-6 sm:gap-[20%] sm:flex-row sm:justify-between">
        <Logo />
        <ViewMode/>
      </div>
    </header>
  );
};

export default Header;
