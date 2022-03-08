import Header from "../header";
import BottomNav from "../navigations/BottomNavigation";

const Content = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <BottomNav />
    </div>
  );
};

export default Content;
