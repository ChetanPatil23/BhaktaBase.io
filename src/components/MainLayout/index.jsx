import React from "react";
import AppHeader from "../AppHeader";

const MainLayout = ({ children, openDrawer, setOpenDrawer, isSmallScreen }) => {
  return (
    <>
      <AppHeader openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      <div style={{ display: "flex", paddingTop: "64px" }}>
        <div
          style={{
            flex: 1,
            paddingLeft:
              openDrawer && !isSmallScreen
                ? "240px"
                : isSmallScreen
                  ? "0px"
                  : "60px",
            transition: "padding-left 0.3s ease",
            width: "100%",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default MainLayout;
